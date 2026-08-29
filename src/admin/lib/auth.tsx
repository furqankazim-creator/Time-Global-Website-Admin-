import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, bootstrapSession, setAccessToken } from "./api";

export type Role = "admin" | "editor" | "author" | "viewer";

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  lastLoginAt: string | null;
};

type AuthState = {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** True for roles allowed to mutate — mirrors the server's denyReadOnly. */
  canEdit: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount the in-memory token is gone (page reload), but the httpOnly
  // refresh cookie may still be valid — trade it for a new session.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await bootstrapSession();
      if (cancelled) return;
      if (token) {
        try {
          const { user } = await api<{ user: AdminUser }>("/api/v1/auth/me");
          if (!cancelled) setUser(user);
        } catch {
          /* session unusable — stay logged out */
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api<{ accessToken: string; user: AdminUser }>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setAccessToken(res.accessToken);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await api("/api/v1/auth/logout", { method: "POST" });
    } finally {
      // Clear locally even if the network call failed.
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, canEdit: !!user && user.role !== "viewer" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
