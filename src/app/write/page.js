// ============================================================
// OpenUp - Write / Editor Page
// ============================================================
// Full post creation and editing page with AI assistant
// ============================================================
export const dynamic = 'force-dynamic';
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import RichEditor from "@/components/write/RichEditor";
import AIAssistantPanel from "@/components/write/AIAssistantPanel";
import { postsAPI } from "@/lib/api";
import Link from "next/link";

// Post type options — ADD new types here
const POST_TYPES = [
  { value:"story",   label:"📖 Story",   desc:"A narrative piece" },
  { value:"poem",    label:"🌸 Poem",    desc:"Verse and poetry" },
  { value:"quote",   label:"💬 Quote",   desc:"A memorable line" },
  { value:"thought", label:"💭 Thought", desc:"A personal reflection" },
];

export default function WritePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { isLoggedIn, isLoading } = useAuthStore();
  const editId = params.get("edit");  // ?edit=postId for editing

  // Form state
  const [title,   setTitle]   = useState("");
  const [content, setContent] = useState("");
  const [type,    setType]    = useState("story");
  const [tags,    setTags]    = useState([]);
  const [tagInput,setTagInput]= useState("");
  const [status,  setStatus]  = useState("draft");

  // UI state
  const [saving,   setSaving]    = useState(false);
  const [aiOpen,   setAiOpen]    = useState(false);
  const [lastSaved,setLastSaved] = useState(null);
  const autoSaveTimer = useRef(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/auth/login");
  }, [isLoggedIn, isLoading, router]);

  // Load post for editing
  useEffect(() => {
    if (editId) {
      postsAPI.getById(editId).then(d => {
        setTitle(d.post.title || "");
        setContent(d.post.content || "");
        setType(d.post.type || "story");
        setTags(d.post.tags || []);
        setStatus(d.post.status || "draft");
      }).catch(() => toast.error("Could not load post"));
    }
  }, [editId]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!title && !content) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      handleSave("draft", true);
    }, 30000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [title, content]);

  const handleSave = async (saveStatus = status, isAutoSave = false) => {
    if (!title.trim()) {
      if (!isAutoSave) toast.error("Please add a title");
      return;
    }
    if (!content.trim() && !isAutoSave) {
      toast.error("Please write some content");
      return;
    }

    setSaving(true);
    try {
      const payload = { title, content, type, tags, status: saveStatus };
      if (editId) {
        await postsAPI.update(editId, payload);
      } else {
        await postsAPI.create(payload);
      }

      if (!isAutoSave) {
        if (saveStatus === "published") {
          toast.success("Post published! 🎉");
          router.push("/feed");
        } else {
          toast.success("Draft saved ✓");
          setLastSaved(new Date());
        }
      } else {
        setLastSaved(new Date());
      }
    } catch (err) {
      if (!isAutoSave) toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Insert AI text into editor
  const handleAiInsert = (text) => {
    setContent(prev => {
      const clean = prev.replace(/<\/p>$/, "");
      return `${clean} ${text}</p>`;
    });
  };

  // Tag management
  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9_]/g,"");
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags(t => [...t, tag]);
      }
      setTagInput("");
    }
  };
  const removeTag = (tag) => setTags(t => t.filter(x => x !== tag));

  if (isLoading || !isLoggedIn) return null;

  return (
    <div className="min-h-screen" style={{ background:"var(--bg-primary)" }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Link href="/feed" className="btn-ghost text-sm gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </Link>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="text-xs hidden sm:block" style={{ color:"var(--text-muted)" }}>
                Auto-saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {/* AI assistant toggle */}
            <button onClick={() => setAiOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
              style={{ background:"rgba(255,107,53,0.08)", color:"var(--color-brand)", borderColor:"rgba(255,107,53,0.25)" }}>
              🤖 AI Assistant
            </button>
            {/* Save draft */}
            <button onClick={() => handleSave("draft")} disabled={saving}
              className="btn-secondary text-sm px-4 py-2">
              {saving ? "Saving…" : "Save Draft"}
            </button>
            {/* Publish */}
            <button onClick={() => handleSave("published")} disabled={saving}
              className="btn-primary text-sm px-5 py-2">
              Publish
            </button>
          </div>
        </div>

        {/* Post type selector */}
        <div className="flex gap-2 flex-wrap mb-6">
          {POST_TYPES.map(t => (
            <button key={t.value} onClick={() => setType(t.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${type===t.value?"text-white":"btn-secondary"}`}
              style={type===t.value ? { background:"var(--color-brand)", borderColor:"var(--color-brand)" } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Title input */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Give your piece a title…"
          maxLength={200}
          className="w-full font-display font-bold text-3xl sm:text-4xl bg-transparent border-0 outline-none mb-6 placeholder-shown:text-gray-300"
          style={{ color:"var(--text-primary)", caretColor:"var(--color-brand)" }}
        />

        {/* Editor */}
        <div className="rounded-xl overflow-hidden mb-6" style={{ border:"1px solid var(--border-light)" }}>
          <RichEditor value={content} onChange={setContent} type={type} />
        </div>

        {/* Tags — OPTIONAL: remove this block */}
        <div className="card p-4 mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color:"var(--text-secondary)" }}>
            Tags <span style={{ color:"var(--text-muted)" }}>(up to 5, press Enter to add)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background:"rgba(255,107,53,0.1)", color:"var(--color-brand)" }}>
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">×</button>
              </span>
            ))}
          </div>
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder={tags.length < 5 ? "Add a tag…" : "Max 5 tags reached"}
            disabled={tags.length >= 5}
            className="input text-sm py-2"
          />
        </div>
      </div>

      {/* AI Assistant Panel (slide-in) */}
      <AIAssistantPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        text={content}
        type={type}
        onInsert={handleAiInsert}
      />
    </div>
  );
}
