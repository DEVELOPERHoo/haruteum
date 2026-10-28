// app/(together-features)/bucket-list.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Plus, CheckSquare, Square } from "lucide-react-native";
import { scale, fontScale } from "../../utils/responsive";

export default function BucketListScreen() {
  const router = useRouter();

  // 예시 버킷리스트 데이터
  const [items, setItems] = useState([
    { id: "1", title: "제주도 한라산 같이 등반하기", done: false },
    { id: "2", title: "비 오는 날 파전에 막걸리 마시기", done: true },
    { id: "3", title: "서로에게 손편지 써서 교환하기", done: false },
  ]);

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#3E2723" />
        </TouchableOpacity>
        <Text style={styles.navHeaderTitle}>우리의 버킷리스트 🪣</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subGuide}>
          함께 이루고 싶은 순간들을 모아보세요.
        </Text>

        <View style={styles.listWrapper}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              activeOpacity={0.7}
              onPress={() => toggleCheck(item.id)}
            >
              {item.done ? (
                <CheckSquare size={20} color="#D87A68" />
              ) : (
                <Square size={20} color="#BCAAA4" />
              )}
              <Text style={[styles.itemText, item.done && styles.itemTextDone]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAF7F5" },
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
  headerSpacer: { width: 36 },
  container: { paddingHorizontal: scale(20), paddingTop: 8, paddingBottom: 32 },
  subGuide: { fontSize: fontScale(12), color: "#8D6E63", marginBottom: 16 },
  listWrapper: { gap: 12 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: scale(16),
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  itemText: { fontSize: fontScale(14), color: "#3E2723", fontWeight: "500" },
  itemTextDone: {
    textDecorationLine: "line-through",
    color: "#BCAAA4",
  },
});
