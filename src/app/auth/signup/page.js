// ============================================================
// OpenUp - Signup Page
// ============================================================
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import Logo from "@/components/ui/Logo";

// Form fields config — ADD or REMOVE fields here
const FIELDS = [
  { name:"name",     label:"Full Name",     type:"text",     placeholder:"Your full name",     required:true  },
  { name:"email",    label:"Email address", type:"email",    placeholder:"you@example.com",    required:true  },
  { name:"phone",    label:"Phone (optional)",type:"tel",    placeholder:"+1 234 567 8900",    required:false },
  { name:"password", label:"Password",      type:"password", placeholder:"Min. 8 characters",  required:true  },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuthStore();
  const [form, setForm]   = useState({ name:"", email:"", phone:"", password:"" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created! Welcome to OpenUp 🎉");
      router.replace("/feed");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)" }}>
        <Logo size="md" showText className="relative z-10" />
        <div className="relative z-10 space-y-4">
          {["Share stories that move people","Build an audience of real readers","Grow with an AI writing companion"].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</span>
              <span className="text-white font-medium">{text}</span>
            </div>
          ))}
        </div>
        <p className="text-white/60 text-sm relative z-10">Free forever. No credit card required.</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8"><Logo size="md" /></div>
          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "var(--text-primary)" }}>Create your account</h1>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Already have one?{" "}
            <Link href="/auth/login" className="font-semibold" style={{ color: "var(--color-brand)" }}>Sign in</Link>
          </p>

          <form onSubmit={submit} className="space-y-4">
            {FIELDS.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{field.label}</label>
                <input name={field.name} type={field.type} value={form[field.name]} onChange={handle}
                  placeholder={field.placeholder} className="input" required={field.required} />
              </div>
            ))}

            <p className="text-xs pt-1" style={{ color: "var(--text-muted)" }}>
              By signing up you agree to our{" "}
              <Link href="/terms" className="underline">Terms</Link> and{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Creating account…</span> : "Create Account →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
