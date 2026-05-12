// ============================================================
// OpenUp - Landing Page (Homepage)
// ============================================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import IntroSplash from "@/components/ui/IntroSplash";
import { postsAPI, usersAPI } from "@/lib/api";
import PostCard from "@/components/feed/PostCard";

// ============================================================
// CONTENT — Edit these objects to customize landing page text
// ============================================================
const HERO_CONTENT = {
  eyebrow:      "A Space for Creators",
  headline:     ["Your Words", "Deserve a", "Beautiful Home"],
  subheadline:  "OpenUp is where writers, poets, and thinkers share their craft — and connect with readers who care.",
  primaryCTA:   { label: "Start Writing Free", href: "/auth/signup" },
  secondaryCTA: { label: "Explore Stories",    href: "/explore" },
};

const FEATURES = [
  { icon: "✍️", title: "Rich Writing Experience",  desc: "A distraction-free editor with formatting tools and auto-save drafts.",    color: "#FF6B35" },
  { icon: "🤖", title: "AI Writing Companion",     desc: "Continue writing, get ideas, or rewrite in different tones with AI.",       color: "#6366f1" },
  { icon: "🌐", title: "Creative Community",       desc: "Follow writers you love, build your audience, and engage with readers.",    color: "#ec4899" },
  { icon: "📖", title: "Multiple Formats",         desc: "Stories, poems, quotes, thoughts — each with its own beautiful display.",   color: "#10b981" },
  { icon: "🔔", title: "Real-time Notifications",  desc: "Know when someone follows, likes, or comments on your work instantly.",     color: "#f59e0b" },
  { icon: "🌙", title: "Dark Mode & Reading Mode", desc: "Easy on the eyes at any hour, with a focused reading view for long reads.", color: "#8b5cf6" },
];

const STATS = [
  { value: "10K+",  label: "Writers" },
  { value: "50K+",  label: "Stories Published" },
  { value: "200K+", label: "Readers" },
  { value: "4.9★",  label: "User Rating" },
];

