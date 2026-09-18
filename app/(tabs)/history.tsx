// app/(tabs)/history.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Check, Trash2, X } from "lucide-react-native";
import { useHistoryStore } from "../../store/historyStore";
import { useDiaryStore } from "../../store/diaryStore";
import { fetchHistory, deleteMemories } from "../../services/historyService";
import { getEmotionEmoji } from "../../constants/emotions";
import { BASE_URL } from "../../constants/config";
import { formatDate, groupingMonth } from "../../utils/dateFormat";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 32 - 8) / 3;

type FilterType = "전체" | "나혼자" | "함께";

export default function HistoryScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const horizontalScrollRef = useRef<ScrollView>(null);
  const [filter, setFilter] = useState<FilterType>("전체");

  // 🌟 다중 선택 모드 상태 (memoryId가 string 타입이므로 string[]으로 지정)
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    historyList,
    historyPage,
    historyHasNext,
    isHistoryLoading,
    isHistoryStale,
    appendHistoryList,
    setHistoryPage,
    setHistoryHasNext,
    setIsHistoryLoading,
    setIsHistoryStale,
    resetHistory,
  } = useHistoryStore();

  const { mode } = useDiaryStore();

  useEffect(() => {
    if (pathname !== "/history") return;
    horizontalScrollRef.current?.scrollTo({ x: width, animated: false });

    if (historyList.length === 0 || isHistoryStale) {
      resetHistory();
      loadMore(true);
      setIsHistoryStale(false); // 플래그 초기화
      exitSelectionMode();
    }
  }, [pathname]);

  // 선택 모드 전체 종료 및 상태 초기화
  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  const loadMore = async (isReset = false) => {
    if (!isReset && (!historyHasNext || isHistoryLoading)) return;
    setIsHistoryLoading(true);
    try {
      const json = await fetchHistory({
        page: isReset ? 1 : historyPage,
        pageSize: 9,
      });
      const sorted = [...json.memories].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      if (isReset) {
        resetHistory();
        appendHistoryList(sorted);
        setHistoryPage(2);
      } else {
        appendHistoryList(sorted);
        setHistoryPage(historyPage + 1);
      }
      setHistoryHasNext(json.hasNext);
    } catch (error: any) {
      console.log("에러 발생", error);
      if (error.message.includes("로그인이 필요")) {
        router.replace("/login");
      }
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // memoryId: string 수용 및 토글 로직
  const toggleSelect = (memoryId: string) => {
    setSelectedIds((prev) => {
      const nextSelected = prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId];

      // 선택된 카드가 0개가 되면 자동으로 선택 모드 해제
      if (nextSelected.length === 0) {
        setIsSelectionMode(false);
      }

      return nextSelected;
    });
  };

  // 카드 Long Press (꾹 누르기) 핸들러 (string 타입)
  const handleLongPressCard = (memoryId: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedIds([memoryId]);
    }
  };

  // 카드 일반 클릭 핸들러 (string 타입)
  const handlePressCard = (memoryId: string) => {
    if (isSelectionMode) {
      toggleSelect(memoryId);
    } else {
      router.push(`/memory/${memoryId}`); // 히스토리 -> 상세
    }
  };

  // 일괄 삭제 수행
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    Alert.alert(
      "기록 삭제",
      `선택한 ${selectedIds.length}개의 기록을 삭제하시겠어요?\n삭제된 기록은 복구할 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMemories(selectedIds);
              setIsHistoryStale(true);
              exitSelectionMode();
              resetHistory();
              loadMore(true);
            } catch (error) {
              console.log("삭제 에러 상세:", error);
              Alert.alert("오류", "삭제 처리 중 문제가 발생했습니다.");
            }
          },
        },
      ],
    );
  };

  const handleHorizontalScroll = (e: any) => {
    if (isSelectionMode) return;
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    if (contentOffsetX > width * 1.4) {
      router.replace("/settings");
    } else if (contentOffsetX < width * 0.4) {
      router.replace("/diary");
    }
  };

  const handleEndReached = () => {
    if (!isSelectionMode) loadMore();
  };

  const renderMonthDivider = (month: string, index: number) => (
    <View style={styles.monthDividerRow} key={`divider-${month}-${index}`}>
      <View style={styles.dividerLine} />
      <Text style={styles.monthText}>{month}</Text>
      <View style={styles.dividerLine} />
    </View>
  );

  const settingthumbnail = (images: string[]): string => {
    const thumbnail =
      images && images.length > 0
        ? images[0].startsWith("http")
          ? images[0]
          : `${BASE_URL}${images[0]}`
        : "https://picsum.photos/800/1000?random=1";
    return thumbnail;
  };

  const renderRows = () => {
    const rows: React.ReactElement[] = [];
    let currentMonth = "";
    let rowItems: typeof historyList = [];

    const flushRow = (month: string) => {
      if (rowItems.length === 0) return;
      rows.push(
        <View style={styles.gridRow} key={`row-${month}-${rows.length}`}>
          {rowItems.map((item) => {
            // string 타입의 memoryId로 비교
            const isSelected = selectedIds.includes(item.memoryId);
            return (
              <TouchableOpacity
                key={item.memoryId}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => handlePressCard(item.memoryId)}
                onLongPress={() => handleLongPressCard(item.memoryId)}
                delayLongPress={350}
              >
                {item.images?.[0] ? (
                  <Image
                    source={{ uri: settingthumbnail(item.images) }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[styles.cardBg, { backgroundColor: "#D4A59A" }]}
                  />
                )}

                {/* 선택 모드 시 오버레이 */}
                {isSelectionMode && (
                  <View
                    style={[
                      styles.selectionOverlay,
                      isSelected && styles.selectionOverlayActive,
                    ]}
                  />
                )}

                {/* 우측 상단 체크박스 */}
                {isSelectionMode && (
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxActive,
                    ]}
                  >
                    {isSelected && (
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                )}

                <View style={styles.cardContent}>
                  <Text style={styles.cardDate}>
                    {formatDate(item.createdAt)}
                  </Text>
                  <View>
                    <Text style={styles.cardEmoji}>
                      {getEmotionEmoji(item.emotions?.[0]).emoji}
                    </Text>
                    <Text style={styles.cardScore}>{item.happyScore}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          {rowItems.length < 3 &&
            Array(3 - rowItems.length)
              .fill(null)
              .map((_, i) => <View key={`empty-${i}`} style={styles.card} />)}
        </View>,
      );
      rowItems = [];
    };

    historyList.forEach((item, index) => {
      const month = groupingMonth(item.createdAt);
      if (month !== currentMonth) {
        flushRow(currentMonth);
        currentMonth = month;
        rows.push(renderMonthDivider(month, rows.length));
      }
      rowItems.push(item);
      if (rowItems.length === 3 || index === historyList.length - 1) {
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
        pagingEnabled={!isSelectionMode}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleHorizontalScroll}
        contentContainerStyle={styles.horizontalWrapper}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!isSelectionMode}
      >
        <View style={styles.pageContainer} />

        <View style={styles.pageContainer}>
          {/* 동적 헤더 (일반 ↔ 선택 모드) */}
          {isSelectionMode ? (
            <View style={styles.selectionHeader}>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={exitSelectionMode}
                activeOpacity={0.7}
              >
                <X size={18} color="#3E2723" />
                <Text style={styles.headerBtnText}>취소</Text>
              </TouchableOpacity>

              <Text style={styles.selectionTitle}>
                {selectedIds.length}개 선택됨
              </Text>

              <TouchableOpacity
                style={[
                  styles.headerBtn,
                  selectedIds.length === 0 && styles.disabledBtn,
                ]}
                onPress={handleDeleteSelected}
                activeOpacity={0.7}
                disabled={selectedIds.length === 0}
              >
                <Trash2 size={16} color="#D84315" />
                <Text style={[styles.headerBtnText, { color: "#D84315" }]}>
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.header}>
              <Text style={styles.headerSub}>MY RECORDS</Text>
              <Text style={styles.headerTitle}>나의 기록</Text>
              <Text style={styles.headerHint}>
                * 기록을 꾹 누르면 다중 삭제할 수 있어요
              </Text>
            </View>
          )}
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
            {mode !== "solo" ? (
              <View style={styles.filterRow}>
                {(["전체", "나혼자", "함께"] as FilterType[]).map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[
                      styles.filterBtn,
                      filter === f && styles.filterBtnActive,
                    ]}
                    onPress={() => setFilter(f)}
                    disabled={isSelectionMode}
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
            ) : (
              <></>
            )}

            {historyList.length === 0 && !isHistoryLoading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>아직 기록이 없어요 🌙</Text>
                <Text style={styles.emptySubText}>
                  오늘 하루를 기록해보세요
                </Text>
              </View>
            )}

            <View style={styles.gridContainer}>{renderRows()}</View>

            {isHistoryLoading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="large" color="#D4A59A" />
              </View>
            )}

            <View style={{ height: 50 }} />
          </ScrollView>
        </View>

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
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3E2723",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerHint: {
    fontSize: 10,
    color: "rgba(136, 136, 136, 0.5)",
  },
  selectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3E2723",
  },
  headerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3E2723",
  },
  disabledBtn: {
    opacity: 0.3,
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

  cardBg: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  selectionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 1,
  },

  selectionOverlayActive: {
    backgroundColor: "rgba(216, 67, 21, 0.3)", // ← 선택 시 붉은 오버레이
  },
  checkbox: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  checkboxActive: {
    backgroundColor: "#D84315",
    borderColor: "#D84315",
  },
  cardContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 6,
    justifyContent: "space-between",
    zIndex: 1,
  },
  cardDate: {
    fontSize: 8,
    color: "#FFFFFF",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
    alignSelf: "flex-end",
  },
  cardEmoji: { fontSize: 16 },
  cardScore: { fontSize: 8, color: "rgba(255,255,255,0.9)" },
  loadingRow: { paddingVertical: 6, alignItems: "center" },
  emptyContainer: { alignItems: "center", paddingTop: 80 },
  emptyText: { fontSize: 16, color: "#3E2723", fontWeight: "500" },
  emptySubText: { fontSize: 13, color: "#BCAAA4", marginTop: 8 },
  thumbnailImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
