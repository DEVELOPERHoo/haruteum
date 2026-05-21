// store/diaryStore.ts
import { create } from "zustand";

interface DiaryState {
  photoUri: string | null;
  content: string;
  selectedEmotionId: string | null;
  setPhotoUri: (uri: string | null) => void;
  setContent: (content: string) => void;
  setSelectedEmotionId: (id: string | null) => void;
  resetForm: () => void;
}

export const useDiaryStore = create<DiaryState>((set) => ({
  photoUri: null,
  content: "",
  selectedEmotionId: null,
  setPhotoUri: (uri) => set({ photoUri: uri }),
  setContent: (content) => set({ content }),
  setSelectedEmotionId: (id) => set({ selectedEmotionId: id }),
  resetForm: () =>
    set({ photoUri: null, content: "", selectedEmotionId: null }),
}));
