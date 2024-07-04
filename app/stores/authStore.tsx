import { deleteCookie, getCookie } from 'cookies-next';
import { create } from 'zustand';
import { AuthState } from '../models/authState';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isSignedIn: false,
    checkAuth: async () => {
        const token = getCookie("token");
        if (!token) {
            set({ isSignedIn: false, user: null });
            return;
        }
        try {
            const decodedToken: any = jwtDecode(token);
            set({ isSignedIn: true, user: decodedToken.userdata })
        } catch (error) {
            console.error("Error decoding token:", error);
            deleteCookie("token");
            set({ isSignedIn: false, user: null });
        }
    },
    signOut: () => {
        deleteCookie("token");
        set({ isSignedIn: false, user: null });
    }
}));

export default useAuthStore;