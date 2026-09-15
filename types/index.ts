export interface DiaryResultData {
  memoryId: string;
  summary: string;
  images: string[];
  comments: string[];
  emotions: string[];
  happyScore: number;
  createdAt: string;
  recommendedSong: string;
  mode: string;
}

export interface HistoryItem {
  memoryId: string;
  createdAt: string;
  emotions: string[];
  happyScore: number;
  images: string[];
}

export interface EmotionItem {
  id: string;
  emoji: string;
  label: string;
}
