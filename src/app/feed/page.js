// ============================================================
// OpenUp - Personalized Feed Page
// ============================================================
export const dynamic = 'force-dynamic';
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import PostCard from "@/components/feed/PostCard";
import { postsAPI, usersAPI } from "@/lib/api";
import Link from "next/link";

// Post type filter tabs — ADD new types here
const TYPE_FILTERS = [
  { value: "all",     label: "All" },
  { value: "story",   label: "📖 Stories" },
  { value: "poem",    label: "🌸 Poems" },
  { value: "quote",   label: "💬 Quotes" },
  { value: "thought", label: "💭 Thoughts" },
];

export default function FeedPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, user } = useAuthStore();

  const [posts, setPosts]           = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter]         = useState("all");
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(true);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/auth/login");
  }, [isLoggedIn, isLoading, router]);

  const loadPosts = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const data = await postsAPI.getFeed({ page: currentPage, limit: 12 });
      const newPosts = data.posts || [];
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts.length === 12);
      if (!reset) setPage(p => p + 1);
    } catch (err) {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (isLoggedIn) {
      loadPosts(true);
      usersAPI.getSuggestions(5).then(d => setSuggestions(d.suggestions || [])).catch(() => {});
    }
  }, [isLoggedIn]);

  // Filter posts client-side by type
  const filtered = filter === "all" ? posts : posts.filter(p => p.type === filter);

  if (isLoading || !isLoggedIn) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">

          {/* Main feed */}
          <div>
            {/* Greeting */}
            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
                Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
                <span className="gradient-text">{user?.name?.split(" ")[0]}</span> ✨
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Here's what's new from writers you follow</p>
            </div>

            {/* Type filter tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {TYPE_FILTERS.map((t) => (
                <button key={t.value} onClick={() => setFilter(t.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter===t.value ? "text-white shadow-brand" : "btn-secondary"}`}
                  style={filter===t.value ? { background:"var(--color-brand)" } : {}}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Quick write CTA */}
            <Link href="/write" className="flex items-center gap-3 card p-4 mb-6 hover:border-orange-300 group transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background:"var(--bg-tertiary)" }}>
                <span style={{ color:"var(--text-muted)" }}>✍️</span>
              </div>
              <span className="text-sm group-hover:text-orange-500 transition-colors" style={{ color:"var(--text-muted)" }}>
                What's on your mind? Start writing…
              </span>
              <span className="ml-auto btn-primary text-xs px-3 py-1.5 flex-shrink-0">Write</span>
            </Link>

            {/* Posts grid */}
            {loading && posts.length === 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse">
                    <div className="h-4 rounded mb-3" style={{ background:"var(--bg-tertiary)", width:"60%" }} />
                    <div className="h-6 rounded mb-2" style={{ background:"var(--bg-tertiary)" }} />
                    <div className="h-4 rounded mb-1" style={{ background:"var(--bg-tertiary)", width:"80%" }} />
                    <div className="h-4 rounded" style={{ background:"var(--bg-tertiary)", width:"65%" }} />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 card">
                <p className="text-5xl mb-4">📭</p>
                <h3 className="font-display font-bold text-xl mb-2" style={{ color:"var(--text-primary)" }}>Your feed is quiet</h3>
                <p className="text-sm mb-6" style={{ color:"var(--text-muted)" }}>Follow some writers to see their posts here</p>
                <Link href="/explore" className="btn-primary">Discover Writers</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {filtered.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            )}

            {/* Load more */}
            {hasMore && !loading && filtered.length > 0 && (
              <div className="flex justify-center mt-8">
                <button onClick={() => loadPosts()} className="btn-secondary px-8">
                  Load More
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Suggested writers */}
            {suggestions.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-sm mb-4" style={{ color:"var(--text-primary)" }}>Writers to Follow</h3>
                <div className="space-y-4">
                  {suggestions.map((writer) => (
                    <Link key={writer._id} href={`/profile/${writer.username}`}
                      className="flex items-center gap-3 group">
                      <img src={writer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(writer.name)}&background=FF6B35&color=fff&size=60`}
                        alt={writer.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-orange-500 transition-colors"
                          style={{ color:"var(--text-primary)" }}>{writer.name}</p>
                        <p className="text-xs truncate" style={{ color:"var(--text-muted)" }}>@{writer.username}</p>
                      </div>
                      <span className="text-xs font-medium flex-shrink-0" style={{ color:"var(--color-brand)" }}>Follow</span>
                    </Link>
                  ))}
                </div>
                <Link href="/explore" className="block text-center text-xs font-medium mt-4 pt-4 border-t"
                  style={{ borderColor:"var(--border-light)", color:"var(--color-brand)" }}>
                  See more writers →
                </Link>
              </div>
            )}

            {/* Daily prompt — OPTIONAL: remove this block */}
            <div className="card p-5" style={{ background:"linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(255,140,97,0.05) 100%)", borderColor:"rgba(255,107,53,0.2)" }}>
              <p className="section-label mb-2">✨ Daily Prompt</p>
              <p className="text-sm leading-relaxed" style={{ color:"var(--text-secondary)" }}>
                "Write about a moment when silence spoke louder than words."
              </p>
              <Link href="/write" className="btn-primary w-full justify-center mt-4 text-sm py-2.5">
                Start Writing
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
