// app/diary-result.tsx
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useRouter, Stack } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ArrowLeft, ExternalLink } from "lucide-react-native";

import { getFormattedDate } from "../utils/dateFormat";
import { useDiaryStore } from "../store/diaryStore";
import { getEmotionEmoji } from "../constants/emotions";
import { BASE_URL } from "../constants/config";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

export default function DiaryResultScreen() {
  const router = useRouter();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const viewShotRef = useRef<any>(null);

  const { resultData, resetForm } = useDiaryStore();
  // 만약 유저가 비정상적인 경로(새로고침 등)로 들어왔을 때 튕기는 것만 가볍게 방어하고 바로 리턴 처리
  if (!resultData) {
    return null;
  }
  const dateObj = new Date(resultData.createdAt);
  const formattedDate = getFormattedDate(dateObj);

  const matchedEmotion = getEmotionEmoji(resultData.emotions?.[0] || "happy");

  const photos =
    resultData.images && resultData.images.length > 0
      ? resultData.images.map((img) =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`,
        )
      : ["https://picsum.photos/800/1000?random=1"];

  const happinessScore = resultData.happyScore ?? 50;
  const summaryText = resultData.summary;
  const todayMusic = resultData.recommendedSong || "추천 음악이 없습니다";
  const mode = resultData.mode;

  const handlePhotoScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / CARD_WIDTH);
    setActivePhotoIndex(index);
  };

  const handleExit = () => {
    resetForm();
    router.back();
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("공유불가", "이 기기에서는 공유를 지원하지 않아요.");
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "오늘의 하루 공유하기",
      });
    } catch (error) {
      console.log("공유 에러:", error);
      Alert.alert("오류", "공유 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleExit}
          style={styles.backButton}
        >
          <View style={styles.buttonContentRow}>
            <ArrowLeft size={16} color="rgba(136, 136, 136, 0.6)" />
            <Text style={styles.backButtonText}> 돌아가기</Text>
          </View>
        </TouchableOpacity>

        {/* 🤍 일체형 매거진 카드 */}
        <View style={styles.mainCard}>
          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
            {/* 📸 가로 슬라이드 사진 영역 */}
            {photos && photos.length > 0 && (
              <View style={styles.imageSliderWrapper}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handlePhotoScroll}
                  scrollEventThrottle={16}
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

                {/* 장수 표시 인디케이터 */}
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

            {/* 날짜 헤더 (dateFormat.ts와 동일 규격의 실시간 날짜 반영 완료 ✨) */}
            <View
              style={[
                styles.cardHeader,
                photos.length === 0 && { paddingTop: 28 },
              ]}
            >
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            {/* AI 요약 메시지 */}
            <View style={styles.summaryWrapper}>
              <Text style={styles.summaryText}>"{summaryText}"</Text>
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

            {/* 감정 뱃지 (EMOTION_LIST 상수의 매칭 데이터 연동 완료 ✨) */}
            <View>
              <View style={styles.divider} />
              <View style={[styles.rowJustify, styles.sectionPadding]}>
                <Text style={styles.sectionLabel}>감정</Text>
                <View style={styles.moodBadge}>
                  <Text style={styles.moodEmoji}>{matchedEmotion.emoji}</Text>
                  <Text style={styles.moodLabel}>{matchedEmotion.label}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 🌟 오늘 하루 어울리는 노래 컴포넌트 */}
            <View style={styles.quoteWrapper}>
              <View style={styles.quoteHeader}>
                <View style={styles.buttonContentRow}>
                  <Text style={styles.musicEmojiIcon}>🎵</Text>
                  <Text style={styles.quoteLabel}>오늘 하루 어울리는 노래</Text>
                </View>
              </View>
              <Text style={styles.musicTitleText}>{todayMusic}</Text>
            </View>
          </ViewShot>
        </View>

        {/* 🔘 하단 버튼 영역 */}
        <View style={styles.bottomArea}>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionMainButton}
          >
            <View style={styles.buttonContentRow}>
              <Download size={16} color="#FFFFFF" />
              <Text style={styles.actionMainButtonText}>
                이 순간을 저장하기
              </Text>
            </View>
          </TouchableOpacity> */}

          {/* 2. 링크 공유하기 (깔끔하고 정갈한 화이트 풀 바) */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionSubButton}
            onPress={handleShare}
          >
            <View style={styles.buttonContentRow}>
              <ExternalLink size={16} color="#3E2723" />
              <Text style={styles.actionSubButtonText}>친구에게 공유하기</Text>
            </View>
          </TouchableOpacity>

          {/* 3. 함께로 공유하기 (솔로 모드일 때만 수줍게 등장하는 연한 핑크 톤 풀 바) */}
          {mode === "solo" && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionShareButton}
            >
              <View style={styles.buttonContentRow}>
                <AntDesign name="heart" size={14} color="#D4A59A" />
                <Text style={styles.actionShareButtonText}>
                  연인과 함께 다이어리로 공유하기
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// 매거진 감성 스타일시트 (기존과 동일하므로 결 유지)
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
    paddingVertical: 26,
    alignItems: "center",
  },
  quoteHeader: { marginBottom: 12 },
  quoteLabel: {
    fontSize: 11,
    color: "rgba(136, 136, 136, 0.6)",
    letterSpacing: 2,
    fontWeight: "600",
  },
  musicEmojiIcon: {
    fontSize: 12,
    color: "#D4A59A",
    marginTop: Platform.OS === "ios" ? -2 : 0,
  },
  musicTitleText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3E2723",
    lineHeight: 24,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  // 🔘 하단 버튼 영역 전체 컨테이너
  bottomArea: {
    width: "100%",
    marginTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    gap: 10, // 버튼들 사이의 간격을 정갈하게 고정
  },

  // 1. 메인 이미지 저장 버튼 (꽉 찬 로즈 베이지 톤으로 시선 집중)
  actionMainButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#D4A59A",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#D4A59A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionMainButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: -0.3,
  },

  // 2. 서브 링크 공유 버튼 (매거진 감성의 깔끔한 밀크 화이트 바)
  actionSubButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEDFDC",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  actionSubButtonText: {
    fontSize: 15,
    color: "#3E2723",
    fontWeight: "500",
    letterSpacing: -0.3,
  },

  // 3. 함께로 공유하기 버튼 (은은하고 낭만적인 파스텔 초코 핑크 톤 바)
  actionShareButton: {
    width: "100%",
    height: 54,
    backgroundColor: "rgba(212, 165, 154, 0.12)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  actionShareButtonText: {
    fontSize: 14,
    color: "#D4A59A",
    fontWeight: "600",
    letterSpacing: -0.3,
  },

  // 공용 아이콘 + 텍스트 행 정렬 툴
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
