import { create } from "zustand";
import { HistoryItem } from "../types";

interface HistoryStore {
  // 히스토리 관련 상태 추가
  historyList: HistoryItem[];
  historyPage: number;
  historyHasNext: boolean;
  isHistoryLoading: boolean;
  isHistoryStale: boolean;
  setHistoryList: (items: HistoryItem[]) => void;
  appendHistoryList: (items: HistoryItem[]) => void;
  setHistoryPage: (page: number) => void;
  setHistoryHasNext: (hasNext: boolean) => void;
  setIsHistoryLoading: (loading: boolean) => void;
  setIsHistoryStale: (stale: boolean) => void;
  resetHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  // 히스토리 초기값
  historyList: [],
  historyPage: 1,
  historyHasNext: true,
  isHistoryLoading: false,
  isHistoryStale: false,
  setHistoryList: (historyList) => set({ historyList }),
  appendHistoryList: (items) =>
    set((state) => ({ historyList: [...state.historyList, ...items] })),
  setHistoryPage: (historyPage) => set({ historyPage }),
  setHistoryHasNext: (historyHasNext) => set({ historyHasNext }),
  setIsHistoryLoading: (isHistoryLoading) => set({ isHistoryLoading }),
  setIsHistoryStale: (isHistoryStale) => set({ isHistoryStale }),
  resetHistory: () => set({ historyList: [], historyHasNext: true }),
}));
