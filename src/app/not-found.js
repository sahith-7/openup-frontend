// ============================================================
// OpenUp - 404 Not Found Page
// ============================================================
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Giant decorative number */}
      <p
        className="font-display font-bold select-none"
        style={{
          fontSize: "clamp(8rem, 20vw, 16rem)",
          lineHeight: 1,
          background: "linear-gradient(135deg, #FF6B35 0%, rgba(255,107,53,0.2) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </p>

      <h1 className="font-display font-bold text-3xl mb-3" style={{ color: "var(--text-primary)" }}>
        This page got lost in the story
      </h1>
      <p className="text-base mb-8 max-w-sm" style={{ color: "var(--text-muted)" }}>
        The page you're looking for doesn't exist, or it may have been moved.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/" className="btn-primary px-8 py-3">
          Go Home
        </Link>
        <Link href="/explore" className="btn-secondary px-8 py-3">
          Explore Writing
        </Link>
      </div>
    </div>
  );
}
