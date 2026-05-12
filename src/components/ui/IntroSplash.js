// ============================================================
// OpenUp - Intro Splash Screen
// ============================================================
// Shows the OpenUp logo animating from center to top-right corner
// Only shown once per session (stored in sessionStorage)
// To disable: set showIntro to always false
// To change timing: adjust the CSS animation durations in globals.css
// ============================================================

"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function IntroSplash({ onComplete }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if intro already shown this session
    const shown = sessionStorage.getItem("openup_intro_shown");

    if (!shown) {
      setShow(true);
      sessionStorage.setItem("openup_intro_shown", "true");

      // Tell parent when intro is complete
      const timer = setTimeout(() => {
        onComplete?.();
        setShow(false);
      }, 2200);

      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [onComplete]);

  if (!show) return null;

  return (
    // Full-screen overlay
    <div
      className="intro-container fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{
        background: "var(--bg-primary)",
      }}
    >
      {/* Animated logo */}
      <div className="intro-logo">
        <Logo size="xl" showText={true} />
      </div>

      {/* Tagline that fades in */}
      <p
        className="absolute mt-20 text-sm font-medium tracking-widest uppercase"
        style={{
          color: "var(--text-muted)",
          animation: "fadeIn 0.5s ease 0.6s both",
          top: "50%",
          transform: "translateY(20px)",
        }}
      >
        Write. Share. Inspire.
      </p>
    </div>
  );
}
