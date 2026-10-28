// app/setting-dday.tsx
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Heart, Calendar, Sparkles } from "lucide-react-native";
import { scale, fontScale } from "../../utils/responsive";
import { useDdayStore, calculateDays } from "../../store/useDdayStore";
import { useToastStore } from "../../store/useToastStore";

export default function SettingDdayScreen() {
  const router = useRouter();
  const { showToast } = useToastStore();
  const { startDate, setStartDate, loadStartDate } = useDdayStore();

  // 기존 저장된 날짜를 기본값으로 분해
  const [selectedDate, setSelectedDate] = useState(() => {
    const initial = startDate || new Date().toISOString().split("T")[0];
    const [y, m, d] = initial.split("-").map(Number);
    return { year: y, month: m, day: d };
  });

  useEffect(() => {
    loadStartDate();
  }, []);

  // 선택 중인 날짜를 YYYY-MM-DD 문자열로 변환
  const formattedDateString = `${selectedDate.year}-${String(
    selectedDate.month,
  ).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;

  // 실시간 D-Day 계산
  const previewDays = calculateDays(formattedDateString);

  // 날짜 증감 제어 헬퍼
  const adjustDate = (type: "year" | "month" | "day", amount: number) => {
    setSelectedDate((prev) => {
      let next = { ...prev };
      if (type === "year") {
        next.year = Math.max(1990, Math.min(2030, next.year + amount));
      } else if (type === "month") {
        let m = next.month + amount;
        if (m < 1) m = 12;
        if (m > 12) m = 1;
        next.month = m;
      } else if (type === "day") {
        const lastDay = new Date(next.year, next.month, 0).getDate();
        let d = next.day + amount;
        if (d < 1) d = lastDay;
        if (d > lastDay) d = 1;
        next.day = d;
      }
      return next;
    });
  };

  // 저장 처리
  const handleSave = async () => {
    await setStartDate(formattedDateString);
    showToast("우리의 시작일이 저장되었어요 💕");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* ── 0. 상단 헤더 ── */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#3E2723" />
        </TouchableOpacity>
        <Text style={styles.navHeaderTitle}>시작일 설정</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionSubtitle}>우리가 마주한 날</Text>
        <Text style={styles.sectionTitle}>
          처음 마음을 나누었던{"\n"}그날을 기억해 볼까요? 🌿
        </Text>

        {/* ── 1. 실시간 D-Day 라이브 프리뷰 카드 ── */}
        <View style={styles.previewCard}>
          <View style={styles.previewTop}>
            <View style={styles.heartCircle}>
              <Heart size={20} color="#D87A68" fill="#D87A68" />
            </View>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>D+{previewDays}</Text>
            </View>
          </View>

          <Text style={styles.previewDaysText}>
            우리 함께한 지{" "}
            <Text style={styles.highlightText}>{previewDays}</Text>일
          </Text>
          <Text style={styles.previewDateText}>
            {selectedDate.year}년 {selectedDate.month}월 {selectedDate.day}
            일부터 시작되었어요
          </Text>
        </View>

        {/* ── 2. 감성 날짜 조정기 (연, 월, 일 휠 컨트롤) ── */}
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Calendar size={16} color="#8D6E63" />
            <Text style={styles.pickerHeaderText}>날짜를 선택해 주세요</Text>
          </View>

          <View style={styles.stepperRow}>
            {/* 연도 조정 */}
            <View style={styles.stepperCol}>
              <Text style={styles.stepperLabel}>연도</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                activeOpacity={0.7}
                onPress={() => adjustDate("year", 1)}
              >
                <Text style={styles.stepperArrow}>▲</Text>
              </TouchableOpacity>
              <View style={styles.valueBox}>
                <Text style={styles.stepperValue}>{selectedDate.year}</Text>
              </View>
              <TouchableOpacity
                style={styles.stepperBtn}
                activeOpacity={0.7}
                onPress={() => adjustDate("year", -1)}
              >
                <Text style={styles.stepperArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* 월 조정 */}
            <View style={styles.stepperCol}>
              <Text style={styles.stepperLabel}>월</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                activeOpacity={0.7}
                onPress={() => adjustDate("month", 1)}
              >
                <Text style={styles.stepperArrow}>▲</Text>
              </TouchableOpacity>
              <View style={styles.valueBox}>
                <Text style={styles.stepperValue}>
                  {String(selectedDate.month).padStart(2, "0")}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepperBtn}
                activeOpacity={0.7}
                onPress={() => adjustDate("month", -1)}
              >
                <Text style={styles.stepperArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* 일 조정 */}
            <View style={styles.stepperCol}>
              <Text style={styles.stepperLabel}>일</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                activeOpacity={0.7}
                onPress={() => adjustDate("day", 1)}
              >
                <Text style={styles.stepperArrow}>▲</Text>
              </TouchableOpacity>
              <View style={styles.valueBox}>
                <Text style={styles.stepperValue}>
                  {String(selectedDate.day).padStart(2, "0")}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepperBtn}
                activeOpacity={0.7}
                onPress={() => adjustDate("day", -1)}
              >
                <Text style={styles.stepperArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── 3. 감성 팁 안내 문구 ── */}
        <View style={styles.tipBox}>
          <Sparkles size={16} color="#D87A68" />
          <Text style={styles.tipText}>
            설정하신 날짜는 '함께 다이어리' 홈 상단 카드에 즉시 반영돼요.
          </Text>
        </View>

        {/* ── 4. 저장 완료 버튼 ── */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>이 날짜로 기억하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF7F5",
  },
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
  container: {
    paddingHorizontal: scale(20),
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionSubtitle: {
    fontSize: fontScale(12),
    color: "#BCAAA4",
    fontWeight: "500",
    marginBottom: 4,
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    color: "#3E2723",
    lineHeight: 28,
    marginBottom: 20,
    marginLeft: 2,
  },
  /* 1. 프리뷰 카드 */
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: scale(20),
    marginBottom: 20,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
  },
  previewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heartCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FDF0ED",
    alignItems: "center",
    justifyContent: "center",
  },
  tagBadge: {
    backgroundColor: "#FDF0ED",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: fontScale(12),
    fontWeight: "700",
    color: "#D87A68",
  },
  previewDaysText: {
    fontSize: fontScale(22),
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: 6,
  },
  highlightText: {
    color: "#D87A68",
  },
  previewDateText: {
    fontSize: fontScale(12),
    color: "#8D6E63",
  },
  /* 2. 날짜 조정기 */
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: scale(18),
    marginBottom: 16,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4EDE9",
  },
  pickerHeaderText: {
    fontSize: fontScale(13),
    fontWeight: "600",
    color: "#8D6E63",
  },
  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  stepperCol: {
    flex: 1,
    alignItems: "center",
  },
  stepperLabel: {
    fontSize: fontScale(11),
    color: "#BCAAA4",
    fontWeight: "600",
    marginBottom: 8,
  },
  stepperBtn: {
    width: "100%",
    height: 34,
    backgroundColor: "#FAF7F5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperArrow: {
    fontSize: fontScale(10),
    color: "#8D6E63",
    fontWeight: "700",
  },
  valueBox: {
    paddingVertical: 10,
  },
  stepperValue: {
    fontSize: fontScale(18),
    fontWeight: "700",
    color: "#3E2723",
  },
  /* 3. 팁 박스 */
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(216, 122, 104, 0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
  },
  tipText: {
    flex: 1,
    fontSize: fontScale(12),
    color: "#8D6E63",
    lineHeight: 17,
  },
  /* 4. 저장 버튼 */
  saveButton: {
    backgroundColor: "#3E2723",
    borderRadius: 16,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(15),
    fontWeight: "600",
  },
});
