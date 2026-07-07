// components/diary/SubmitButton.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDiaryStore } from "../../store/diaryStore";
import { diaryService } from "../../services/diaryService";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SubmitButton() {
  const router = useRouter();

  // 🌟 1. 주석을 풀고 스토어에서 유저가 입력한 진짜 상태들을 가져옵니다!
  const { content, selectedEmotionId, photoUri, mode } = useDiaryStore();

  const [isGenerating, setIsGenerating] = useState(false);

  // 저장 가능한 조건 (글이 있고, 감정이 선택되어 있고, 사진까지 꽂혀있을 때)
  const canSave =
    content?.trim().length > 0 &&
    selectedEmotionId !== null &&
    photoUri !== null;

  const handleSubmit = async () => {
    if (!canSave || isGenerating) return;

    setIsGenerating(true);

    try {
      // 🌟 2. 단일 string 주소인 photoUri를 백엔드가 원하는 배열 형태([photoUri])로 패킹해서 보냅니다!
      const files = photoUri ? [photoUri] : [];

      // 백엔드가 명세서에 열어둔 필드명(comment, emotionId)에 맞춰 데이터 토스!
      const result = await diaryService.createMemory({
        comment: content,
        emotionId: String(selectedEmotionId), // string으로 변환해서 전달
        files: files,
        mode: mode,
      });

      console.log("🚀 백엔드 응답 수신 완료:", result);

      // 🌟 [핵심 추가] 통신은 성공했으나 응답 본문이 빈 값(null, undefined, 또는 빈 객체)인지 검사
      // 백엔드가 필수적으로 줘야 하는 'summary' 같은 키값이 없거나 객체가 비어있다면 가로막습니다.
      if (!result || Object.keys(result).length === 0 || !result.summary) {
        throw new Error("SERVER_EMPTY_DATA"); // 에러를 강제로 발생시켜 catch문으로 토스!
      }

      // 2. 데이터 유효성 검사까지 통과했으므로 안심하고 스토어 주입 및 화면 이동!
      useDiaryStore.getState().setResultData(result);
      router.push("/diary-result");
    } catch (error: any) {
      console.error("백엔드 통신 또는 데이터 오류:", error);

      // 🌟 에러 원인에 따라 유저 팝업 문구 분기 처리
      if (error.message === "SERVER_EMPTY_DATA") {
        Alert.alert(
          "분석 오류 😢",
          "서버에서 분석 데이터를 안정적으로 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.",
          [{ text: "확인" }],
        );
      } else {
        Alert.alert(
          "기록 저장 실패 😢",
          "서버와 연결이 원활하지 않습니다. 네트워크 상태를 확인해 주세요.",
          [{ text: "확인" }],
        );
      }
    } finally {
      setIsGenerating(false);
    }
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

// 스타일시트는 기존 코드 그대로 유지
const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#D4A59A",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
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
    backgroundColor: "rgba(212, 165, 154, 0.7)",
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
  disabledButtonText: { color: "rgba(255, 255, 255, 0.7)" },
});
