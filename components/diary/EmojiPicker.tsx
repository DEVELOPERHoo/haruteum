// components/diary/EmojiPicker.tsx
import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { EMOTION_LIST } from "../../constants/emotions";
import { useDiaryStore } from "../../store/diaryStore";

// 개별 이모지 버튼 컴포넌트 (애니메이션 개별 적용을 위해 분리)
function EmojiButton({ item, isSelected, onPress }) {
  // 애니메이션을 위한 변수 생성 (기본값 0)
  const animatedValue = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    // 이모지가 선택되거나 해제될 때 부드럽게 수치 변화 (시간을 300ms로 주어 천천히 움직임)
    Animated.timing(animatedValue, {
      toValue: isSelected ? 1 : 0,
      duration: 150, // 👈 0.3초 동안 천천히 실행 (원하면 400~500으로 더 늘려도 돼!)
      useNativeDriver: true, // 네이티브 엔진을 써서 버벅임 없이 부드럽게 실행
    }).start();
  }, [isSelected]);

  // 애니메이션 수치를 스케일과 투명도 값으로 변환(보간)
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25], // 1배에서 1.25배로 천천히 확대
  });

  const buttonScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05], // 버튼 전체는 1배에서 1.05배로 확대
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1], // 투명도는 0.5에서 1로 선명해짐
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.buttonWrapper}
    >
      {/* Animated.View를 사용해 배경과 내용물을 감싸줌 */}
      <Animated.View
        style={[
          styles.emojiButton,
          isSelected ? styles.selectedButton : styles.unselectedButton,
          { transform: [{ scale: buttonScale }] }, // 버튼 자체 scale-105 효과 천천히
        ]}
      >
        {/* 이모지 텍스트 애니메이션 적용 */}
        <Animated.Text
          style={[styles.emojiText, { transform: [{ scale }], opacity }]}
        >
          {item.emoji}
        </Animated.Text>

        <Text style={[styles.label, isSelected && styles.selectedLabel]}>
          {item.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function EmojiPicker() {
  const { selectedEmotionId, setSelectedEmotionId, mode } = useDiaryStore();

  const handlePress = (id: string) => {
    setSelectedEmotionId(selectedEmotionId === id ? null : id);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {mode === "solo" ? "오늘의 나는" : "오늘의 우리는"}
      </Text>

      <View style={styles.container}>
        {EMOTION_LIST.map((item) => (
          <EmojiButton
            key={item.id}
            item={item}
            isSelected={selectedEmotionId === item.id}
            onPress={() => handlePress(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: "rgba(136, 136, 136, 0.6)",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 16,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // 8개 감정을 위해 자동 줄바꿈 활성화!
    justifyContent: "space-between",
    width: "100%",
  },
  buttonWrapper: {
    width: "23%", // 4x2 그리드로 이쁘게 배치
    marginVertical: 6,
  },
  emojiButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 20,
  },
  unselectedButton: {
    backgroundColor: "transparent",
  },
  selectedButton: {
    backgroundColor: "rgba(212, 165, 154, 0.15)", // 네가 SubmitButton에 쓴 예쁜 브라운 브릭 톤온톤 매칭!
  },
  emojiText: {
    fontSize: 24,
  },
  label: {
    fontSize: 9,
    color: "rgba(136, 136, 136, 0.5)",
    marginTop: 6,
    fontWeight: "400",
    letterSpacing: -0.3,
  },
  selectedLabel: {
    color: "#D4A59A", // 선택 시 라벨 색상도 톤온톤으로 세련되게 통일
    fontWeight: "600",
  },
});
