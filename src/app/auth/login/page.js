// ============================================================
// OpenUp - Login Page
// ============================================================
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 👋");
      router.replace("/feed");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Decorative left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FF6B35 0%, #FF8C61 60%, #FFB085 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white opacity-10 blur-3xl" />
        </div>
        <Logo size="md" showText className="relative z-10" />
        <div className="relative z-10">
          <blockquote className="text-white text-2xl font-display font-bold leading-snug mb-4">
            "The world needs your words.<br/>Stop waiting for the perfect moment."
          </blockquote>
          <p className="text-white/70 text-sm">— The OpenUp community</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8"><Logo size="md" /></div>
          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "var(--text-primary)" }}>Welcome back</h1>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            New here?{" "}
            <Link href="/auth/signup" className="font-semibold" style={{ color: "var(--color-brand)" }}>Create an account</Link>
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email address</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" className="input" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-medium" style={{ color: "var(--color-brand)" }}>Forgot?</Link>
              </div>
              <div className="relative">
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handle}
                  placeholder="••••••••" className="input pr-11" required />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPass ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                     : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                  </svg>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Signing in…</span> : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 divider"/><span className="text-xs" style={{ color:"var(--text-muted)" }}>or</span><hr className="flex-1 divider"/>
          </div>
          <Link href="/explore" className="btn-secondary w-full justify-center py-3 text-sm">Browse without signing in</Link>
        </div>
      </div>
    </div>
  );
}
