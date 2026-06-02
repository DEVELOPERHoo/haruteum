// components/diary/SubmitButton.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert, // 👈 에러 팝업을 위해 Alert 추가
} from "react-native";
import { useDiaryStore } from "../../store/diaryStore";
import { diaryService } from "../../services/diaryService"; // 👈 방금 만든 서비스 레이어 임포트!
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SubmitButton() {
  const router = useRouter();

  // 🌟 스토어에서 content, selectedEmotionId와 함께 사진 배열(photos)도 가져옵니다!
  /*
  const {
    content,
    selectedEmotionId,
    photos = [],
    resetForm,
  } = useDiaryStore();
  */

  const comment = "테스트 코멘트";
  const files: string[] = [
    "file:///data/user/0/com.loveapp/cache/ImagePicker/test_photo_1.jpg",
    "file:///data/user/0/com.loveapp/cache/ImagePicker/test_photo_2.png",
    "file:///data/user/0/com.loveapp/cache/ImagePicker/test_photo_3.jpeg",
  ];

  // AI가 하루를 분석하는 듯한 로딩 상태를 관리할 변수
  const [isGenerating, setIsGenerating] = useState(false);

  //const canSave = comment.trim().length > 0 && selectedEmotionId !== null;
  const canSave = comment.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSave || isGenerating) return;

    // 1. 버튼을 즉시 로딩 상태로 변경
    setIsGenerating(true);

    try {
      // 🌟 2. diaryService를 통해 백엔드 서버로 데이터 전송 (비동기 통신)
      const result = await diaryService.createMemory({
        comment,
        //emotionId: selectedEmotionId,
        files,
      });

      console.log("백엔드 전송 성공 피드백:", result);

      // 🌟 3. 통신이 성공하면 1.2초 뒤 결과창으로 이동하고 폼 리셋하기
      setTimeout(() => {
        router.push("/diary-result");
        setIsGenerating(false);
        //resetForm(); 스토어 내부용 청소함수
      }, 1200);
    } catch (error) {
      console.error("백엔드 통신 실패 에러:", error);
      setIsGenerating(false); // 로딩 상태 해제해서 버튼 다시 활성화

      // 유저에게 친절하게 에러 알림 띄우기
      Alert.alert(
        "기록 저장 실패 😢",
        "서버와 연결이 원활하지 않습니다. 네트워크 상태나 IP 주소를 다시 확인해 주세요.",
        [{ text: "확인" }],
      );
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
