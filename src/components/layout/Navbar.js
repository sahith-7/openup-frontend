// ============================================================
// OpenUp - Navbar Component
// ============================================================
// Top navigation bar with logo, links, auth state, dark mode
// To add new nav links: add items to the NAV_LINKS array
// To remove dark mode toggle: remove the ThemeToggle block
// ============================================================

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Logo from "@/components/ui/Logo";
import NotificationBell from "@/components/ui/NotificationBell";

// ============================================================
// Navigation Links
// ADD or REMOVE nav items here
// ============================================================
const NAV_LINKS = [
  { href: "/feed",    label: "Feed" },
  { href: "/explore", label: "Explore" },
  // { href: "/community", label: "Community" },  // OPTIONAL: Add when ready
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Detect scroll to add backdrop blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-md border-b"
          : "bg-transparent"
      }`}
      style={{
        borderColor: scrolled ? "var(--border-light)" : "transparent",
        height: "var(--navbar-height)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* -------------------------------------------------------- */}
        {/* Logo */}
        {/* -------------------------------------------------------- */}
        <Link href={isLoggedIn ? "/feed" : "/"} className="flex-shrink-0">
          <Logo size="sm" />
        </Link>

        {/* -------------------------------------------------------- */}
        {/* Desktop Nav Links */}
        {/* -------------------------------------------------------- */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "text-brand-orange bg-brand-orange/10"
                  : "text-secondary hover:text-brand-orange hover:bg-brand-orange/5"
              }`}
              style={{ color: pathname === link.href ? "var(--color-brand)" : "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* -------------------------------------------------------- */}
        {/* Right Side — Auth / User Controls */}
        {/* -------------------------------------------------------- */}
        <div className="flex items-center gap-2">

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {isLoggedIn ? (
            <>
              {/* Write Button */}
              <Link href="/write" className="hidden sm:flex btn-primary text-sm px-4 py-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Write
              </Link>

              {/* Notifications */}
              <NotificationBell />

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 p-1 rounded-full transition-all duration-200 hover:ring-2"
                  style={{ "--tw-ring-color": "var(--color-brand)" }}
                >
                  {/* Avatar */}
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=FF6B35&color=fff&size=80`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 card py-1 animate-slide-down"
                    style={{ zIndex: 100 }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-light)" }}>
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
                        {user?.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        @{user?.username}
                      </p>
                    </div>

                    {/* Menu items — ADD new items here */}
                    {[
                      { href: `/profile/${user?.username}`, label: "My Profile", icon: "👤" },
                      { href: "/write",                     label: "Write",       icon: "✍️" },
                      { href: "/feed",                      label: "My Feed",     icon: "📰" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/20"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <div className="divider my-1" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <span>🚪</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Not logged in — show auth buttons */
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="btn-ghost text-sm px-4 py-2">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* -------------------------------------------------------- */}
      {/* Mobile Menu */}
      {/* -------------------------------------------------------- */}
      {menuOpen && (
        <div
          className="md:hidden glass border-t px-4 py-4 flex flex-col gap-2 animate-slide-down"
          style={{ borderColor: "var(--border-light)" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              href="/write"
              onClick={() => setMenuOpen(false)}
              className="btn-primary justify-center mt-2"
            >
              ✍️ Write
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

// ============================================================
// Dark Mode Toggle — OPTIONAL: Remove this component if not needed
// ============================================================
function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("openup_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("openup_theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="btn-ghost p-2 rounded-lg"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light Mode" : "Dark Mode"}
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
