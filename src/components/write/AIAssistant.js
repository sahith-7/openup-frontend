// ============================================================
// OpenUp - AI Writing Assistant Panel
// ============================================================
// Side panel that helps writers when they're stuck
// To add a new AI action: add it to the AI_ACTIONS array
// ============================================================

"use client";

import { useState } from "react";
import { aiAPI } from "@/lib/api";
import toast from "react-hot-toast";

// ============================================================
// AI Actions — ADD or REMOVE actions here
// Each action maps to a backend AI prompt
// ============================================================
const AI_ACTIONS = [
  {
    id: "continue",
    label: "Continue Writing",
    icon: "✨",
    description: "Let AI continue from where you left off",
    color: "#6366f1",
  },
  {
    id: "ideas",
    label: "Suggest Ideas",
    icon: "💡",
    description: "Get 3 creative directions to take your piece",
    color: "#f59e0b",
  },
  {
    id: "grammar",
    label: "Fix Grammar",
    icon: "✏️",
    description: "Clean up grammar and improve clarity",
    color: "#10b981",
  },
  {
    id: "rewrite",
    label: "Rewrite Tone",
    icon: "🎭",
    description: "Rewrite in a different style or tone",
    color: "#ec4899",
    hasToneSelector: true,
  },
  // OPTIONAL: Uncomment to add more AI features
  // { id: "poeticize", label: "Make Poetic", icon: "🌸", description: "Transform into lyrical prose", color: "#8b5cf6" },
  // { id: "summarize", label: "Summarize",   icon: "📝", description: "Condense to key ideas",       color: "#64748b" },
];

// ============================================================
// Tone options for the "Rewrite" action
// ADD new tones here
// ============================================================
const TONE_OPTIONS = [
  { value: "poetic",       label: "Poetic" },
  { value: "formal",       label: "Formal" },
  { value: "casual",       label: "Casual" },
  { value: "emotional",    label: "Emotional" },
  { value: "minimalist",   label: "Minimalist" },
  { value: "dramatic",     label: "Dramatic" },
  // { value: "humorous", label: "Humorous" },  // OPTIONAL
];

export default function AIAssistant({ editorContent, postType, onInsert }) {
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [activeAction, setAct]  = useState(null);
  const [tone, setTone]         = useState("poetic");
  const [collapsed, setCollapsed] = useState(false);

  const handleAction = async (action) => {
    if (!editorContent || editorContent.trim().length < 10) {
      toast.error("Write at least a sentence first!");
      return;
    }

    setLoading(true);
    setAct(action.id);
    setResult(null);

    try {
      const data = await aiAPI.assist(action.id, editorContent, {
        type: postType || "story",
        tone,
      });
      setResult({ text: data.result, action: action.id });
    } catch (err) {
      toast.error(err.message || "AI assistant is unavailable right now");
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (result && onInsert) {
      onInsert(result.text);
      toast.success("Added to your writing!");
      setResult(null);
      setAct(null);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.text);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <aside
      className={`flex flex-col transition-all duration-300 ${
        collapsed ? "w-12" : "w-72"
      }`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-xl)",
        height: "fit-content",
        position: "sticky",
        top: "calc(var(--navbar-height) + 24px)",
        maxHeight: "calc(100vh - var(--navbar-height) - 48px)",
        overflowY: "auto",
      }}
    >
      {/* -------------------------------------------------------- */}
      {/* Panel Header */}
      {/* -------------------------------------------------------- */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: "var(--border-light)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                AI Companion
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Your creative co-pilot
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="btn-ghost p-1.5 rounded-lg ml-auto"
          title={collapsed ? "Expand AI panel" : "Collapse AI panel"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: collapsed ? "rotate(180deg)" : "none",
              transition: "transform 0.2s ease",
            }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* -------------------------------------------------------- */}
      {/* Panel Body — hidden when collapsed */}
      {/* -------------------------------------------------------- */}
      {!collapsed && (
        <div className="p-4 flex flex-col gap-3">

          {/* --- Tone Selector (shown when rewrite is hovered/selected) --- */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
              Tone for Rewrite
            </p>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="input text-xs py-2"
            >
              {TONE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* --- AI Action Buttons --- */}
          <div className="flex flex-col gap-2">
            {AI_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                disabled={loading}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 border group"
                style={{
                  background: activeAction === action.id && loading
                    ? `${action.color}15`
                    : "var(--bg-secondary)",
                  borderColor: activeAction === action.id
                    ? action.color
                    : "var(--border-light)",
                  opacity: loading && activeAction !== action.id ? 0.5 : 1,
                }}
              >
                <span className="text-lg flex-shrink-0">{action.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {action.label}
                  </p>
                  <p
                    className="text-[11px] leading-tight mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {action.description}
                  </p>
                </div>

                {/* Loading spinner */}
                {loading && activeAction === action.id && (
                  <div
                    className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin flex-shrink-0 ml-auto"
                    style={{ borderColor: action.color, borderTopColor: "transparent" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* -------------------------------------------------------- */}
          {/* AI Result Box */}
          {/* -------------------------------------------------------- */}
          {result && (
            <div
              className="mt-2 rounded-xl p-3 border animate-fade-in"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--color-brand)",
                borderWidth: "1px",
              }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-brand)" }}>
                ✨ AI Suggestion
              </p>

              {/* Result text with scroll */}
              <div
                className="text-xs leading-relaxed max-h-40 overflow-y-auto pr-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {result.text.split("\n").map((line, i) => (
                  <p key={i} className={line ? "mb-2" : "mb-1"}>
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                {/* Insert into editor */}
                <button
                  onClick={handleInsert}
                  className="flex-1 btn-primary py-1.5 text-xs"
                >
                  Insert ↵
                </button>

                {/* Copy to clipboard */}
                <button
                  onClick={handleCopy}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  Copy
                </button>

                {/* Dismiss */}
                <button
                  onClick={() => setResult(null)}
                  className="btn-ghost py-1.5 px-2 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* --- Empty state tip --- */}
          {!result && !loading && (
            <p
              className="text-center text-xs px-2 py-3"
              style={{ color: "var(--text-muted)" }}
            >
              Start writing, then use an action above to get AI help 🪄
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
