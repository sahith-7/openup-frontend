// ============================================================
// OpenUp - Forgot Password Page
// ============================================================
"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import Logo from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        {sent ? (
          <div className="card p-8 text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="font-display font-bold text-2xl mb-3" style={{ color: "var(--text-primary)" }}>
              Check your email
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              If an account exists for <strong>{email}</strong>, we've sent a password reset link.
            </p>
            <Link href="/auth/login" className="btn-primary justify-center w-full">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="card p-8">
            <h1 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>
              Forgot your password?
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              No worries. Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 justify-center">
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending…
                    </span>
                  : "Send Reset Link"}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link href="/auth/login" className="text-sm" style={{ color: "var(--text-muted)" }}>
                ← Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
