// store/diaryStore.ts
import { create } from "zustand";

// 1. 백엔드 응답 데이터 구조 타입을 정교하게 정의
interface DiaryResultData {
  summary: string;
  images: string[];
  comments: string[];
  emotions: string[];
  happyScore: number;
  createdAt: string;
  recommendedSong: string;
  mode: string;
}

// 2. 스토어의 전체 상태(State)와 액션(Action) 타입 정의
interface DiaryStore {
  mode: "solo" | "together";
  setMode: (mode: "solo" | "together") => void;
  // 사용자가 입력하던 기존 state들 (기존 코드 유지)
  content: string;
  selectedEmotionId: string | null;
  photoUri: string | null;
  setContent: (content: string) => void;
  setSelectedEmotionId: (emotionId: string | null) => void;
  setPhotoUri: (uri: string | null) => void;

  // 🌟 [추가] 백엔드에서 받아온 결과 데이터를 담을 state
  resultData: DiaryResultData | null;
  setResultData: (data: DiaryResultData) => void; // 결과 저장 액션

  // 폼 리셋 함수 (결과 데이터까지 싹 청소)
  resetForm: () => void;
}

// 3. 스토어 생성
export const useDiaryStore = create<DiaryStore>((set) => ({
  mode: "solo",
  setMode: (mode) => set({ mode }),
  // 기존 초기값들
  content: "",
  selectedEmotionId: null,
  photoUri: null,
  setContent: (content) => set({ content }),
  setSelectedEmotionId: (selectedEmotionId) => set({ selectedEmotionId }),
  setPhotoUri: (photoUri) => set({ photoUri }),

  // 🌟 [추가] 결과 데이터 초기값 및 액션
  resultData: null,
  setResultData: (resultData) => set({ resultData }),

  // 🌟 리셋할 때 결과 데이터까지 말끔하게 비워주기
  resetForm: () =>
    set({
      content: "",
      selectedEmotionId: null,
      photoUri: null,
      resultData: null, // ✨ 청소!
    }),
}));
