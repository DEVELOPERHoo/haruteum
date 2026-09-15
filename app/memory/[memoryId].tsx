// app/memory/[memoryId].tsx
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { apiRequest } from "../../services/apiClient";
import { getFormattedDate } from "../../utils/dateFormat";
import { getEmotionEmoji } from "../../constants/emotions";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

export default function MemoryDetailScreen() {
  const router = useRouter();
  const { memoryId } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    fetchMemoryDetail();
  }, [memoryId]);

  const fetchMemoryDetail = async () => {
    try {
      const res = await apiRequest(`/api/v1/memory/${memoryId}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.log("상세 조회 에러:", error);
      if (error.message === "로그인 필요") {
        router.replace("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#D4A59A" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#3E2723" }}>데이터를 불러올 수 없어요 🌙</Text>
      </View>
    );
  }

  const formattedDate = getFormattedDate(new Date(data.createdAt));
  const matchedEmotion = getEmotionEmoji(data.emotions?.[0]);

  const photos = data.images?.length > 0 ? data.images : [];

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 뒤로가기 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <View style={styles.buttonRow}>
            <ArrowLeft size={16} color="rgba(136,136,136,0.6)" />
            <Text style={styles.backButtonText}> 돌아가기</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.mainCard}>
          {/* 사진 슬라이더 */}
          {photos.length > 0 && (
            <View style={styles.imageSliderWrapper}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / CARD_WIDTH,
                  );
                  setActivePhotoIndex(index);
                }}
                scrollEventThrottle={16}
              >
                {photos.map((uri: string, index: number) => (
                  <View
                    key={index}
                    style={{ width: CARD_WIDTH, aspectRatio: 4 / 3 }}
                  >
                    <Image
                      source={{ uri }}
                      style={styles.diaryImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
              <View style={styles.photoCountBadge}>
                <Text style={styles.photoCountText}>
                  {activePhotoIndex + 1} / {photos.length}
                </Text>
              </View>
            </View>
          )}

          {/* 날짜 */}
          <View style={styles.cardHeader}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          {/* AI 요약 */}
          <View style={styles.summaryWrapper}>
            <Text style={styles.summaryText}>"{data.summary}"</Text>
          </View>

          <View style={styles.divider} />

          {/* 행복 지수 */}
          <View style={styles.sectionPadding}>
            <View style={styles.rowJustify}>
              <Text style={styles.sectionLabel}>행복 지수</Text>
              <Text style={styles.scoreText}>{data.happyScore}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${data.happyScore}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* 감정 */}
          <View style={[styles.rowJustify, styles.sectionPadding]}>
            <Text style={styles.sectionLabel}>감정</Text>
            <View style={styles.moodBadge}>
              <Text style={styles.moodEmoji}>{matchedEmotion.emoji}</Text>
              <Text style={styles.moodLabel}>{matchedEmotion.label}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 추천 음악 */}
          <View style={styles.quoteWrapper}>
            <Text style={styles.quoteLabel}>🎵 오늘 하루 어울리는 노래</Text>
            <Text style={styles.musicTitleText}>
              {data.recommendedSong || "추천 음악이 없습니다"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FAF7F5" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF7F5",
  },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  backButton: { marginBottom: 16, alignSelf: "flex-start", paddingVertical: 4 },
  backButtonText: {
    fontSize: 14,
    color: "rgba(136,136,136,0.6)",
    letterSpacing: -0.3,
  },
  buttonRow: { flexDirection: "row", alignItems: "center" },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  imageSliderWrapper: {
    width: "100%",
    aspectRatio: 4 / 3,
    position: "relative",
  },
  diaryImage: { width: "100%", height: "100%" },
  photoCountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  photoCountText: { color: "#FFFFFF", fontSize: 10, fontWeight: "600" },
  cardHeader: { paddingTop: 24, paddingBottom: 16, alignItems: "center" },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E2723",
    letterSpacing: -0.3,
  },
  summaryWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 17,
    lineHeight: 28,
    color: "#4E342E",
    textAlign: "center",
  },
  divider: { height: 1, backgroundColor: "#F4EDE9", marginHorizontal: 24 },
  rowJustify: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionPadding: { paddingHorizontal: 24, paddingVertical: 18 },
  sectionLabel: {
    fontSize: 13,
    color: "rgba(136,136,136,0.7)",
    letterSpacing: 0.5,
  },
  scoreText: { fontSize: 18, fontWeight: "700", color: "#D4A59A" },
  progressBarTrack: {
    height: 10,
    backgroundColor: "#F5ECE9",
    borderRadius: 10,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#D4A59A",
    borderRadius: 10,
  },
  moodBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  moodEmoji: { fontSize: 22 },
  moodLabel: { fontSize: 15, color: "#3E2723", fontWeight: "500" },
  quoteWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: "center",
  },
  quoteLabel: {
    fontSize: 11,
    color: "rgba(136,136,136,0.6)",
    letterSpacing: 2,
    fontWeight: "600",
    marginBottom: 12,
  },
  musicTitleText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3E2723",
    lineHeight: 24,
    textAlign: "center",
  },
});
