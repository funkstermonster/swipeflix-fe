import { deleteCookie, getCookie } from 'cookies-next';
import { create } from 'zustand';
import { AuthState } from '../models/authState';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { UserData } from '../models/userData';

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isSignedIn: false,
    checkAuth: async () => {
      const token = getCookie("token");
      console.log('token: ', token);
      if (!token) {
        set({ isSignedIn: false, user: null });
        return;
      }
      try {
        const decodedToken: { userdata: UserData } = jwtDecode(token);
        console.log('asd', decodedToken);
        set({ isSignedIn: true, user: decodedToken.userdata });
      } catch (error) {
        console.error("Error decoding token:", error);
        deleteCookie("token");
        set({ isSignedIn: false, user: null });
      }
    },
    getUserId: () => {
        const token = getCookie("token");
        const decodedToken: any = jwtDecode(token);
        console.log('decoded', decodedToken);
        return decodedToken.userId;
    },
    signOut: () => {
      deleteCookie("token");
      set({ isSignedIn: false, user: null });
    }
  }));

export default useAuthStore;
