// ============================================================
// OpenUp - Notification Bell Component
// ============================================================

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { notificationsAPI } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const [open, setOpen]           = useState(false);
  const [notifications, setNotifs] = useState([]);
  const [unreadCount, setUnread]  = useState(0);
  const [loading, setLoading]     = useState(false);
  const ref = useRef(null);

  // Fetch unread count on mount and poll every 30s
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsAPI.getUnreadCount();
      setUnread(data.count);
    } catch {}
  };

  const handleOpen = async () => {
    setOpen((o) => !o);
    if (!open) {
      setLoading(true);
      try {
        const data = await notificationsAPI.getAll({ limit: 15 });
        setNotifs(data.notifications);
        setUnread(0);
        // Mark all as read
        await notificationsAPI.markAllRead().catch(() => {});
      } catch {} finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative btn-ghost p-2 rounded-lg"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            style={{ background: "var(--color-brand)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 card animate-slide-down overflow-hidden"
          style={{ zIndex: 100, maxHeight: "420px", overflowY: "auto" }}
        >
          <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: "var(--border-light)" }}>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Notifications</h3>
            {unreadCount === 0 && notifications.length > 0 && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>All caught up ✓</span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-brand)", borderTopColor: "transparent" }} />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>No notifications yet</p>
          ) : (
            <div>
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`flex items-start gap-3 px-4 py-3 border-b transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/10 ${!notif.isRead ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`}
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <img
                    src={notif.sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.sender?.name || "U")}&background=FF6B35&color=fff&size=40`}
                    alt={notif.sender?.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {notif.message}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: "var(--color-brand)" }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
