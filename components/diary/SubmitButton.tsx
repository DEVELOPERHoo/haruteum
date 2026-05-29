// components/diary/SubmitButton.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useDiaryStore } from "../../store/diaryStore";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SubmitButton() {
  const router = useRouter();
  const { content, selectedEmotionId, resetForm } = useDiaryStore();

  // 🌟 AI가 하루를 분석하는 듯한 로딩 상태를 관리할 변수
  const [isGenerating, setIsGenerating] = useState(false);

  const canSave = content.trim().length > 0 && selectedEmotionId !== null;

  const handleSubmit = () => {
    if (!canSave || isGenerating) return;

    // 1. 버튼을 즉시 로딩 상태로 변경
    setIsGenerating(true);

    // 2. 1.5초(1500ms) 동안 로딩 감성을 보여준 뒤 자연스럽게 결과창으로 이동!
    setTimeout(() => {
      router.push("/diary-result");

      // 화면이 넘어간 뒤 부드럽게 폼 상태 리셋
      setIsGenerating(false);
      resetForm();
    }, 1500);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !canSave && styles.disabledButton,
        isGenerating && styles.generatingButton,
      ]}
      activeOpacity={0.8}
      disabled={!canSave || isGenerating}
      onPress={handleSubmit}
    >
      {isGenerating ? (
        <View style={styles.rowGap}>
          {/* 반짝이는 감성을 위해 돌아가는 미니멀 로딩 스피너 */}
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.buttonText}>하루를 정리하는 중...</Text>
        </View>
      ) : (
        <View style={styles.rowGap}>
          <Text
            style={[styles.buttonText, !canSave && styles.disabledButtonText]}
          >
            오늘을 기록할게
          </Text>
          <AntDesign
            name="heart"
            size={14}
            color={canSave ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)"}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#D4A59A",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
    shadowColor: "#D4A59A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#D4A59A",
    opacity: 0.3,
    shadowOpacity: 0,
    elevation: 0,
  },
  generatingButton: {
    backgroundColor: "rgba(212, 165, 154, 0.7)", // 조금 더 차분하게 내려앉는 로딩 톤 연출
    shadowOpacity: 0.1,
  },
  rowGap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  disabledButtonText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
});
