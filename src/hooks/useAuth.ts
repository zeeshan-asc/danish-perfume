"use client";

import { useState, useCallback, useEffect } from "react";
import { IUser } from "@/types";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; field?: string }>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<{ error?: string; field?: string; details?: Record<string, string[]> }>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          setUser(json.data);
        }
      } catch {
        // Not authenticated — that's fine
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        return { error: json.error, field: json.field };
      }

      setUser(json.data.user);
      return {};
    } catch {
      return { error: "Connection error. Please try again." };
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string, confirmPassword: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const json = await res.json();

      if (!res.ok) {
        return { error: json.error, field: json.field, details: json.details };
      }

      setUser(json.data.user);
      return {};
    } catch {
      return { error: "Connection error. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Logout should always succeed locally
    }
    setUser(null);
  }, []);

  return { user, loading, login, register, logout };
}
