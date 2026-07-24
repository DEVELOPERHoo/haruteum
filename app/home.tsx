import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDiaryStore } from "../store/diaryStore";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const { setMode } = useDiaryStore();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const handleModeSelect = (selectedMode: "solo" | "together") => {
    setMode(selectedMode);

    router.push("/diary");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        {/* 🗓️ 상단 날짜 및 헤더 영역 */}
        <View style={styles.header}>
          <Text style={styles.dateText}>
            {year}. {String(month).padStart(2, "0")}.{" "}
            {String(day).padStart(2, "0")}
          </Text>
          <Text style={styles.mainTitle}>하루 틈,</Text>
          <Text style={styles.subTitle}>어떤 기록을 남길까요?</Text>
        </View>

        {/* 🔘 선택 버튼 영역 */}
        <View style={styles.buttonArea}>
          {/* 1. 나혼자 다이어리 버튼 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleModeSelect("solo")} // 👈 onClick에서 onPress로 완벽 수정!
            style={styles.cardButton}
          >
            <View style={styles.cardContent}>
              <View
                style={[styles.iconWrapper, { backgroundColor: "#F5ECE9" }]}
              >
                <AntDesign name="user" size={24} color="#D4A59A" />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>나혼자 다이어리</Text>
                <Text style={styles.cardDescription}>
                  오롯이 나만의 하루를 기록해요
                </Text>
              </View>
            </View>
            <Text style={styles.cornerTag}>MY DAY</Text>
          </TouchableOpacity>

          {/* 2. 함께 다이어리 버튼 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleModeSelect("together")} // 👈 onClick에서 onPress로 완벽 수정!
            style={styles.cardButton}
          >
            <View style={styles.cardContent}>
              <View
                style={[styles.iconWrapper, { backgroundColor: "#EEDFDC" }]}
              >
                <AntDesign name="team" size={24} color="#D4A59A" />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>함께 다이어리</Text>
                <Text style={styles.cardDescription}>
                  둘이서 보낸 하루를 기록해요
                </Text>
              </View>
            </View>
            <Text style={styles.cornerTag}>OUR DAY</Text>
          </TouchableOpacity>
        </View>

        {/* ✉️ 푸터 영문 레터링 */}
        <Text style={styles.footerText}>EVERYDAY DIARY</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FAF7F5",
    alignItems: "center",
  },
  innerContainer: {
    width: width > 430 ? 430 : "100%",
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexDirection: "column",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  dateText: {
    fontSize: 10,
    color: "rgba(136, 136, 136, 0.4)",
    letterSpacing: 4,
    marginBottom: 16,
    fontWeight: "500",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#3E2723",
    letterSpacing: 1,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: "rgba(136, 136, 136, 0.6)",
    letterSpacing: 1,
  },
  buttonArea: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingBottom: 40,
  },
  cardButton: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E2723",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "rgba(136, 136, 136, 0.5)",
    letterSpacing: -0.2,
  },
  cornerTag: {
    position: "absolute",
    bottom: 12,
    right: 16,
    fontSize: 9,
    color: "rgba(136, 136, 136, 0.2)",
    letterSpacing: 2,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    fontSize: 9,
    color: "rgba(136, 136, 136, 0.25)",
    letterSpacing: 4,
  },
});
