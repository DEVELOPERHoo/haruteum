// components/diary/DateHeader.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getFormattedDate } from "../../utils/dateFormat";

export default function DateHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{getFormattedDate()}</Text>
      <Text style={styles.subText}>오늘은 어떤하루 였나요?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-start", // 👈 중앙 정렬에서 힙한 '왼쪽 정렬'로 변경!
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 4, // 양옆 여백과 라인을 맞추기 위한 미세 정렬
  },
  dateText: {
    fontSize: 13,
    fontWeight: "400", // 너무 두껍지 않게 가볍고 세련된 느낌으로
    color: "#BCAAA4", // 전체 브라운 무드와 이어지는 은은한 밀크티 베이지 색상
    letterSpacing: 1.5, // 자간을 더 넓혀서 여백의 미 강조
    marginBottom: 12,
  },
  subText: {
    fontSize: 22,
    fontWeight: "600", // 무식하게 두꺼운 700대신 고급스러운 600 서체
    color: "#3E2723", // 완전 시커먼 검정(#111)이 아닌 깊은 초콜릿 브라운 색상으로 감성 충전
    lineHeight: 32, // 줄간격을 넉넉히 주어 숨통이 트이는 느낌 연출
    letterSpacing: -0.3,
  },
});