// ============================================================
// Mock Cards for Hero — shown on desktop only
// ============================================================
const HERO_MOCK_CARDS = [
  { type: "poem",    title: "When Rain Speaks",   excerpt: "In every drop that hits the glass, I hear a thousand untold stories...", author: "Aria M.",  color: "#ec4899" },
  { type: "story",   title: "The Last Library",   excerpt: "She found the door behind the climbing roses — and every forgotten book...", author: "James K.", color: "#6366f1" },
  { type: "quote",   title: "On Beginnings",      excerpt: "Every sentence is a door. Some open inward. Some push you into the cold.", author: "Sarah L.", color: "#f59e0b" },
];

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuthStore();
  const [trendingPosts,   setTrendingPosts]   = useState([]);
  const [trendingWriters, setTrendingWriters] = useState([]);

  // Redirect logged-in users straight to feed
  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace("/feed");
  }, [isLoggedIn, isLoading, router]);

  // Load preview content (non-critical — page works without it)
  useEffect(() => {
    (async () => {
      try {
        const [postsData, writersData] = await Promise.all([
          postsAPI.getTrending(3),
          usersAPI.getTrendingWriters(4),
        ]);
        setTrendingPosts(postsData.posts || []);
        setTrendingWriters(writersData.writers || []);
      } catch {}
    })();
  }, []);

  if (isLoading) return null;

  return (
    <>
      {/* Logo intro animation — animates from center to top-right */}
      <IntroSplash />

      <div className="page-reveal min-h-screen">
        <Navbar />

        {/* ===================================================== */}
        {/* HERO */}
        {/* ===================================================== */}
        <section
          className="relative min-h-screen flex items-center pt-16 overflow-hidden"
          style={{ background: "var(--bg-primary)" }}
        >
          {/* Ambient gradient blobs */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(circle, #FF6B35 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
              style={{ background: "radial-gradient(circle, #FF8C61 0%, transparent 70%)" }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* — Left: Copy — */}
            <div className="text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ background: "rgba(255,107,53,0.1)", color: "var(--color-brand)", border: "1px solid rgba(255,107,53,0.2)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-brand)" }} />
                {HERO_CONTENT.eyebrow}
              </div>

              {/* Headline */}
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
                style={{ color: "var(--text-primary)" }}>
                {HERO_CONTENT.headline.map((line, i, arr) =>
                  i === arr.length - 1
                    ? <span key={i} className="gradient-text block">{line}</span>
                    : <span key={i} className="block">{line}</span>
                )}
              </h1>

              <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
                style={{ color: "var(--text-secondary)" }}>
                {HERO_CONTENT.subheadline}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={HERO_CONTENT.primaryCTA.href} className="btn-primary text-base px-8 py-4">
                  {HERO_CONTENT.primaryCTA.label}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href={HERO_CONTENT.secondaryCTA.href} className="btn-secondary text-base px-8 py-4">
                  {HERO_CONTENT.secondaryCTA.label}
                </Link>
              </div>

              {/* Content-type pills */}
              <div className="flex flex-wrap gap-2 mt-8 justify-center lg:justify-start">
                {["Short Stories","Poetry","Quotes","Thoughts","Essays"].map((label, i) => {
                  const colors = ["#6366f1","#ec4899","#f59e0b","#10b981","#FF6B35"];
                  return (
                    <span key={label} className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: colors[i]+"15", color: colors[i], border:`1px solid ${colors[i]}30` }}>
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* — Right: Mock post cards — */}
            <div className="hidden lg:flex flex-col gap-4">
              {HERO_MOCK_CARDS.map((card, i) => (
                <div key={i} className="card p-5"
                  style={{ transform: `rotate(${i%2===0?".5deg":"-.5deg"})`, opacity: 1 - i * 0.06 }}>
                  <span className="badge text-xs mb-3"
                    style={{ color: card.color, background: card.color+"15" }}>
                    {card.type}
                  </span>
                  <h3 className="font-display font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {card.excerpt}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>by {card.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* STATS — OPTIONAL: remove this section block */}
        {/* ===================================================== */}
        <section className="py-16 border-y"
          style={{ borderColor: "var(--border-light)", background: "var(--bg-secondary)" }}>
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display font-bold text-4xl gradient-text">{s.value}</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================== */}
        {/* FEATURES */}
        {/* ===================================================== */}
        <section className="py-24 px-4" style={{ background: "var(--bg-primary)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="section-label mb-3">Everything You Need</p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl" style={{ color: "var(--text-primary)" }}>
                Built for <span className="gradient-text">Creators</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="card p-6 group">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                    style={{ background: f.color + "15" }}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* TRENDING POSTS — OPTIONAL: remove this section block */}
        {/* ===================================================== */}
        {trendingPosts.length > 0 && (
          <section className="py-24 px-4" style={{ background: "var(--bg-secondary)" }}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="section-label mb-2">Trending Now</p>
                  <h2 className="font-display font-bold text-3xl" style={{ color: "var(--text-primary)" }}>Popular Stories</h2>
                </div>
                <Link href="/explore" className="btn-secondary text-sm px-5 py-2.5">View All →</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingPosts.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            </div>
          </section>
        )}

        {/* ===================================================== */}
        {/* WRITERS SPOTLIGHT — OPTIONAL: remove this section block */}
        {/* ===================================================== */}
        {trendingWriters.length > 0 && (
          <section className="py-24 px-4" style={{ background: "var(--bg-primary)" }}>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="section-label mb-2">Community Spotlight</p>
                <h2 className="font-display font-bold text-3xl" style={{ color: "var(--text-primary)" }}>Meet the Writers</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {trendingWriters.map((w) => (
                  <Link key={w._id} href={`/profile/${w.username}`} className="card p-5 text-center card-interactive group">
                    <img src={w.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&background=FF6B35&color=fff&size=100`}
                      alt={w.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
                    <h3 className="font-semibold text-sm group-hover:gradient-text" style={{ color: "var(--text-primary)" }}>{w.name}</h3>
                    <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>@{w.username}</p>
                    <p className="text-xs line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>{w.bio}</p>
                    <p className="text-xs font-medium" style={{ color: "var(--color-brand)" }}>{w.followers?.length || 0} followers</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===================================================== */}
        {/* CTA BANNER */}
        {/* ===================================================== */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl p-12 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)" }}>
              <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white opacity-20"
                  style={{ transform: "translate(30%,-30%)" }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white opacity-20"
                  style={{ transform: "translate(-30%,30%)" }} />
              </div>
              <h2 className="font-display font-bold text-4xl text-white mb-4 relative z-10">
                Ready to share your story?
              </h2>
              <p className="text-white/80 text-lg mb-8 relative z-10">
                Join thousands of writers building their audience on OpenUp.
              </p>
              <Link href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 relative z-10"
                style={{ color: "var(--color-brand)" }}>
                Create Your Free Account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* FOOTER */}
        {/* ===================================================== */}
        <footer className="border-t py-12 px-4" style={{ borderColor: "var(--border-light)", background: "var(--bg-secondary)" }}>
          <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8">
            <div>
              <p className="font-display font-bold text-xl gradient-text mb-3">OpenUp</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Write. Share. Inspire.</p>
            </div>
            {[
              { title: "Platform", links: [{ label:"Explore",href:"/explore"},{label:"Sign Up",href:"/auth/signup"},{label:"Sign In",href:"/auth/login"}]},
              { title: "Company",  links: [{ label:"About",  href:"/about" },{label:"Privacy",href:"/privacy" },{label:"Terms",  href:"/terms"  }]},
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm transition-colors hover:text-orange-500"
                        style={{ color: "var(--text-muted)" }}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="max-w-6xl mx-auto mt-10 pt-6 border-t flex items-center justify-between"
            style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>© {new Date().getFullYear()} OpenUp. All rights reserved.</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Made with ❤️ for writers</p>
          </div>
        </footer>
      </div>
    </>
  );
}
