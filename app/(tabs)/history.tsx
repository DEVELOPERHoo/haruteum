import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  FlatList,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, usePathname } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 32 - 8) / 3;

// 임시 더미 데이터
const DUMMY_DATA = [
  {
    id: "1",
    date: "08.26",
    emotion: "😊",
    score: 82,
    color: ["#E8C5B8", "#D4A59A"],
    month: "2026.08",
  },
  {
    id: "2",
    date: "08.24",
    emotion: "🥲",
    score: 45,
    color: ["#C8D8E8", "#A0B8C8"],
    month: "2026.08",
  },
  {
    id: "3",
    date: "08.21",
    emotion: "🥰",
    score: 91,
    color: ["#D8E8D0", "#B0C8A8"],
    month: "2026.08",
  },
  {
    id: "4",
    date: "08.19",
    emotion: "😴",
    score: 60,
    color: ["#E8E0D0", "#D0C0A8"],
    month: "2026.08",
  },
  {
    id: "5",
    date: "08.15",
    emotion: "😂",
    score: 77,
    color: ["#E8D0D8", "#C8A0B0"],
    month: "2026.08",
  },
  {
    id: "6",
    date: "08.10",
    emotion: "😊",
    score: 70,
    color: ["#D8D0E8", "#B0A8C8"],
    month: "2026.08",
  },
  {
    id: "7",
    date: "07.31",
    emotion: "🥰",
    score: 88,
    color: ["#E8E8C8", "#C8C8A0"],
    month: "2026.07",
  },
  {
    id: "8",
    date: "07.28",
    emotion: "😊",
    score: 65,
    color: ["#E8C8E8", "#C8A0C8"],
    month: "2026.07",
  },
  {
    id: "9",
    date: "07.25",
    emotion: "🥲",
    score: 40,
    color: ["#C8E8E8", "#A0C8C8"],
    month: "2026.07",
  },
];

type FilterType = "전체" | "나혼자" | "함께";

export default function HistoryScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const horizontalScrollRef = useRef<ScrollView>(null);
  const [filter, setFilter] = useState<FilterType>("전체");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [data, setData] = useState(DUMMY_DATA);

  useEffect(() => {
    if (pathname === "/history") {
      horizontalScrollRef.current?.scrollTo({ x: width, animated: false });
    }
  }, [pathname]);

  const handleHorizontalScroll = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    if (contentOffsetX > width * 1.4) {
      router.replace("/settings");
    } else if (contentOffsetX < width * 0.4) {
      router.replace("/diary");
    }
  };

  // 무한 스크롤 — 끝에 도달하면 추가 로딩
  const handleEndReached = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      // TODO: 백엔드 API 호출로 교체
      setIsLoadingMore(false);
    }, 1500);
  };

  // 월별 구분선 렌더링
  const renderMonthDivider = (month: string) => (
    <View style={styles.monthDividerRow} key={`divider-${month}`}>
      <View style={styles.dividerLine} />
      <Text style={styles.monthText}>{month}</Text>
      <View style={styles.dividerLine} />
    </View>
  );

  // 3열 그리드 행 렌더링
  const renderRows = () => {
    const rows: React.ReactElement[] = [];
    let currentMonth = "";
    let rowItems: typeof data = [];

    const flushRow = (month: string) => {
      if (rowItems.length === 0) return;
      rows.push(
        <View style={styles.gridRow} key={`row-${month}-${rowItems[0].id}`}>
          {rowItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(`/diary-result/${item.id}`)}
            >
              <View
                style={[styles.cardBg, { backgroundColor: item.color[0] }]}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardDate}>{item.date}</Text>
                <View>
                  <Text style={styles.cardEmoji}>{item.emotion}</Text>
                  <Text style={styles.cardScore}>{item.score}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {/* 빈 카드로 3열 맞추기 */}
          {rowItems.length < 3 &&
            Array(3 - rowItems.length)
              .fill(null)
              .map((_, i) => <View key={`empty-${i}`} style={styles.card} />)}
        </View>,
      );
      rowItems = [];
    };

    data.forEach((item, index) => {
      if (item.month !== currentMonth) {
        flushRow(currentMonth);
        currentMonth = item.month;
        rows.push(renderMonthDivider(item.month));
      }
      rowItems.push(item);
      if (rowItems.length === 3 || index === data.length - 1) {
        flushRow(currentMonth);
      }
    });

    return rows;
  };

  return (
    <View style={styles.baseContainer}>
      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleHorizontalScroll}
        contentContainerStyle={styles.horizontalWrapper}
        keyboardShouldPersistTaps="handled"
      >
        {/* 왼쪽 빈 페이지 (diary 방향) */}
        <View style={styles.pageContainer} />

        {/* 히스토리 메인 페이지 */}
        <View style={styles.pageContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScrollEndDrag={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } =
                nativeEvent;
              const isBottom =
                layoutMeasurement.height + contentOffset.y >=
                contentSize.height - 40;
              if (isBottom) handleEndReached();
            }}
          >
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.headerSub}>MY RECORDS</Text>
              <Text style={styles.headerTitle}>나의 기록</Text>
            </View>

            {/* 필터 탭 */}
            <View style={styles.filterRow}>
              {(["전체", "나혼자", "함께"] as FilterType[]).map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterBtn,
                    filter === f && styles.filterBtnActive,
                  ]}
                  onPress={() => setFilter(f)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === f && styles.filterTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 3열 그리드 */}
            <View style={styles.gridContainer}>{renderRows()}</View>

            {/* 무한 스크롤 로딩 인디케이터 */}
            {isLoadingMore && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#D4A59A" />
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>

        {/* 오른쪽 빈 페이지 (settings 방향) */}
        <View style={styles.pageContainer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  baseContainer: { flex: 1, backgroundColor: "#FAF7F5" },
  horizontalWrapper: { width: width * 3 },
  pageContainer: { width, flex: 1 },

  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  headerSub: {
    fontSize: 11,
    color: "#BCAAA4",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3E2723",
    letterSpacing: -0.5,
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterBtn: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F2EAE7",
  },
  filterBtnActive: { backgroundColor: "#3E2723" },
  filterText: { fontSize: 11, color: "#A2948F" },
  filterTextActive: { color: "#FAF7F5", fontWeight: "500" },

  monthDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    marginTop: 4,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EDE5E2" },
  monthText: { fontSize: 10, color: "#BCAAA4", letterSpacing: 1 },

  gridContainer: { paddingHorizontal: 16 },
  gridRow: { flexDirection: "row", gap: 4, marginBottom: 4 },

  card: {
    width: CARD_WIDTH,
    aspectRatio: 2 / 3,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  cardBg: { ...StyleSheet.absoluteFillObject },
  cardContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 6,
    justifyContent: "space-between",
  },
  cardDate: { fontSize: 8, color: "rgba(255,255,255,0.9)", textAlign: "right" },
  cardEmoji: { fontSize: 16 },
  cardScore: { fontSize: 8, color: "rgba(255,255,255,0.9)" },

  loadingRow: { paddingVertical: 16, alignItems: "center" },
});
