// store/useCoupleStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COUPLE_STORAGE_KEY = "@haruteum_is_connected";

interface CoupleState {
  isConnected: boolean;
  loadConnectionState: () => Promise<void>;
  connectPartner: () => Promise<void>;
  disconnectPartner: () => Promise<void>;
}

export const useCoupleStore = create<CoupleState>((set) => ({
  isConnected: false, // 기본값: 미연결 상태

  // 앱 켤 때 로컬 기기에서 연결 여부 불러오기
  loadConnectionState: async () => {
    try {
      const saved = await AsyncStorage.getItem(COUPLE_STORAGE_KEY);
      if (saved === "true") {
        set({ isConnected: true });
      } else {
        set({ isConnected: false });
      }
    } catch (e) {
      console.error("커플 연결 상태 불러오기 실패:", e);
    }
  },

  // 파트너 연결 성공 시 호출
  connectPartner: async () => {
    set({ isConnected: true });
    try {
      await AsyncStorage.setItem(COUPLE_STORAGE_KEY, "true");
    } catch (e) {
      console.error("커플 연결 상태 저장 실패:", e);
    }
  },

  // 연결 해제 시 호출
  disconnectPartner: async () => {
    set({ isConnected: false });
    try {
      await AsyncStorage.setItem(COUPLE_STORAGE_KEY, "false");
    } catch (e) {
      console.error("커플 연결 해제 실패:", e);
    }
  },
}));
