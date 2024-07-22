import { LoginData } from "./login";
import { UserData } from "./userData";

export interface AuthState {
    user: UserData;
    isSignedIn: boolean;
    checkAuth: () => Promise<void>;
    signOut: () => void;
    getUserId: () => string;
  }