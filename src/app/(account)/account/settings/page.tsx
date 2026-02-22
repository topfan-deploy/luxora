"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfileForm({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
      });

      // Fetch full profile with phone
      fetch("/api/account/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.phone) {
            setProfileForm((prev) => ({ ...prev, phone: data.data.phone }));
          }
        })
        .catch(() => {});
    }
  }, [session]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    if (!profileForm.name.trim()) {
      setProfileError("Name is required.");
      return;
    }

    setProfileSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name.trim(),
          phone: profileForm.phone.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      await updateSession({ name: profileForm.name.trim() });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      setPasswordError(
        "New password must contain at least one uppercase letter."
      );
      return;
    }
    if (!/[0-9]/.test(passwordForm.newPassword)) {
      setPasswordError("New password must contain at least one number.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl text-charcoal-100">
          Account Settings
        </h1>
        <p className="text-charcoal-400 font-body mt-1">
          Manage your profile information and security.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-charcoal-700">
          <User className="h-5 w-5 text-gold-400" />
          <h2 className="font-heading text-lg text-charcoal-100">
            Profile Information
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
          {profileError && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 font-body text-sm">{profileError}</p>
            </div>
          )}
          {profileSuccess && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
              <p className="text-green-300 font-body text-sm">
                Profile updated successfully.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <SettingsField
              label="Full Name"
              value={profileForm.name}
              onChange={(v) =>
                setProfileForm((prev) => ({ ...prev, name: v }))
              }
              required
            />

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-charcoal-200 mb-1.5 font-body">
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                readOnly
                className="w-full px-4 py-2.5 bg-charcoal-800/50 border border-charcoal-700 rounded-lg text-charcoal-400 font-body text-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-charcoal-500 font-body">
                Email cannot be changed.
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="max-w-sm">
            <SettingsField
              label="Phone Number"
              value={profileForm.phone}
              onChange={(v) =>
                setProfileForm((prev) => ({ ...prev, phone: v }))
              }
              type="tel"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gold-400 text-charcoal-950 font-body font-semibold rounded-lg hover:bg-gold-300 transition-colors text-sm disabled:opacity-70 disabled:cursor-wait"
            >
              {profileSaving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-charcoal-700">
          <Lock className="h-5 w-5 text-gold-400" />
          <h2 className="font-heading text-lg text-charcoal-100">
            Change Password
          </h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
          {passwordError && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 font-body text-sm">{passwordError}</p>
            </div>
          )}
          {passwordSuccess && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
              <p className="text-green-300 font-body text-sm">
                Password changed successfully.
              </p>
            </div>
          )}

          <div className="max-w-sm space-y-5">
            {/* Current Password */}
            <PasswordField
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(v) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: v,
                }))
              }
              show={showCurrentPassword}
              onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
              required
            />

            {/* New Password */}
            <PasswordField
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(v) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: v }))
              }
              show={showNewPassword}
              onToggle={() => setShowNewPassword(!showNewPassword)}
              required
              helperText="At least 8 characters, one uppercase letter, and one number."
            />

            {/* Confirm Password */}
            <PasswordField
              label="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(v) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: v,
                }))
              }
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gold-400 text-charcoal-950 font-body font-semibold rounded-lg hover:bg-gold-300 transition-colors text-sm disabled:opacity-70 disabled:cursor-wait"
            >
              {passwordSaving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingsField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal-200 mb-1.5 font-body">
        {label}
        {required && <span className="text-gold-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-charcoal-800 border border-charcoal-700 rounded-lg text-charcoal-100 placeholder-charcoal-500 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-colors"
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  required,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  required?: boolean;
  helperText?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal-200 mb-1.5 font-body">
        {label}
        {required && <span className="text-gold-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 pr-11 bg-charcoal-800 border border-charcoal-700 rounded-lg text-charcoal-100 placeholder-charcoal-500 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-200 transition-colors"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-charcoal-500 font-body">
          {helperText}
        </p>
      )}
    </div>
  );
}
