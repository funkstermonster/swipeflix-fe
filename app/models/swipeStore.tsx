export interface SwipeStore {
    swipeCount: number;
    incrementSwipe: () => void;
    displayPrompt: boolean;
    setDisplayPrompt: (display: boolean) => void;
}