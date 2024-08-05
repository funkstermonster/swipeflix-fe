import { create } from "zustand";
import { SwipeStore } from "../models/swipeState";
import { persist } from "zustand/middleware";

const useSwipeStore = create<SwipeStore>()(
    persist(
      (set) => ({
        swipeCount: 0,
        incrementSwipe: () =>
          set((state) => {
            const newCount = state.swipeCount + 1;
            return {
              swipeCount: newCount,
              displayModal: newCount % 2 === 0,
            };
          }),
        displayModal: false,
        setDisplayModal: (display) => set({ displayModal: display }),
      }),
      {
        name: "swipe-store", 
        getStorage: () => localStorage,
        version: 2
      }
    )
  );
  

  export default useSwipeStore;