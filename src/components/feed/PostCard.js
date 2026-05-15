// ============================================================
// OpenUp - Post Card Component
// ============================================================
// Displays a post preview in the feed/explore
// Props: post object, showAuthor, compact
// ============================================================

"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { postsAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

// ============================================================
// Post Type Config
// ADD new post types here with their colors and emoji
// ============================================================
const POST_TYPE_CONFIG = {
  story:   { label: "Story",   color: "#6366f1", bg: "rgba(99,102,241,0.1)",  emoji: "📖" },
  poem:    { label: "Poem",    color: "#ec4899", bg: "rgba(236,72,153,0.1)",  emoji: "🌸" },
  quote:   { label: "Quote",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)", emoji: "💬" },
  thought: { label: "Thought", color: "#10b981", bg: "rgba(16,185,129,0.1)", emoji: "💭" },
};

export default function PostCard({ post, showAuthor = true, compact = false, onDelete }) {
  const { isLoggedIn, user } = useAuthStore();
  const [liked, setLiked]       = useState(post.likes?.includes?.(post._id) || false);
  const [likesCount, setLikes]  = useState(post.likesCount || post.likes?.length || 0);
  const [liking, setLiking]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?._id === post.author?._id || user?.id === post.author?._id;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    try {
      await postsAPI.delete(post._id);
      toast.success("Post deleted!");
      if (onDelete) onDelete(post._id);
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const typeConfig = POST_TYPE_CONFIG[post.type] || POST_TYPE_CONFIG.thought;

  // Handle like toggle
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Sign in to like posts");
      return;
    }

    if (liking) return;
    setLiking(true);

    // Optimistic update
    setLiked((l) => !l);
    setLikes((c) => (liked ? c - 1 : c + 1));

    try {
      const data = await postsAPI.toggleLike(post._id);
      setLiked(data.liked);
      setLikes(data.likesCount);
    } catch {
      // Revert on error
      setLiked((l) => !l);
      setLikes((c) => (liked ? c + 1 : c - 1));
    } finally {
      setLiking(false);
    }
  };

  return (
    <Link href={`/post/${post._id}`} className="block">
      <article
        className={`card card-interactive group ${compact ? "p-4" : "p-5 sm:p-6"}`}
      >
        {/* -------------------------------------------------------- */}
        {/* Card Header */}
        {/* -------------------------------------------------------- */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Author info */}
          {showAuthor && (
            <Link
              href={`/profile/${post.author?.username}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 group/author"
            >
              <img
                src={post.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "U")}&background=FF6B35&color=fff&size=60`}
                alt={post.author?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p
                  className="text-sm font-semibold leading-none group-hover/author:text-brand-orange transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {post.author?.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  @{post.author?.username}
                </p>
              </div>
            </Link>
          )}

          {/* Post type badge */}
          <span
            className="badge text-xs flex-shrink-0"
            style={{ color: typeConfig.color, background: typeConfig.bg }}
          >
            {typeConfig.emoji} {typeConfig.label}
          </span>
        </div>

        {/* -------------------------------------------------------- */}
        {/* Cover Image — OPTIONAL: Remove this block if not using images */}
        {/* -------------------------------------------------------- */}
        {post.coverImage && !compact && (
          <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* Content */}
        {/* -------------------------------------------------------- */}
        <h2
          className={`font-display font-bold leading-snug mb-2 group-hover:text-brand-orange transition-colors ${
            compact ? "text-base" : "text-lg sm:text-xl"
          }`}
          style={{ color: "var(--text-primary)" }}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            className={`leading-relaxed mb-4 line-clamp-3 ${compact ? "text-xs" : "text-sm"}`}
            style={{ color: "var(--text-secondary)" }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Tags — OPTIONAL: Remove this block if tags are not needed */}
        {post.tags?.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: "var(--bg-tertiary)",
                  color: "var(--text-muted)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* Footer — Stats */}
        {/* -------------------------------------------------------- */}
        <div
          className="flex items-center justify-between pt-3 border-t"
          style={{ borderColor: "var(--border-light)" }}
        >
          {/* Left: meta */}
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            {/* Reading time */}
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {post.readingTime || 1} min
            </span>

            {/* Date */}
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          </div>

          {/* Right: engagement */}
          <div className="flex items-center gap-3">
            {/* Views */}
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {post.views || 0}
            </span>

            {/* Comments */}
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {post.commentCount || 0}
            </span>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-all duration-200 hover:scale-110 ${liked ? "scale-110" : ""}`}
              style={{ color: liked ? "var(--color-brand)" : "var(--text-muted)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {likesCount}
            </button>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--border-light)" }}>
            <Link
              href={`/write?edit=${post._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
            >
              ✏️ Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
            >
              {deleting ? "Deleting…" : "🗑️ Delete"}
            </button>
          </div>
        )}
      </article>
    </Link>
  );
}