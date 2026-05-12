// ============================================================
// OpenUp - Auth Store (Zustand)
// ============================================================
// Global state for authentication
// To add new state: add a new field in the initial state
// To add new actions: add a new function in the store
// ============================================================

import { create } from "zustand";
import { authAPI } from "../lib/api";

const useAuthStore = create((set, get) => ({
  // ============================================================
  // State
  // ============================================================
  user: null,
  token: null,
  isLoading: true,    // True while checking auth on app load
  isLoggedIn: false,

  // ============================================================
  // Actions
  // ============================================================

  // Initialize auth state from localStorage (call on app mount)
  init: async () => {
    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("openup_token");
      const savedUser = localStorage.getItem("openup_user");

      if (token && savedUser) {
        set({
          token,
          user: JSON.parse(savedUser),
          isLoggedIn: true,
          isLoading: false,
        });

        // Refresh user data in background
        try {
          const data = await authAPI.getMe();
          set({ user: data.user });
          localStorage.setItem("openup_user", JSON.stringify(data.user));
        } catch {
          // Token invalid — log out
          get().logout();
        }
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    const data = await authAPI.login({ email, password });
    const { token, user } = data;

    localStorage.setItem("openup_token", token);
    localStorage.setItem("openup_user", JSON.stringify(user));

    set({ token, user, isLoggedIn: true });
    return data;
  },

  // Signup
  signup: async (formData) => {
    const data = await authAPI.signup(formData);
    const { token, user } = data;

    localStorage.setItem("openup_token", token);
    localStorage.setItem("openup_user", JSON.stringify(user));

    set({ token, user, isLoggedIn: true });
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("openup_token");
    localStorage.removeItem("openup_user");
    set({ token: null, user: null, isLoggedIn: false });
  },

  // Update user data (e.g., after profile edit)
  updateUser: (updates) => {
    const updated = { ...get().user, ...updates };
    set({ user: updated });
    localStorage.setItem("openup_user", JSON.stringify(updated));
  },
}));

export default useAuthStore;
