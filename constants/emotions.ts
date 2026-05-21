// constants/emotions.ts
export interface EmotionItem {
  id: string;
  emoji: string;
  label: string;
}

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
