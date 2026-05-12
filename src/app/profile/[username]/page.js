// ============================================================
// OpenUp - User Profile Page
// ============================================================
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import PostCard from "@/components/feed/PostCard";
import useAuthStore from "@/store/authStore";
import { usersAPI } from "@/lib/api";
import toast from "react-hot-toast";

const TYPE_TABS = [
  { value:"all",     label:"All" },
  { value:"story",   label:"📖 Stories" },
  { value:"poem",    label:"🌸 Poems" },
  { value:"quote",   label:"💬 Quotes" },
  { value:"thought", label:"💭 Thoughts" },
];

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, isLoggedIn } = useAuthStore();

  const [profile,   setProfile]   = useState(null);
  const [posts,     setPosts]     = useState([]);
  const [following, setFollowing] = useState(false);
  const [tab,       setTab]       = useState("all");
  const [loading,   setLoading]   = useState(true);

  const isOwn = currentUser?.username === username;

  useEffect(() => {
    setLoading(true);
    usersAPI.getProfile(username)
      .then(data => {
        setProfile(data.user);
        setPosts(data.posts || []);
        setFollowing(data.user.isFollowing || false);
      })
      .catch(() => toast.error("Profile not found"))
      .finally(() => setLoading(false));
  }, [username]);

  const handleFollow = async () => {
    if (!isLoggedIn) { toast.error("Sign in to follow"); return; }
    setFollowing(f => !f);
    setProfile(p => ({ ...p, followersCount: following ? p.followersCount-1 : p.followersCount+1 }));
    try {
      await usersAPI.toggleFollow(profile._id);
    } catch {
      setFollowing(f => !f);
      setProfile(p => ({ ...p, followersCount: following ? p.followersCount+1 : p.followersCount-1 }));
    }
  };

  const filtered = tab==="all" ? posts : posts.filter(p => p.type===tab);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"var(--bg-primary)" }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"var(--color-brand)", borderTopColor:"transparent" }}/>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen" style={{ background:"var(--bg-primary)" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">

        {/* Profile hero */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <img
              src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=FF6B35&color=fff&size=160`}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover ring-4"
              style={{ ringColor:"rgba(255,107,53,0.3)" }}
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-display font-bold text-2xl" style={{ color:"var(--text-primary)" }}>{profile.name}</h1>
                  <p className="text-sm mb-2" style={{ color:"var(--text-muted)" }}>@{profile.username}</p>
                  {profile.bio && <p className="text-sm leading-relaxed max-w-md" style={{ color:"var(--text-secondary)" }}>{profile.bio}</p>}

                  {/* Meta links — OPTIONAL: remove individual items */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {profile.location && (
                      <span className="flex items-center gap-1 text-xs" style={{ color:"var(--text-muted)" }}>📍 {profile.location}</span>
                    )}
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs"
                        style={{ color:"var(--color-brand)" }}>🔗 {profile.website}</a>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {isOwn ? (
                    <Link href="/settings" className="btn-secondary text-sm px-4 py-2">Edit Profile</Link>
                  ) : (
                    <button onClick={handleFollow}
                      className={following ? "btn-secondary text-sm px-5 py-2" : "btn-primary text-sm px-5 py-2"}>
                      {following ? "Following ✓" : "Follow"}
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-5">
                {[
                  { label:"Posts",     value: profile.postCount || posts.length },
                  { label:"Followers", value: profile.followersCount ?? profile.followers?.length ?? 0 },
                  { label:"Following", value: profile.followingCount ?? profile.following?.length ?? 0 },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="font-bold text-xl gradient-text">{stat.value}</p>
                    <p className="text-xs" style={{ color:"var(--text-muted)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TYPE_TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab===t.value?"text-white":""}`}
              style={tab===t.value ? { background:"var(--color-brand)" } : { background:"var(--bg-tertiary)", color:"var(--text-secondary)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 card">
            <p className="text-4xl mb-3">✍️</p>
            <p className="text-sm" style={{ color:"var(--text-muted)" }}>
              {isOwn ? "You haven't published anything yet. " : "No posts yet."}
              {isOwn && <Link href="/write" className="font-semibold" style={{ color:"var(--color-brand)" }}>Start writing →</Link>}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {filtered.map(post => <PostCard key={post._id} post={post} showAuthor={false} />)}
          </div>
        )}
      </div>
    </div>
  );
}
