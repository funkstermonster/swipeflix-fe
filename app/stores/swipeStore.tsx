import { create } from "zustand";
import { SwipeStore } from "../models/swipeStore";


 const useSwipeStore = create<SwipeStore>((set) => ({
    swipeCount: 0,
    incrementSwipe: () => set((state) => {
        const newCount = state.swipeCount + 1;
       
        return {
            swipeCount: newCount,
            displayPrompt: newCount % 15 === 0
        };
    }),
    displayPrompt: false,
    setDisplayPrompt: (display) => set({displayPrompt: display}),
}))

export default useSwipeStore;