// ============================================================
// OpenUp - Settings / Profile Edit Page
// ============================================================
// Users can edit their name, bio, website, location here.
// To add new fields: add them to the FIELDS array and
// include them in the form state.
// ============================================================
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import useAuthStore from "@/store/authStore";
import { authAPI } from "@/lib/api";

// ============================================================
// Field Config — ADD new profile fields here
// ============================================================
const PROFILE_FIELDS = [
  { name: "name",     label: "Display Name",    type: "text",     placeholder: "Your full name",             required: true  },
  { name: "bio",      label: "Bio",             type: "textarea", placeholder: "Tell readers about yourself…", required: false },
  { name: "website",  label: "Website",         type: "url",      placeholder: "https://yoursite.com",       required: false },
  { name: "location", label: "Location",        type: "text",     placeholder: "City, Country",              required: false },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, updateUser } = useAuthStore();

  const [form,     setForm]    = useState({ name:"", bio:"", website:"", location:"" });
  const [saving,   setSaving]  = useState(false);
  const [tab,      setTab]     = useState("profile"); // "profile" | "password"
  const [passwords, setPasswords] = useState({ current:"", next:"", confirm:"" });

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/auth/login");
  }, [isLoggedIn, isLoading, router]);

  // Populate form from stored user
  useEffect(() => {
    if (user) {
      setForm({
        name:     user.name     || "",
        bio:      user.bio      || "",
        website:  user.website  || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const data = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success("Profile updated ✓");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.next.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      toast.success("Password changed ✓");
      setPasswords({ current:"", next:"", confirm:"" });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="font-display font-bold text-3xl mb-8" style={{ color: "var(--text-primary)" }}>
          Settings
        </h1>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 border-b pb-4" style={{ borderColor: "var(--border-light)" }}>
          {[
            { key: "profile",  label: "Profile" },
            { key: "password", label: "Password" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? "text-white" : ""
              }`}
              style={tab === t.key
                ? { background: "var(--color-brand)" }
                : { color: "var(--text-muted)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ====================================================== */}
        {/* Profile Tab */}
        {/* ====================================================== */}
        {tab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-5">

            {/* Avatar preview */}
            <div className="flex items-center gap-4 card p-5 mb-2">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF6B35&color=fff&size=160`}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Profile Photo</p>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                  Avatar is auto-generated from your name. To set a custom avatar, add a Cloudinary URL below.
                </p>
                {/* OPTIONAL: Add Cloudinary upload here */}
                <input
                  type="url"
                  placeholder="https://image-url.com/avatar.jpg"
                  value={user.avatar || ""}
                  onChange={(e) => updateUser({ avatar: e.target.value })}
                  className="input text-xs py-2"
                />
              </div>
            </div>

            {/* Dynamic fields */}
            {PROFILE_FIELDS.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={3}
                    maxLength={300}
                    className="input resize-none"
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="input"
                    required={field.required}
                  />
                )}
              </div>
            ))}

            {/* Read-only fields */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Username <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>(cannot be changed)</span>
              </label>
              <input value={`@${user.username}`} disabled className="input opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Email <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>(contact support to change)</span>
              </label>
              <input value={user.email} disabled className="input opacity-60 cursor-not-allowed" />
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full py-3 justify-center">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}

        {/* ====================================================== */}
        {/* Password Tab */}
        {/* ====================================================== */}
        {tab === "password" && (
          <form onSubmit={handleChangePassword} className="space-y-5">
            {[
              { key: "current", label: "Current Password", placeholder: "Your current password" },
              { key: "next",    label: "New Password",     placeholder: "Min. 8 characters" },
              { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  {f.label}
                </label>
                <input
                  type="password"
                  value={passwords[f.key]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="input"
                  required
                />
              </div>
            ))}
            <button type="submit" disabled={saving} className="btn-primary w-full py-3 justify-center">
              {saving ? "Changing…" : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
