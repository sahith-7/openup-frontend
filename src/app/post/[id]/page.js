// ============================================================
// OpenUp - Single Post Page
// ============================================================
export const dynamic = 'force-dynamic';
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import useAuthStore from "@/store/authStore";
import { postsAPI, commentsAPI, usersAPI } from "@/lib/api";

const TYPE_CONFIG = {
  story:   { label:"Story",   color:"#6366f1", emoji:"📖" },
  poem:    { label:"Poem",    color:"#ec4899", emoji:"🌸" },
  quote:   { label:"Quote",   color:"#f59e0b", emoji:"💬" },
  thought: { label:"Thought", color:"#10b981", emoji:"💭" },
};

export default function PostPage() {
  const { id } = useParams();
  const router  = useRouter();
  const { user, isLoggedIn } = useAuthStore();

  const [post,     setPost]     = useState(null);
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [liked,    setLiked]    = useState(false);
  const [likes,    setLikes]    = useState(0);
  const [comment,  setComment]  = useState("");
  const [posting,  setPosting]  = useState(false);
  const [following,setFollowing]= useState(false);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await postsAPI.getById(id);
      setPost(data.post);
      setLikes(data.post.likes?.length || 0);
      setLiked(data.post.likes?.includes(user?._id));
    } catch { router.replace("/explore"); }
    finally { setLoading(false); }
  };

  const loadComments = async () => {
    try {
      const data = await commentsAPI.getForPost(id);
      setComments(data.comments || []);
    } catch {}
  };

  const handleLike = async () => {
    if (!isLoggedIn) { toast.error("Sign in to like"); return; }
    setLiked(l => !l);
    setLikes(c => liked ? c-1 : c+1);
    try {
      const data = await postsAPI.toggleLike(id);
      setLiked(data.liked);
      setLikes(data.likesCount);
    } catch {
      setLiked(l => !l);
      setLikes(c => liked ? c+1 : c-1);
    }
  };

  const handleFollow = async () => {
    if (!isLoggedIn) { toast.error("Sign in to follow"); return; }
    setFollowing(f => !f);
    try {
      await usersAPI.toggleFollow(post.author._id);
    } catch { setFollowing(f => !f); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error("Sign in to comment"); return; }
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const data = await commentsAPI.create(id, { content: comment });
      setComments(c => [data.comment, ...c]);
      setComment("");
      toast.success("Comment posted");
    } catch (err) { toast.error(err.message); }
    finally { setPosting(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"var(--bg-primary)" }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"var(--color-brand)", borderTopColor:"transparent" }}/>
    </div>
  );

  if (!post) return null;
  const typeConf = TYPE_CONFIG[post.type] || TYPE_CONFIG.thought;
  const isAuthor = user?._id === post.author?._id || user?.id === post.author?._id;

  return (
    <div className="min-h-screen" style={{ background:"var(--bg-primary)" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* Back */}
        <Link href="/explore" className="btn-ghost text-sm gap-1.5 mb-6 inline-flex">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Explore
        </Link>

        {/* Post type badge */}
        <span className="badge text-sm mb-4 inline-flex" style={{ color:typeConf.color, background:typeConf.color+"15" }}>
          {typeConf.emoji} {typeConf.label}
        </span>

        {/* Title */}
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
          style={{ color:"var(--text-primary)" }}>
          {post.title}
        </h1>

        {/* Author row */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b" style={{ borderColor:"var(--border-light)" }}>
          <Link href={`/profile/${post.author?.username}`} className="flex items-center gap-3 group">
            <img src={post.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name||"U")}&background=FF6B35&color=fff&size=80`}
              alt={post.author?.name} className="w-11 h-11 rounded-full object-cover"/>
            <div>
              <p className="font-semibold text-sm group-hover:text-orange-500 transition-colors" style={{ color:"var(--text-primary)" }}>
                {post.author?.name}
              </p>
              <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix:true })} · {post.readingTime||1} min read
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {!isAuthor && isLoggedIn && (
              <button onClick={handleFollow}
                className={following ? "btn-secondary text-sm px-4 py-2" : "btn-primary text-sm px-4 py-2"}>
                {following ? "Following" : "Follow"}
              </button>
            )}
            {isAuthor && (
              <Link href={`/write?edit=${post._id}`} className="btn-secondary text-sm px-4 py-2">
                Edit Post
              </Link>
            )}
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="w-full h-64 rounded-2xl overflow-hidden mb-8">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover"/>
          </div>
        )}

        {/* Content */}
        <div className="prose-content mb-10 leading-relaxed text-lg"
          style={{ color:"var(--text-secondary)", fontFamily:"var(--font-sans)" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-sm"
                style={{ background:"var(--bg-tertiary)", color:"var(--text-muted)" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Engagement bar */}
        <div className="flex items-center gap-6 py-5 border-y mb-10" style={{ borderColor:"var(--border-light)" }}>
          <button onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 ${liked?"":"opacity-70 hover:opacity-100"}`}
            style={{ color: liked ? "var(--color-brand)" : "var(--text-secondary)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked?"currentColor":"none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {likes} {likes === 1 ? "like" : "likes"}
          </button>
          <span className="flex items-center gap-2 text-sm" style={{ color:"var(--text-muted)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {comments.length} comments
          </span>
          <span className="flex items-center gap-2 text-sm ml-auto" style={{ color:"var(--text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            {post.views || 0} views
          </span>
        </div>

        {/* Comments section */}
        <div>
          <h2 className="font-display font-bold text-xl mb-6" style={{ color:"var(--text-primary)" }}>
            Comments ({comments.length})
          </h2>

          {/* Comment form */}
          {isLoggedIn ? (
            <form onSubmit={handleComment} className="flex gap-3 mb-8">
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||"U")}&background=FF6B35&color=fff&size=60`}
                alt={user?.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0"/>
              <div className="flex-1 flex gap-2">
                <input value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Share your thoughts…" className="input flex-1"/>
                <button type="submit" disabled={posting || !comment.trim()} className="btn-primary text-sm px-4 flex-shrink-0">
                  {posting ? "…" : "Post"}
                </button>
              </div>
            </form>
          ) : (
            <div className="card p-4 text-center mb-8">
              <p className="text-sm mb-3" style={{ color:"var(--text-muted)" }}>Sign in to join the conversation</p>
              <Link href="/auth/login" className="btn-primary text-sm px-6">Sign In</Link>
            </div>
          )}

          {/* Comment list */}
          <div className="space-y-5">
            {comments.map(c => (
              <div key={c._id} className="flex gap-3">
                <img src={c.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author?.name||"U")}&background=FF6B35&color=fff&size=60`}
                  alt={c.author?.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0"/>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>{c.author?.name}</span>
                    <span className="text-xs" style={{ color:"var(--text-muted)" }}>
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix:true })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color:"var(--text-secondary)" }}>{c.content}</p>

                  {/* Replies — OPTIONAL: remove this block if replies are not needed */}
                  {c.replies?.length > 0 && (
                    <div className="mt-3 ml-4 space-y-3 border-l-2 pl-4" style={{ borderColor:"var(--border-light)" }}>
                      {c.replies.map(r => (
                        <div key={r._id} className="flex gap-2">
                          <img src={r.author?.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(r.author?.name||"U")}&background=FF6B35&color=fff&size=40`}
                            alt={r.author?.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0"/>
                          <div>
                            <span className="font-medium text-xs mr-2" style={{ color:"var(--text-primary)" }}>{r.author?.name}</span>
                            <span className="text-xs leading-relaxed" style={{ color:"var(--text-secondary)" }}>{r.content}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-center py-8 text-sm" style={{ color:"var(--text-muted)" }}>
                Be the first to comment ✨
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
