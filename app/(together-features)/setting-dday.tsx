// app/(together-features)/setting-dday.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Calendar,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react-native";
import { scale, fontScale } from "../../utils/responsive";
import { useDdayStore, calculateDays } from "../../store/useDdayStore";
import { useToastStore } from "../../store/useToastStore";
import { formatFullDateWithDay } from "../../utils/dateFormat";

// 휠 피커 아이템 높이 (스크롤 스냅 기준)
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

// 날짜 데이터 범위 생성 헬퍼
const YEARS = Array.from({ length: 41 }, (_, i) => 2000 + i); // 2000 ~ 2040년
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1); // 1 ~ 12월

export default function SettingDdayScreen() {
  const router = useRouter();
  const { showToast } = useToastStore();
  const { startDate, setStartDate, loadStartDate } = useDdayStore();

  // 화면에 표시될 최종 선택 날짜
  const [selectedDate, setSelectedDate] = useState(() => {
    const initial = startDate || new Date().toISOString().split("T")[0];
    const [y, m, d] = initial.split("-").map(Number);
    return { year: y, month: m, day: d };
  });

  // 팝업 모달 표시 여부
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // 모달 내부에서 임시로 스크롤 중인 날짜 상태
  const [tempDate, setTempDate] = useState(selectedDate);

  // 각 월별 마지막 날짜 계산
  const daysInMonth = new Date(tempDate.year, tempDate.month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 스크롤 참조용 ref
  const yearListRef = useRef<FlatList>(null);
  const monthListRef = useRef<FlatList>(null);
  const dayListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadStartDate();
  }, []);

  // 모달이 열릴 때 현재 선택된 날짜 위치로 스크롤 이동
  useEffect(() => {
    if (isPickerVisible) {
      setTempDate(selectedDate);
      setTimeout(() => {
        const yearIndex = YEARS.indexOf(selectedDate.year);
        const monthIndex = MONTHS.indexOf(selectedDate.month);
        const dayIndex = selectedDate.day - 1;

        if (yearIndex >= 0) {
          yearListRef.current?.scrollToOffset({
            offset: yearIndex * ITEM_HEIGHT,
            animated: false,
          });
        }
        if (monthIndex >= 0) {
          monthListRef.current?.scrollToOffset({
            offset: monthIndex * ITEM_HEIGHT,
            animated: false,
          });
        }
        if (dayIndex >= 0) {
          dayListRef.current?.scrollToOffset({
            offset: dayIndex * ITEM_HEIGHT,
            animated: false,
          });
        }
      }, 50);
    }
  }, [isPickerVisible]);

  // 포맷팅 문자열 및 실시간 D-Day 계산
  const formattedDateString = `${selectedDate.year}-${String(
    selectedDate.month,
  ).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;

  const previewDays = calculateDays(formattedDateString);

  // 스크롤 종료 시 선택값 계산 헬퍼
  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    type: "year" | "month" | "day",
  ) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);

    setTempDate((prev) => {
      let next = { ...prev };
      if (type === "year") {
        const safeIndex = Math.max(0, Math.min(index, YEARS.length - 1));
        next.year = YEARS[safeIndex];
      } else if (type === "month") {
        const safeIndex = Math.max(0, Math.min(index, MONTHS.length - 1));
        next.month = MONTHS[safeIndex];
      } else if (type === "day") {
        const safeIndex = Math.max(0, Math.min(index, daysArray.length - 1));
        next.day = daysArray[safeIndex] || 1;
      }

      // 월 변경 시 말일(30/31/28일) 범위 보정
      const maxDay = new Date(next.year, next.month, 0).getDate();
      if (next.day > maxDay) next.day = maxDay;

      return next;
    });
  };

  // 모달에서 [선택 완료] 클릭 시
  const confirmPicker = () => {
    setSelectedDate(tempDate);
    setIsPickerVisible(false);
  };

  // 화면 하단 [이 날짜로 기억하기] 최종 저장 클릭 시
  const handleSave = async () => {
    await setStartDate(formattedDateString);
    showToast("우리의 시작일이 저장되었어요 💕");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* ── 0. 상단 네비게이션 헤더 ── */}
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
          처음 마음을 나누었던{"\n"}그날을 기억해 볼까요?
        </Text>

        {/* ── 1. D-Day 라이브 프리뷰 카드 ── */}
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

        {/* ── 2. 온전한 날짜 카드 (터치 시 휠 피커 팝업 호출) ── */}
        <Text style={styles.inputGuideTitle}>기념일 날짜</Text>
        <TouchableOpacity
          style={styles.dateDisplayCard}
          activeOpacity={0.8}
          onPress={() => setIsPickerVisible(true)}
        >
          <View style={styles.dateDisplayLeft}>
            <View style={styles.calendarIconCircle}>
              <Calendar size={20} color="#D87A68" />
            </View>
            <View>
              <Text style={styles.dateDisplaySub}>우리의 시작 날짜</Text>
              {/* 요구하신 2026. 10. 29 (목) 형태 표시 */}
              <Text style={styles.dateDisplayMain}>
                {formatFullDateWithDay(
                  selectedDate.year,
                  selectedDate.month,
                  selectedDate.day,
                )}
              </Text>
            </View>
          </View>
          <ChevronDown size={20} color="#BCAAA4" />
        </TouchableOpacity>

        {/* ── 3. 팁 안내 박스 ── */}
        <View style={styles.tipBox}>
          <Sparkles size={16} color="#D87A68" />
          <Text style={styles.tipText}>
            날짜 카드를 누르면 휠 스크롤로 날짜를 쉽게 변경할 수 있어요.
          </Text>
        </View>

        {/* ── 4. 최종 저장 버튼 ── */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>이 날짜로 기억하기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── 5. 하단 휠 스크롤 피커 모달 (팝업) ── */}
      <Modal
        visible={isPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* 어두운 배경 터치 시 모달 닫기 */}
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsPickerVisible(false)}
          />

          <View style={styles.modalSheet}>
            {/* 팝업 헤더 */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setIsPickerVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>날짜 선택</Text>
              <TouchableOpacity onPress={confirmPicker} activeOpacity={0.7}>
                <Text style={styles.modalConfirmText}>완료</Text>
              </TouchableOpacity>
            </View>

            {/* 현재 스크롤 중인 날짜 프리뷰 표시 */}
            <View style={styles.tempDateBanner}>
              <Text style={styles.tempDateText}>
                {formatFullDateWithDay(
                  tempDate.year,
                  tempDate.month,
                  tempDate.day,
                )}
              </Text>
            </View>

            {/* 3열 휠 스크롤 컨테이너 */}
            <View style={styles.wheelWrapper}>
              {/* 가운데 선택 하이라이트 바 */}
              <View style={styles.selectionHighlight} pointerEvents="none" />

              {/* 연도 휠 */}
              <FlatList
                ref={yearListRef}
                data={YEARS}
                keyExtractor={(item) => `y-${item}`}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.wheelContent}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                onMomentumScrollEnd={(e) => handleScrollEnd(e, "year")}
                renderItem={({ item }) => {
                  const isSelected = item === tempDate.year;
                  return (
                    <View style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected && styles.wheelItemSelectedText,
                        ]}
                      >
                        {item}년
                      </Text>
                    </View>
                  );
                }}
              />

              {/* 월 휠 */}
              <FlatList
                ref={monthListRef}
                data={MONTHS}
                keyExtractor={(item) => `m-${item}`}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.wheelContent}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                onMomentumScrollEnd={(e) => handleScrollEnd(e, "month")}
                renderItem={({ item }) => {
                  const isSelected = item === tempDate.month;
                  return (
                    <View style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected && styles.wheelItemSelectedText,
                        ]}
                      >
                        {item}월
                      </Text>
                    </View>
                  );
                }}
              />

              {/* 일 휠 */}
              <FlatList
                ref={dayListRef}
                data={daysArray}
                keyExtractor={(item) => `d-${item}`}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.wheelContent}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                onMomentumScrollEnd={(e) => handleScrollEnd(e, "day")}
                renderItem={({ item }) => {
                  const isSelected = item === tempDate.day;
                  return (
                    <View style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected && styles.wheelItemSelectedText,
                        ]}
                      >
                        {item}일
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 24,
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
  /* 2. 날짜 선택 카드 */
  inputGuideTitle: {
    fontSize: fontScale(13),
    fontWeight: "600",
    color: "#8D6E63",
    marginBottom: 8,
    marginLeft: 4,
  },
  dateDisplayCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: scale(18),
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  dateDisplayLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  calendarIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FDF0ED",
    alignItems: "center",
    justifyContent: "center",
  },
  dateDisplaySub: {
    fontSize: fontScale(11),
    color: "#BCAAA4",
    fontWeight: "500",
  },
  dateDisplayMain: {
    fontSize: fontScale(16),
    fontWeight: "700",
    color: "#3E2723",
    marginTop: 2,
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
  /* 5. 휠 모달 스타일 */
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(62, 39, 35, 0.4)", // 따뜻한 딥브라운 반투명 딤
  },
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: scale(20),
    paddingTop: 20,
    paddingBottom: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F4EDE9",
  },
  modalCancelText: {
    fontSize: fontScale(14),
    color: "#BCAAA4",
    fontWeight: "500",
  },
  modalTitle: {
    fontSize: fontScale(16),
    fontWeight: "700",
    color: "#3E2723",
  },
  modalConfirmText: {
    fontSize: fontScale(14),
    color: "#D87A68", // 포인트 코랄
    fontWeight: "700",
  },
  tempDateBanner: {
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#FAF7F5",
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  tempDateText: {
    fontSize: fontScale(15),
    fontWeight: "700",
    color: "#3E2723",
  },
  wheelWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    flexDirection: "row",
    position: "relative",
    justifyContent: "center",
  },
  selectionHighlight: {
    position: "absolute",
    top: ITEM_HEIGHT * 2, // 5개 중 가운데(3번째) 줄
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: "rgba(216, 122, 104, 0.08)",
    borderRadius: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(216, 122, 104, 0.2)",
  },
  wheelContent: {
    paddingVertical: ITEM_HEIGHT * 2, // 위아래 여백을 주어 첫 번째/마지막 항목이 가운데 오도록 함
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  wheelItemText: {
    fontSize: fontScale(15),
    color: "#BCAAA4",
    fontWeight: "500",
  },
  wheelItemSelectedText: {
    fontSize: fontScale(17),
    color: "#3E2723",
    fontWeight: "700",
  },
});
