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
  Download,
  ExternalLink,
  BookmarkPlus,
} from "lucide-react-native";

// 🌟 프로젝트 공용 상태/유틸/상수 임포트
import { getFormattedDate } from "../utils/dateFormat";
import { useDiaryStore } from "../store/diaryStore";
import { EMOTION_LIST } from "../constants/emotions"; // 👈 내장 감정 리스트 상수가 있는 경로로 맞춰줘!

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

export default function DiaryResultScreen() {
  const router = useRouter();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // 1. 스토어에서 백엔드가 내려준 진짜 응답 데이터와 청소 함수 가져오기
  const { resultData, resetForm } = useDiaryStore();

  // 🌟 정석적인 예외 방어 코드:
  // 만약 유저가 비정상적인 경로(새로고침 등)로 들어왔을 때 튕기는 것만 가볍게 방어하고 바로 리턴 처리
  if (!resultData) {
    return null;
  }

  const dateObj = new Date(resultData.createdAt);
  const formattedDate = getFormattedDate(dateObj); // 👈 수정된 함수에 서버 날짜 쏙 넣기

  // 🌟 4. 감정 데이터 매핑 처리 (EMOTION_LIST 활용)
  // 백엔드가 준 영어 감정 아이디 (예: "happy")를 내장 리스트에서 찾아서 이모지와 라벨을 복사해옵니다.
  const rawEmotionId = resultData.emotions?.[0] || "happy";
  const matchedEmotion = EMOTION_LIST.find(
    (item) => item.id.toLowerCase() === rawEmotionId.toLowerCase(),
  ) || { id: "happy", emoji: "☺️", label: "행복해" }; // 못 찾으면 행복해를 디폴트로 방어

  const backendBaseUrl = process.env.EXPO_PUBLIC_API_URL;
  // 5. 기타 데이터 바인딩
  const photos =
    resultData.images && resultData.images.length > 0
      ? resultData.images.map((img) =>
          img.startsWith("http") ? img : `${backendBaseUrl}${img}`,
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
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.mainButton}
            onPress={handleExit}
          >
            <View style={styles.buttonContentRow}>
              <BookmarkPlus size={16} color="#FFFFFF" />
              <Text style={styles.mainButtonText}>나만의 히스토리 저장 </Text>
              <AntDesign
                name="heart"
                size={12}
                color="#FFFFFF"
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>

          {/* 함께로 공유하기 버튼 */}
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
