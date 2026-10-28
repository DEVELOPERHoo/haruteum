// app/home-menu.tsx
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Edit3,
  MapPin,
  CheckSquare,
  Wallet,
  Plus,
  ChevronRight,
} from "lucide-react-native";
import { scale, fontScale } from "../../utils/responsive";
import { useToastStore } from "../../store/useToastStore";
import { useDdayStore } from "../../store/useDdayStore";

export default function HomeMenuScreen() {
  const router = useRouter();
  const { showToast } = useToastStore();

  const { getDaysCount, loadStartDate } = useDdayStore();
  const togetherDays = getDaysCount();

  //추후 API 연동 시 상태값으로 대체할 데이터 변수
  //const togetherDays = 128; // 함께한 일수
  const isPartnerWritten = false; // 상대방 작성 여부

  // 서랍장 메뉴 클릭 처리 헬퍼
  const handleFeaturePress = (featureName: string, path?: string) => {
    if (path) {
      router.push(path as any);
    } else {
      showToast(`${featureName} 기능은 준비 중이에요!`);
    }
  };

  useEffect(() => {
    loadStartDate();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── 상단 네비게이션 헤더 ── */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#3E2723" />
        </TouchableOpacity>
        <Text style={styles.navHeaderTitle}>함께 다이어리</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 상단 디데이 카드 ── */}
        <TouchableOpacity
          style={styles.ddayCard}
          activeOpacity={0.7}
          onPress={() => router.push("/setting-dday")}
        >
          <View style={styles.ddayLeft}>
            <View style={styles.heartCircle}>
              <Heart size={18} color="#D87A68" fill="#D87A68" />
            </View>
            <View>
              <Text style={styles.ddaySub}>우리가 마주한 시간</Text>
              <Text style={styles.ddayTitle}>
                우리 함께한 지 {togetherDays}일
              </Text>
            </View>
          </View>
          <Text style={styles.ddayTag}>D+{togetherDays}</Text>
        </TouchableOpacity>

        {/* ── 오늘 기록하기 메인 카드 ── */}
        <View style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>오늘의 하루틈</Text>
            </View>
            <Text style={styles.statusNotice}>
              {isPartnerWritten
                ? "상대방이 일기를 남겼어요! 💌"
                : "(상대방은 아직 안 썼어요)"}
            </Text>
          </View>

          <Text style={styles.recordMainText}>
            오늘 둘만의 소중한 틈을{"\n"}기록해 볼까요?
          </Text>

          {/* 일기 작성 진입 버튼 */}
          <TouchableOpacity
            style={styles.writeButton}
            activeOpacity={0.8}
            onPress={() => router.push("/diary")}
          >
            <View style={styles.writeButtonContent}>
              <Edit3 size={17} color="#FFFFFF" />
              <Text style={styles.writeButtonText}>오늘 기록하기</Text>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
        </View>

        {/* ── 2x2 기능 그리드 메뉴 ── */}
        <Text style={styles.sectionTitle}>우리의 서랍장</Text>

        <View style={styles.gridContainer}>
          {/* 1행: 버킷리스트 & 데이트지도 */}
          <View style={styles.gridRow}>
            {/* 버킷리스트 카드 */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.7}
              onPress={() => handleFeaturePress("버킷리스트", "/bucket-list")}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#FDF0ED" }]}>
                <CheckSquare size={20} color="#D87A68" />
              </View>
              <Text style={styles.gridTitle}>버킷리스트</Text>
              <Text style={styles.gridDesc}>함께 이루고픈 꿈 🪣</Text>
            </TouchableOpacity>

            {/* 데이트지도 카드 */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.7}
              onPress={() => handleFeaturePress("데이트지도", "/date-map")}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#F5ECE9" }]}>
                <MapPin size={20} color="#8D6E63" />
              </View>
              <Text style={styles.gridTitle}>데이트지도</Text>
              <Text style={styles.gridDesc}>발길 닿은 우리 추억 🗺️</Text>
            </TouchableOpacity>
          </View>

          {/* 2행: 가계부 & 더보기 */}
          <View style={styles.gridRow}>
            {/* 가계부 카드 */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.7}
              onPress={() => handleFeaturePress("가계부", "/couple-budget")}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#EFEBE9" }]}>
                <Wallet size={20} color="#795548" />
              </View>
              <Text style={styles.gridTitle}>가계부</Text>
              <Text style={styles.gridDesc}>알뜰한 데이트 기록 💰</Text>
            </TouchableOpacity>

            {/* 더보기 카드 */}
            <TouchableOpacity
              style={[styles.gridCard, styles.moreCard]}
              activeOpacity={0.7}
              onPress={() => handleFeaturePress("더보기")}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#FAF7F5" }]}>
                <Plus size={20} color="#BCAAA4" />
              </View>
              <Text style={[styles.gridTitle, { color: "#8D6E63" }]}>
                더보기
              </Text>
              <Text style={styles.gridDesc}>새로운 기능 추가 ＋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF7F5",
  },
  /* 0. 상단 헤더 */
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navHeaderTitle: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: "#3E2723",
  },
  headerSpacer: {
    width: 36,
  },
  /* 컨테이너 */
  container: {
    paddingHorizontal: scale(20),
    paddingTop: 8,
    paddingBottom: 32,
  },
  /* 1. 디데이 배너 */
  ddayCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: scale(18),
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  ddayLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heartCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FDF0ED",
    alignItems: "center",
    justifyContent: "center",
  },
  ddaySub: {
    fontSize: fontScale(11),
    color: "#BCAAA4",
    fontWeight: "500",
  },
  ddayTitle: {
    fontSize: fontScale(16),
    fontWeight: "700",
    color: "#3E2723",
    marginTop: 2,
  },
  ddayTag: {
    fontSize: fontScale(12),
    fontWeight: "700",
    color: "#D87A68",
    backgroundColor: "#FDF0ED",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  /* 2. 오늘 기록하기 메인 카드 */
  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: scale(20),
    marginBottom: 26,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: "#FDF0ED",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: fontScale(11),
    fontWeight: "600",
    color: "#D87A68",
  },
  statusNotice: {
    fontSize: fontScale(12),
    color: "#8D6E63",
    fontWeight: "500",
  },
  recordMainText: {
    fontSize: fontScale(18),
    fontWeight: "700",
    color: "#3E2723",
    lineHeight: 26,
    marginBottom: 18,
  },
  writeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3E2723",
    borderRadius: 16,
    paddingHorizontal: scale(18),
    height: 50,
  },
  writeButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  writeButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(15),
    fontWeight: "600",
  },
  /* 3. 2x2 그리드 메뉴 */
  sectionTitle: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: "#8D6E63",
    marginBottom: 12,
    marginLeft: 4,
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: scale(16),
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 110,
    justifyContent: "center",
  },
  moreCard: {
    borderWidth: 1,
    borderColor: "#F4EDE9",
    borderStyle: "dashed",
    backgroundColor: "#FAF7F5",
    shadowOpacity: 0,
    elevation: 0,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: "#3E2723",
    marginBottom: 2,
  },
  gridDesc: {
    fontSize: fontScale(11),
    color: "#BCAAA4",
  },
});
