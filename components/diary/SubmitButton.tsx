// components/diary/SubmitButton.tsx
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Alert, View } from "react-native";
import { useDiaryStore } from "../../store/diaryStore";
import { AntDesign } from "@expo/vector-icons";
export default function SubmitButton() {
  const { content, selectedEmotionId, resetForm } = useDiaryStore();
  const [saved, setSaved] = useState(false); // 저장 완료 상태를 관리할 로컬 상태

  // 필수 항목 유효성 검사 (텍스트가 있고, 이모지가 선택되었을 때)
  const canSave = content.trim().length > 0 && selectedEmotionId !== null;

  const handleSubmit = () => {
    if (!canSave || saved) return;

    // 1. 성공적인 제출 시각 효과 전지적 전환
    setSaved(true);

    // 2. 알림창 띄우고 폼 초기화하기
    Alert.alert(
      "우리 하루 기록 완료! 💕",
      "AI 비서가 두 분의 하루를 매칭하고 있어요.",
      [
        {
          text: "확인",
          onPress: () => {
            // 알림창 확인 누르면 상태를 원래대로 리셋
            setSaved(false);
            resetForm();
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !canSave && styles.disabledButton,
        saved && styles.savedButton,
      ]}
      activeOpacity={0.8}
      disabled={!canSave || saved}
      onPress={handleSubmit}
    >
      {saved ? (
        // 1. 저장 완료(saved) 상태의 레이아웃
        <View style={styles.rowGap}>
          {/* 요기를 AntDesign 태그로 교체! 색상과 채우기(fill)가 한 번에 적용돼 */}
          <AntDesign name="heart" size={15} color="#D4A59A" />
          <Text style={styles.savedButtonText}>기록되었어요</Text>
        </View>
      ) : (
        // 2. 기본/작성 상태의 레이아웃
        <Text
          style={[styles.buttonText, !canSave && styles.disabledButtonText]}
        >
          오늘을 기록할게
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#D4A59A", // 메인 정체색 (bg-primary)
    borderRadius: 28, // rounded-full 감성을 위한 완벽한 알약 형태 크롭 (높이의 정확히 절반)
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
    // 활성화 상태일 때 은은하게 번지는 그림자 (shadow-lg)
    shadowColor: "#D4A59A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#D4A59A",
    opacity: 0.3, // disabled:opacity-30 스타일을 아주 깔끔하게 투명도로 재현!
    shadowOpacity: 0,
    elevation: 0,
  },
  savedButton: {
    backgroundColor: "rgba(212, 165, 154, 0.2)", // bg-primary/20 느낌의 촉촉하고 투명한 핑크 톤
    shadowOpacity: 0,
    elevation: 0,
  },
  rowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // 아이콘과 텍스트 사이 간격 (gap-2 재현)
  },
  buttonText: {
    color: "#FFFFFF", // text-primary-foreground (밀크 화이트)
    fontSize: 16,
    fontWeight: "600", // font-medium
    letterSpacing: 1.2, // tracking-wider 자간 넓게
  },
  disabledButtonText: {
    color: "#FFFFFF", // 비활성화되어도 투명도(opacity)만 줄어들 뿐 글자색은 유지
  },
  savedButtonText: {
    color: "#D4A59A", // text-primary 완료된 톤온톤 핑크 글씨
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
});
