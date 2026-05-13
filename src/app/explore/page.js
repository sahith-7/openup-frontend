// ============================================================
// OpenUp - Explore / Public Feed Page
// ============================================================
export const dynamic = 'force-dynamic';
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import PostCard from "@/components/feed/PostCard";
import useAuthStore from "@/store/authStore";
import { postsAPI, usersAPI } from "@/lib/api";
import Link from "next/link";

// Filter/Sort config — ADD or REMOVE options here
const TYPE_FILTERS = [
  { value:"all",     label:"All" },
  { value:"story",   label:"📖 Stories" },
  { value:"poem",    label:"🌸 Poems" },
  { value:"quote",   label:"💬 Quotes" },
  { value:"thought", label:"💭 Thoughts" },
];
const SORT_OPTIONS = [
  { value:"latest",  label:"Latest" },
  { value:"popular", label:"Popular" },
  { value:"trending",label:"Trending" },
];

export default function ExplorePage() {
  const { isLoggedIn } = useAuthStore();
  const [posts, setPosts]     = useState([]);
  const [writers, setWriters] = useState([]);
  const [type,    setType]    = useState("all");
  const [sort,    setSort]    = useState("latest");
  const [search,  setSearch]  = useState("");
  const [query,   setQuery]   = useState("");
  const [page,    setPage]    = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getTrendingWriters(6).then(d => setWriters(d.writers||[])).catch(()=>{});
  }, []);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setPage(1);
    postsAPI.getAll({ type, sort, search: query, page:1, limit:12 })
      .then(d => { if (!cancel) { setPosts(d.posts||[]); setHasMore((d.posts||[]).length===12); }})
      .catch(()=>{})
      .finally(()=>{ if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [type, sort, query]);

  const loadMore = async () => {
    const next = page + 1;
    setPage(next);
    const data = await postsAPI.getAll({ type, sort, search:query, page:next, limit:12 });
    setPosts(prev => [...prev, ...(data.posts||[])]);
    setHasMore((data.posts||[]).length===12);
  };

  return (
    <div className="min-h-screen" style={{ background:"var(--bg-primary)" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        {/* Header */}
        <div className="text-center py-12">
          <p className="section-label mb-3">Discover</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{ color:"var(--text-primary)" }}>
            Explore <span className="gradient-text">Creative Writing</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color:"var(--text-secondary)" }}>
            Stories, poems, quotes, and thoughts from writers around the world.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <form onSubmit={e => { e.preventDefault(); setQuery(search); }} className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color:"var(--text-muted)" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories, poems, writers…"
              className="input pl-11 pr-4" />
          </form>
        </div>

        {/* Trending writers strip — OPTIONAL: remove this block */}
        {writers.length > 0 && (
          <div className="mb-10">
            <h2 className="font-semibold text-sm mb-4" style={{ color:"var(--text-primary)" }}>✨ Trending Writers</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {writers.map(w => (
                <Link key={w._id} href={`/profile/${w.username}`}
                  className="flex-shrink-0 flex flex-col items-center gap-2 card p-4 w-28 text-center card-interactive group">
                  <img src={w.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&background=FF6B35&color=fff&size=80`}
                    alt={w.name} className="w-12 h-12 rounded-full object-cover" />
                  <span className="text-xs font-medium truncate w-full group-hover:text-orange-500 transition-colors"
                    style={{ color:"var(--text-primary)" }}>{w.name}</span>
                  <span className="text-xs" style={{ color:"var(--text-muted)" }}>{w.postCount||0} posts</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map(t => (
              <button key={t.value} onClick={() => setType(t.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${type===t.value?"text-white":"btn-secondary"}`}
                style={type===t.value ? { background:"var(--color-brand)" } : {}}>
                {t.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="input w-auto text-sm px-3 py-2">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_,i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 rounded mb-3" style={{ background:"var(--bg-tertiary)", width:"60%" }}/>
                <div className="h-6 rounded mb-2" style={{ background:"var(--bg-tertiary)" }}/>
                <div className="h-4 rounded" style={{ background:"var(--bg-tertiary)", width:"80%" }}/>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color:"var(--text-primary)" }}>No results found</h3>
            <p className="text-sm" style={{ color:"var(--text-muted)" }}>Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        )}

        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <button onClick={loadMore} className="btn-secondary px-10">Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}
