import React, { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, getStoredUser, setAuthToken, setAuthUser } from "@/lib/api";

interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAIL = "riyaagrawal0205@gmail.com";

  const checkAdmin = (email?: string | null) => {
    const normalizedEmail = email?.trim().toLowerCase() ?? "";
    setIsAdmin(normalizedEmail === ADMIN_EMAIL);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const cached = getStoredUser<AuthUser>();
      if (cached) {
        setUser(cached);
        checkAdmin(cached.email);
      }
      try {
        const { user: freshUser } = await apiGet<{ user: AuthUser }>("/auth/me");
        setUser(freshUser);
        setAuthUser(freshUser);
        checkAdmin(freshUser.email);
      } catch (_err) {
        setAuthToken(null);
        setAuthUser(null);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { token, user: newUser } = await apiPost<{ token: string; user: AuthUser }>("/auth/signup", {
      email,
      password,
      displayName,
    });
    setAuthToken(token);
    setAuthUser(newUser);
    setUser(newUser);
    checkAdmin(newUser.email);
  };

  const signIn = async (email: string, password: string) => {
    const { token, user: newUser } = await apiPost<{ token: string; user: AuthUser }>("/auth/login", {
      email,
      password,
    });
    setAuthToken(token);
    setAuthUser(newUser);
    setUser(newUser);
    checkAdmin(newUser.email);
  };

  const signOut = async () => {
    setAuthToken(null);
    setAuthUser(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
