// app/diary-result.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  ArrowLeft,
  Sparkles,
  Download,
  ExternalLink,
  BookmarkPlus,
} from "lucide-react-native";

// 🌟 화면 너비를 가져와서 카드의 정확한 가로폭을 계산합니다.
const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40; // 양쪽 패딩 20씩 제외

interface DiaryResultProps {
  mode?: "solo" | "together";
  year?: number;
  month?: number;
  day?: number;
  weekday?: string;
  photos?: string[];
  happinessScore?: number;
  mood?: string;
  moodData?: { label: string; summary?: string } | null;
  setShowSummary?: (show: boolean) => void;
}

export default function DiaryResultScreen({
  mode = "solo", // 테스트를 위해 solo로 설정 (공유하기 버튼 보이게)
  year = 2026,
  month = 5,
  day = 29,
  weekday = "금",
  // 🌟 테스트용 사진 3장 샘플 (나중에 실제 데이터로 연동해!)
  photos = [
    "https://picsum.photos/800/1000?random=1",
    "https://picsum.photos/800/1000?random=2",
    "https://picsum.photos/800/1000?random=3",
  ],
  happinessScore = 85,
  mood = "🥰",
  moodData = { label: "사랑해", summary: "다정함으로 가득 찬" },
  setShowSummary,
}: DiaryResultProps) {
  const router = useRouter();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const summaryText =
    mode === "solo"
      ? `오늘 하루도 수고했어요.\n작은 것들 속에서 행복을 찾은,\n${moodData?.summary || "특별했던"} 하루였네요`
      : `오늘 둘이 함께한 시간이\n${moodData?.summary || "특별했던"} 하루였네요`;

  const todayQuote =
    mode === "solo"
      ? "오늘 하루도 잘 버텼어요, 내일도 화이팅"
      : "오늘도 함께여서 행복했어요";

  // 가로 스크롤 시 인덱스를 계산하는 함수
  const handlePhotoScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / CARD_WIDTH);
    setActivePhotoIndex(index);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            setShowSummary ? setShowSummary(false) : router.back()
          }
          style={styles.backButton}
        >
          <View style={styles.buttonContentRow}>
            <ArrowLeft size={16} color="rgba(136, 136, 136, 0.6)" />
            <Text style={styles.backButtonText}> 돌아가기</Text>
          </View>
        </TouchableOpacity>

        {/* 🤍 일체형 매거진 카드 */}
        <View style={styles.mainCard}>
          {/* 📸 가로 슬라이드 사진 영역 */}
          {photos && photos.length > 0 && (
            <View style={styles.imageSliderWrapper}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handlePhotoScroll}
                scrollEventThrottle={16}
                // 안드로이드에서 스크롤 충돌을 방지하기 위한 핵심 속성
                nestedScrollEnabled={true}
              >
                {photos.map((uri, index) => (
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

              {/* 장수 표시 인디케이터 (예: 1/3) */}
              <View style={styles.photoCountBadge}>
                <Text style={styles.photoCountText}>
                  {activePhotoIndex + 1} / {photos.length}
                </Text>
              </View>

              <Text style={styles.imageTagText}>
                {mode === "solo" ? "MY MEMORY" : "OUR STORY"}
              </Text>
            </View>
          )}

          {/* 날짜 헤더 */}
          <View
            style={[
              styles.cardHeader,
              photos.length === 0 && { paddingTop: 28 },
            ]}
          >
            <Text style={styles.dateText}>
              {year}.{String(month).padStart(2, "0")}.
              {String(day).padStart(2, "0")} {weekday}요일
            </Text>
          </View>

          {/* AI 요약 메시지 */}
          <View style={styles.summaryWrapper}>
            <Text style={styles.summaryText}>"{summaryText}" 🌙</Text>
          </View>

          <View style={styles.divider} />

          {/* 행복 지수 */}
          <View style={styles.sectionPadding}>
            <View style={styles.rowJustify}>
              <Text style={styles.sectionLabel}>행복 지수</Text>
              <Text style={styles.scoreText}>{happinessScore}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${happinessScore}%` },
                ]}
              />
            </View>
          </View>

          {/* 감정 뱃지 */}
          {mood && moodData && (
            <View>
              <View style={styles.divider} />
              <View style={[styles.rowJustify, styles.sectionPadding]}>
                <Text style={styles.sectionLabel}>감정</Text>
                <View style={styles.moodBadge}>
                  <Text style={styles.moodEmoji}>{mood}</Text>
                  <Text style={styles.moodLabel}>{moodData.label}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* 오늘의 한마디 */}
          <View style={styles.quoteWrapper}>
            <View style={styles.quoteHeader}>
              <View style={styles.buttonContentRow}>
                <Sparkles size={14} color="#D4A59A" />
                <Text style={styles.quoteLabel}>오늘의 한마디</Text>
              </View>
            </View>
            <Text style={styles.quoteText}>
              "{todayQuote}" {mode === "solo" ? "💪" : "💕"}
            </Text>
          </View>
        </View>

        {/* 🔘 하단 버튼 영역 */}
        <View style={styles.bottomArea}>
          <View style={styles.buttonRow}>
            <TouchableOpacity activeOpacity={0.8} style={styles.subButton}>
              <View style={styles.buttonContentRow}>
                <Download size={15} color="#3E2723" />
                <Text style={styles.subButtonText}>이미지 저장</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.subButton}>
              <View style={styles.buttonContentRow}>
                <ExternalLink size={15} color="#3E2723" />
                <Text style={styles.subButtonText}>공유하기</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 기록 저장하기 버튼 */}
          <TouchableOpacity activeOpacity={0.8} style={styles.mainButton}>
            <View style={styles.buttonContentRow}>
              <BookmarkPlus size={16} color="#FFFFFF" />
              <Text style={styles.mainButtonText}>기록 저장하기 </Text>
              <AntDesign
                name="heart"
                size={12}
                color="#FFFFFF"
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>

          {/* 💖 [중요] 함께로 공유하기 버튼 (solo 모드일 때만) */}
          {mode === "solo" && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.soloShareButton}
            >
              <View style={styles.buttonContentRow}>
                <AntDesign name="heart" size={14} color="#D4A59A" />
                <Text style={styles.soloShareButtonText}>함께로 공유하기</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FAF7F5" },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

  backButton: { marginBottom: 16, alignSelf: "flex-start", paddingVertical: 4 },
  backButtonText: {
    fontSize: 14,
    color: "rgba(136, 136, 136, 0.6)",
    letterSpacing: -0.3,
  },

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

  // 사진 슬라이더 관련 스타일
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
  imageTagText: {
    position: "absolute",
    bottom: 12,
    right: 16,
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 2,
    fontWeight: "600",
  },

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
    color: "rgba(136, 136, 136, 0.7)",
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
    paddingVertical: 24,
    alignItems: "center",
  },
  quoteHeader: { marginBottom: 10 },
  quoteLabel: {
    fontSize: 11,
    color: "rgba(136, 136, 136, 0.6)",
    letterSpacing: 2,
  },
  quoteText: {
    fontSize: 15,
    color: "#3E2723",
    lineHeight: 24,
    textAlign: "center",
  },

  bottomArea: {
    width: "100%",
    marginTop: 8,
    paddingBottom: Platform.OS === "ios" ? 12 : 4,
  },
  buttonRow: { flexDirection: "row", gap: 12, marginBottom: 12 },

  subButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEDFDC",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  subButtonText: { fontSize: 14, color: "#3E2723", fontWeight: "500" },

  mainButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#D4A59A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  mainButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  soloShareButton: {
    width: "100%",
    height: 48,
    backgroundColor: "rgba(212, 165, 154, 0.12)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  soloShareButtonText: { fontSize: 14, color: "#D4A59A", fontWeight: "600" },

  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
});
