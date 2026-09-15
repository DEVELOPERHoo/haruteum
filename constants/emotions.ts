import { EmotionItem } from "../types";

export const EMOTION_LIST: EmotionItem[] = [
  { id: "love", emoji: "🥰", label: "사랑해" },
  { id: "happy", emoji: "☺️", label: "행복해" },
  { id: "flutter", emoji: "🤭", label: "설레어" },
  { id: "cozy", emoji: "🌙", label: "포근해" },
  { id: "thanks", emoji: "🥹", label: "고마워" },
  { id: "missyou", emoji: "💭", label: "보고파" },
  { id: "tired", emoji: "😴", label: "피곤해" },
  { id: "sad", emoji: "🥲", label: "슬퍼" },
];

export const getEmotionEmoji = (emotionId: string): EmotionItem => {
  return (
    EMOTION_LIST.find(
      (item) => item.id.toLowerCase() === emotionId?.toLowerCase(),
    ) || { id: "happy", emoji: "☺️", label: "행복해" }
  ); // 못 찾으면 행복해를 디폴트로 방어
};
