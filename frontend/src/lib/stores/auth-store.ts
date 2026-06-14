import { create } from "zustand";
import type { User, Role } from "@/types";

interface AuthState {
  user: User | null;
  role: Role | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User, role: Role, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user, role, token) => {
    localStorage.setItem("ppti_token", token);
    localStorage.setItem("ppti_user", JSON.stringify(user));
    localStorage.setItem("ppti_role", role);
    set({ user, role: role as Role, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("ppti_token");
    localStorage.removeItem("ppti_user");
    localStorage.removeItem("ppti_role");
    set({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    window.location.href = "/login";
  },

  hydrate: () => {
    if (typeof window === "undefined") {
      set({ isLoading: false });
      return;
    }
    const token = localStorage.getItem("ppti_token");
    const userStr = localStorage.getItem("ppti_user");
    const role = localStorage.getItem("ppti_role");

    if (token && userStr && role) {
      try {
        const user = JSON.parse(userStr) as User;
        set({
          user,
          role: role as Role,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
