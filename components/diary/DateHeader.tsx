// components/diary/DateHeader.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getFormattedDate } from "../../utils/dateFormat";
import { scale } from "../../utils/responsive";

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
    alignItems: "flex-start",
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: scale(4),
  },
  dateText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#BCAAA4",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  subText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3E2723",
    lineHeight: 32,
    letterSpacing: -0.3,
  },
});
