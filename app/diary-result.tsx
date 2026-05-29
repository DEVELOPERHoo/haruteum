// app/diary-result.tsx
import React from "react";
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

const { width } = Dimensions.get("window");

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
  mode = "solo",
  year = 2026,
  month = 5,
  day = 29,
  weekday = "금",
  photos = [],
  happinessScore = 85,
  mood = "🥰",
  moodData = { label: "사랑해", summary: "다정함으로 가득 찬" },
  setShowSummary,
}: DiaryResultProps) {
  const router = useRouter();

  const summaryText =
    mode === "solo"
      ? `오늘 하루도 수고했어요.\n작은 것들 속에서 행복을 찾은,\n${moodData?.summary || "특별했던"} 하루였네요`
      : `오늘 둘이 함께한 시간이\n${moodData?.summary || "특별했던"} 하루였네요`;

  const todayQuote =
    mode === "solo"
      ? "오늘 하루도 잘 버텼어요, 내일도 화이팅"
      : "오늘도 함께여서 행복했어요";

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
          <Text style={styles.backButtonFlex}>
            <ArrowLeft size={16} color="rgba(136, 136, 136, 0.6)" />
            <Text style={styles.backButtonText}> 돌아가기</Text>
          </Text>
        </TouchableOpacity>

        {/* 일체형 카드 */}
        <View style={styles.mainCard}>
          {/* 날짜 헤더 */}
          <View style={styles.cardHeader}>
            <Text style={styles.dateText}>
              {year}.{String(month).padStart(2, "0")}.
              {String(day).padStart(2, "0")} {weekday}요일
            </Text>
          </View>

          {/* 사진 영역 */}
          {photos && photos.length > 0 && (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: photos[0] }}
                style={styles.diaryImage}
                resizeMode="cover"
              />
            </View>
          )}

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
              <Text style={styles.quoteHeaderFlex}>
                <Sparkles size={14} color="#D4A59A" />
                <Text style={styles.quoteLabel}> 오늘의 한마디</Text>
              </Text>
            </View>
            <Text style={styles.quoteText}>
              "{todayQuote}" {mode === "solo" ? "💪" : "💕"}
            </Text>
          </View>
        </View>

        {/* 🌟 자연스럽게 스크롤 하단에 이어지는 버튼 영역 */}
        <View style={styles.bottomArea}>
          <View style={styles.buttonRow}>
            {/* 1. 이미지 저장 버튼 */}
            <TouchableOpacity activeOpacity={0.8} style={styles.subButton}>
              <View style={styles.buttonContentRow}>
                <Download size={15} color="#3E2723" />
                <Text style={styles.subButtonText}>이미지 저장</Text>
              </View>
            </TouchableOpacity>

            {/* 2. 공유하기 버튼 (아이콘 교체 및 수평 정렬 완벽 보정!) */}
            <TouchableOpacity activeOpacity={0.8} style={styles.subButton}>
              <View style={styles.buttonContentRow}>
                <ExternalLink size={15} color="#3E2723" />
                <Text style={styles.subButtonText}>공유하기</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 3. 기록 저장하기 버튼 */}
          <TouchableOpacity activeOpacity={0.8} style={styles.mainButton}>
            <View style={styles.buttonContentRow}>
              <BookmarkPlus size={16} color="#FFFFFF" />
              <Text style={styles.mainButtonText}>기록 저장하기 </Text>
              <AntDesign
                name="heart"
                size={12}
                color="#FFFFFF"
                style={{ marginLeft: 2 }}
              />
            </View>
          </TouchableOpacity>

          {/* 4. 함께로 공유하기 버튼 */}
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
  // 하단 고정 여백을 줄이고, 자연스러운 끝여백(40)만 주었습니다.
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  backButton: { marginBottom: 16, alignSelf: "flex-start", paddingVertical: 4 },
  backButtonFlex: { flexDirection: "row", alignItems: "center" },
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
    marginBottom: 20, // 👈 카드와 아래 버튼 영역 간격을 넉넉히 벌림
  },
  cardHeader: { paddingTop: 24, paddingBottom: 16, alignItems: "center" },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E2723",
    letterSpacing: -0.3,
  },
  imageWrapper: { paddingHorizontal: 20, paddingBottom: 20 },
  diaryImage: { width: "100%", aspectRatio: 4 / 5, borderRadius: 20 },
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
  quoteHeaderFlex: { flexDirection: "row", alignItems: "center" },
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

  // 🌟 자연스럽게 흐르는 형태로 바뀐 하단 버튼 영역 스타일링
  bottomArea: {
    width: "100%",
    marginTop: 8,
    // 기기별 하단 내비게이션 바 근처 여백 보정
    paddingBottom: Platform.OS === "ios" ? 12 : 4,
  },
  buttonRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  centerIconRow: { textAlign: "center", color: "#3E2723" },
  subButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEDFDC",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    // 버튼들이 흐르는 레이아웃에 어울리도록 가벼운 섀도우 추가
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  subButtonText: { fontSize: 14, color: "#3E2723", fontWeight: "500" },
  mainButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#D4A59A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#D4A59A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
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
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6, // 🌟 아이콘과 텍스트 사이의 황금 간격!
  },
  soloShareButtonText: { fontSize: 14, color: "#D4A59A", fontWeight: "600" },
});
