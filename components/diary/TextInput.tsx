// components/diary/TextInput.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Text,
  Keyboard,
  Platform,
} from "react-native";
import { useDiaryStore } from "../../store/diaryStore";

interface Props {
  onFocused: (y: number) => void; // ← 부모에게 위치 전달
}

export default function TextInput({ onFocused }: Props) {
  const { content, setContent, mode } = useDiaryStore();
  const containerRef = useRef<View>(null);

  const handleFocus = () => {
    containerRef.current?.measureInWindow((x, y) => {
      console.log("TextInput y 좌표 : ", y);
      onFocused(y); // ← 부모에게 y 좌표 전달
    });
  };

  return (
    <View ref={containerRef} style={styles.container}>
      <RNTextInput
        style={styles.input}
        placeholder={
          mode === "solo"
            ? "오늘의 나는 어떤 하루를 보냈나요..."
            : "오늘 너와 함께한 순간..."
        }
        placeholderTextColor="#BBB"
        multiline
        maxLength={150}
        value={content}
        onChangeText={setContent}
        onFocus={handleFocus}
      />
      <View style={styles.footerRow}>
        <Text style={styles.tipText}>짧아도 괜찮아</Text>
        <Text style={styles.counter}>{content.length} / 150</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginVertical: 12 },
  input: {
    width: "100%",
    minHeight: 100,
    backgroundColor: "#F8F4F2",
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    borderWidth: 2,
    borderColor: "#F2EAE7",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  tipText: { fontSize: 12, color: "#A2948F", fontWeight: "500" },
  counter: { fontSize: 12, color: "#AAA", fontWeight: "400" },
});
