import React, { useRef } from "react";
import { StyleSheet, TextInput as RNTextInput, View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDiaryStore } from "../../store/diaryStore";

interface Props {
  scrollRef: React.RefObject<KeyboardAwareScrollView>;
}

export default function TextInput({ scrollRef }: Props) {
  const { content, setContent, mode } = useDiaryStore();
  const inputRef = useRef<RNTextInput>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      scrollRef.current?.scrollToFocusedInput(
        inputRef.current as any,
        110, // ← 키보드 위 여유 공간
      );
    }
  };

  return (
    <View style={styles.container}>
      <RNTextInput
        ref={inputRef}
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
        onFocus={handleFocus} // ← 포커스 시 정확한 위치로 스크롤
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
    justifyContent: "space-between", // 왼쪽 끝과 오른쪽 끝으로 양 갈래 정렬!
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  tipText: {
    fontSize: 12,
    color: "#A2948F", // 전체 베이지 톤과 어울리는 부드러운 브라운 감성 정체색
    fontWeight: "500",
  },
  counter: {
    fontSize: 12,
    color: "#AAA",
    fontWeight: "400",
  },
});
