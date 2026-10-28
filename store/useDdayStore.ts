// store/useDdayStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DDAY_STORAGE_KEY = "@haruteum_dday_start_date";

interface DdayState {
  startDate: string; // "YYYY-MM-DD"
  setStartDate: (dateString: string) => Promise<void>;
  loadStartDate: () => Promise<void>;
  getDaysCount: () => number;
}

// 시작일로부터 오늘까지의 일수 계산 (당일 = 1일)
export const calculateDays = (dateStr: string): number => {
  if (!dateStr) return 1;
  const start = new Date(dateStr);
  const now = new Date();

  // 자정 기준으로 시간 정규화
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays > 0 ? diffDays : 1;
};

export const useDdayStore = create<DdayState>((set, get) => ({
  startDate: new Date().toISOString().split("T")[0], // 기본값: 오늘

  setStartDate: async (dateString: string) => {
    set({ startDate: dateString });
    try {
      await AsyncStorage.setItem(DDAY_STORAGE_KEY, dateString);
    } catch (e) {
      console.error("D-Day 저장 실패:", e);
    }
  },

  loadStartDate: async () => {
    try {
      const saved = await AsyncStorage.getItem(DDAY_STORAGE_KEY);
      if (saved) {
        set({ startDate: saved });
      }
    } catch (e) {
      console.error("D-Day 불러오기 실패:", e);
    }
  },

  getDaysCount: () => {
    return calculateDays(get().startDate);
  },
}));
