// store/diaryStore.ts
import { create } from "zustand";

// 1. 백엔드 응답 데이터 구조 타입을 정교하게 정의
interface DiaryResultData {
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

interface HistoryItem {
  memoryId: string;
  createdAt: string;
  emotions: string[];
  happyScore: number;
  images: string[];
}

// 2. 스토어의 전체 상태(State)와 액션(Action) 타입 정의
interface DiaryStore {
  mode: "solo" | "together";
  setMode: (mode: "solo" | "together") => void;
  // 사용자가 입력하던 기존 state들 (기존 코드 유지)
  content: string;
  selectedEmotionId: string | null;
  photoUris: string[];
  setContent: (content: string) => void;
  setSelectedEmotionId: (emotionId: string | null) => void;
  setPhotoUris: (uris: string[]) => void; // 🌟 배열 저장 액션

  // 🌟 [추가] 백엔드에서 받아온 결과 데이터를 담을 state
  resultData: DiaryResultData | null;
  setResultData: (data: DiaryResultData) => void; // 결과 저장 액션

  // 히스토리 관련 상태 추가
  historyList: HistoryItem[];
  historyPage: number;
  historyHasNext: boolean;
  isHistoryLoading: boolean;
  setHistoryList: (items: HistoryItem[]) => void;
  appendHistoryList: (items: HistoryItem[]) => void;
  setHistoryPage: (page: number) => void;
  setHistoryHasNext: (hasNext: boolean) => void;
  setIsHistoryLoading: (loading: boolean) => void;
  resetHistory: () => void;

  // 폼 리셋 함수 (결과 데이터까지 싹 청소)
  resetForm: () => void;
}

// 3. 스토어 생성
export const useDiaryStore = create<DiaryStore>((set) => ({
  mode: "solo",
  setMode: (mode) => set({ mode }),
  content: "",
  selectedEmotionId: null,

  // 초기값도 빈 배열로 세팅!
  photoUris: [],
  setContent: (content) => set({ content }),
  setSelectedEmotionId: (selectedEmotionId) => set({ selectedEmotionId }),
  setPhotoUris: (photoUris) => set({ photoUris }),

  resultData: null,
  setResultData: (resultData) => set({ resultData }),

  // 히스토리 초기값
  historyList: [],
  historyPage: 1,
  historyHasNext: true,
  isHistoryLoading: false,
  setHistoryList: (historyList) => set({ historyList }),
  appendHistoryList: (items) =>
    set((state) => ({ historyList: [...state.historyList, ...items] })),
  setHistoryPage: (historyPage) => set({ historyPage }),
  setHistoryHasNext: (historyHasNext) => set({ historyHasNext }),
  setIsHistoryLoading: (isHistoryLoading) => set({ isHistoryLoading }),
  resetHistory: () => set({ historyList: [], historyHasNext: true }),

  resetForm: () =>
    set({
      content: "",
      selectedEmotionId: null,
      photoUris: [], // ✨ 깔끔하게 청소!
      resultData: null,
    }),
}));
