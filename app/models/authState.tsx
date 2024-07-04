import { LoginData } from "./login";
import { UserData } from "./userData";

export interface AuthState {
    user: UserData; // Define a proper type based on your user object
    isSignedIn: boolean;
    checkAuth: () => Promise<void>;
    signOut: () => void;
  }