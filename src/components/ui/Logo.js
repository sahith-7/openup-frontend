// ============================================================
// OpenUp - Logo Component
// ============================================================
// The official brand logo for OpenUp platform
// Props:
//   size: 'sm' | 'md' | 'lg' — controls overall size
//   showText: boolean — show/hide the "OpenUp" text
//   animated: boolean — enable floating animation
//   className: string — extra classes
// ============================================================

"use client";

export default function Logo({
  size = "md",
  showText = true,
  animated = false,
  className = "",
}) {
  // --- Size configurations ---
  const sizes = {
    sm: { icon: 28, text: "text-base", gap: "gap-1.5" },
    md: { icon: 36, text: "text-xl",   gap: "gap-2" },
    lg: { icon: 52, text: "text-3xl",  gap: "gap-3" },
    xl: { icon: 72, text: "text-5xl",  gap: "gap-4" },
  };

  const { icon, text, gap } = sizes[size] || sizes.md;

  return (
    <div
      className={`inline-flex items-center ${gap} ${animated ? "animate-float" : ""} ${className}`}
    >
      {/* -------------------------------------------------------- */}
      {/* Logo Icon — the "O" with flame/pen concept */}
      {/* -------------------------------------------------------- */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="OpenUp logo"
      >
        {/* Outer circle — the "Open" ring */}
        <circle
          cx="24"
          cy="24"
          r="21"
          stroke="url(#brandGradient)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Inner warm fill */}
        <circle
          cx="24"
          cy="24"
          r="17"
          fill="url(#innerGradient)"
          opacity="0.15"
        />

        {/* Pen / Flame shape — the creative spark */}
        <path
          d="M24 10 C24 10, 32 18, 32 26 C32 30.4 28.4 34 24 34 C19.6 34 16 30.4 16 26 C16 18 24 10 24 10Z"
          fill="url(#brandGradient)"
        />

        {/* Inner highlight on flame */}
        <path
          d="M24 16 C24 16, 28 21, 28 26 C28 28.2 26.2 30 24 30 C21.8 30 20 28.2 20 26 C20 21 24 16 24 16Z"
          fill="white"
          opacity="0.4"
        />

        {/* Small dot — the pen tip / spark */}
        <circle cx="24" cy="27" r="2.5" fill="white" opacity="0.9" />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="brandGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FF8C61" />
          </linearGradient>

          <linearGradient id="innerGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FFB085" />
          </linearGradient>
        </defs>
      </svg>

      {/* -------------------------------------------------------- */}
      {/* Logo Wordmark */}
      {/* -------------------------------------------------------- */}
      {showText && (
        <span
          className={`font-display font-bold tracking-tight select-none ${text}`}
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          OpenUp
        </span>
      )}
    </div>
  );
}
