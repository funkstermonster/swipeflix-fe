export interface SwipeStore {
    swipeCount: number;
    incrementSwipe: () => void;
    displayModal: boolean;
    setDisplayModal: (display: boolean) => void;
}