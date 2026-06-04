import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { provider, auth, isFirebaseConfigured } from "./firebase";
import axiosInstance from "./axiosinstance";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  channelname?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  authReady: boolean;
  login: (userdata: User) => void;
  logout: () => Promise<void>;
  handlegooglesignin: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────
const UserContext = createContext<AuthContextType>({
  user: null,
  authReady: false,
  login: () => {},
  logout: async () => {},
  handlegooglesignin: async () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored) as User);
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  const login = useCallback((userdata: User) => {
    setUser(userdata);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userdata));
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setAuthReady(true);
    }
  }, []);

  const handlegooglesignin = useCallback(async () => {
    if (!isFirebaseConfigured) {
      console.error("Firebase env vars are missing. Google sign-in is unavailable.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const payload = {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        image: firebaseUser.photoURL || "https://github.com/shadcn.png",
      };
      const response = await axiosInstance.post("/user/login", payload);
      login(response.data.result as User);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  }, [login]);

  useEffect(() => {
    if (!mounted) return;
    if (!isFirebaseConfigured) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem("user");
        setAuthReady(true);
        return;
      }

      try {
        const payload = {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          image: firebaseUser.photoURL || "https://github.com/shadcn.png",
        };
        const response = await axiosInstance.post("/user/login", payload);
        login(response.data.result as User);
      } catch (error) {
        console.error("Auth state sync error:", error);
        logout();
      } finally {
        setAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, [mounted, login, logout]);

  const value = useMemo(
    () => ({ user, authReady, login, logout, handlegooglesignin }),
    [user, authReady, login, logout, handlegooglesignin]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
