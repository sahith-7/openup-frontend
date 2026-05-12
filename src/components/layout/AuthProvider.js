// ============================================================
// OpenUp - Auth Provider
// ============================================================
// Wraps the app and initializes auth state on mount.
// Place this as a client-side wrapper inside the root layout.
// ============================================================

"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthProvider({ children }) {
  const { init } = useAuthStore();

  // Initialize auth from localStorage on every page load
  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
}
