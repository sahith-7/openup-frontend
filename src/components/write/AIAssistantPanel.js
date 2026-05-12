// ============================================================
// OpenUp - AI Writing Assistant Panel
// ============================================================
// A slide-out side panel for the AI writing companion
// Props:
//   text     — current editor content
//   type     — post type (story | poem | quote | thought)
//   onInsert — callback(text) when user wants to insert AI output
//   open     — boolean
//   onClose  — close handler
// ============================================================

"use client";

import { useState } from "react";
import { aiAPI } from "@/lib/api";
import toast from "react-hot-toast";

// ============================================================
// AI Action Buttons — ADD new AI actions here
// ============================================================
const AI_ACTIONS = [
  { action: "continue",   label: "Continue Writing", icon: "⚡", desc: "Let AI continue from where you left off" },
  { action: "ideas",      label: "Give Me Ideas",    icon: "💡", desc: "Get 3 creative directions to take your piece" },
  { action: "grammar",    label: "Fix Grammar",      icon: "✅", desc: "Clean up grammar and punctuation" },
  { action: "rewrite",    label: "Rewrite Tone",     icon: "🎭", desc: "Rewrite in a different style or tone" },
  // OPTIONAL: Add more actions here
  // { action: "poeticize", label: "Make it Poetic",  icon: "🌸", desc: "Add lyrical, poetic language" },
  // { action: "summarize", label: "Summarize",        icon: "📝", desc: "Get a brief summary of your piece" },
];

// Tone options for rewrite action
const TONE_OPTIONS = [
  "poetic", "dramatic", "minimal", "playful", "melancholic", "hopeful", "dark", "whimsical",
];

export default function AIAssistantPanel({ text, type = "story", onInsert, open, onClose }) {
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone]       = useState("poetic");
  const [activeAction, setActiveAction] = useState(null);

  const handleAction = async (action) => {
    if (!text || text.replace(/<[^>]*>/g, "").trim().length < 10) {
      toast.error("Write at least a few words before asking the AI for help");
      return;
    }

    setActiveAction(action);
    setLoading(true);
    setResult("");

    try {
      const data = await aiAPI.assist(action, text.replace(/<[^>]*>/g, ""), {
        type,
        tone: action === "rewrite" ? tone : undefined,
      });
      setResult(data.result);
    } catch (err) {
      toast.error(err.message || "AI assistant failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (!result) return;
    onInsert?.(result);
    setResult("");
    toast.success("AI text inserted ✓");
  };

  if (!open) return null;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Panel — stops propagation so clicking inside doesn't close */}
      <div
        className="w-full max-w-sm h-full flex flex-col shadow-2xl animate-slide-down"
        style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border-light)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: "var(--border-light)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(255,107,53,0.1)" }}
            >
              🤖
            </div>
            <div>
              <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                AI Writing Companion
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Your creative co-writer
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Tone selector — shown always but only relevant for rewrite */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
              Writing Tone (for Rewrite)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                    tone === t ? "text-white" : ""
                  }`}
                  style={
                    tone === t
                      ? { background: "var(--color-brand)" }
                      : { background: "var(--bg-tertiary)", color: "var(--text-muted)" }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
              What would you like help with?
            </label>
            <div className="space-y-2">
              {AI_ACTIONS.map(({ action, label, icon, desc }) => (
                <button
                  key={action}
                  onClick={() => handleAction(action)}
                  disabled={loading}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 border ${
                    activeAction === action && loading ? "opacity-80" : ""
                  }`}
                  style={{
                    background: activeAction === action ? "rgba(255,107,53,0.06)" : "var(--bg-secondary)",
                    borderColor: activeAction === action ? "rgba(255,107,53,0.3)" : "var(--border-light)",
                  }}
                >
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {label}
                      {activeAction === action && loading && " …"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Loading animation */}
          {loading && (
            <div className="flex items-center gap-3 py-4">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "var(--color-brand)", animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                AI is thinking…
              </span>
            </div>
          )}

          {/* AI Result */}
          {result && !loading && (
            <div
              className="rounded-xl p-4 border"
              style={{ background: "rgba(255,107,53,0.04)", borderColor: "rgba(255,107,53,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm" style={{ color: "var(--color-brand)" }}>✨</span>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-brand)" }}>
                  AI Suggestion
                </p>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4" style={{ color: "var(--text-secondary)" }}>
                {result}
              </p>
              <div className="flex gap-2">
                <button onClick={handleInsert} className="btn-primary text-xs px-4 py-2 flex-1 justify-center">
                  Insert into Writing
                </button>
                <button onClick={() => setResult("")} className="btn-secondary text-xs px-3 py-2">
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="px-5 py-3 border-t flex-shrink-0" style={{ borderColor: "var(--border-light)" }}>
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            💡 Write a few sentences first for best results
          </p>
        </div>
      </div>
    </div>
  );
}
