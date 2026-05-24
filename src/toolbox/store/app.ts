import IStore from "../../interfaces/store";
import { lens } from "@dhmk/zustand-lens";

export const appSlice = lens<IStore["app"], IStore>((set) => {
  return {
    maxSaveTimer: 5,
    setMaxSaveTimer: (n) => {
      set((state) => {
        state.maxSaveTimer = n;
      });
    },

    language: "en",
    setLanguage: (language) => {
      set((state) => {
        state.language = language;
      });
    },

    darkMode: false,
    setDarkMode: (darkMode) => {
      set((state) => {
        state.darkMode = darkMode;
      });
    },

    selectedIds: new Set<number>(),
    setSelectedIds: (ids) => {
      set((state) => {
        state.selectedIds = ids;
      });
    },
    clearSelectedIds: () => {
      set((state) => {
        state.selectedIds = new Set<number>();
      });
    },
  };
});
