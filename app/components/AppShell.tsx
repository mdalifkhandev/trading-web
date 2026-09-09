"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, FormEvent } from "react";
import { useState } from "react";
import { useAuthStore } from "../store/auth-store";
import { useSettingsQuery } from "../lib/settings";
import { useUpdateProfileMutation, getErrorMessage } from "../lib/auth";

const navItems = [
  { label: "Dashboard", icon: "▦", href: "/home" },
  { label: "Connect", icon: "∞", href: "/connect" },
  { label: "Setting", icon: "⚙", href: "/setting" },
  { label: "Subscription", icon: "♛", href: "/subscription" }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#f5f7f9] lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="sticky top-0 flex h-auto flex-col border-r border-slate-100 bg-white px-3 py-3 text-[#222] shadow-[8px_0_24px_rgba(15,23,42,0.03)] lg:h-screen">
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-2">
 
          <span className="text-sm font-bold tracking-tight text-slate-900">TradeLMT</span>
        </div>

        <nav className="grid gap-2.5" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className={
                pathname === item.href
                  ? "group relative flex min-h-[44px] items-center gap-2.5 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-3 text-xs font-semibold text-[#10c66f] shadow-[0_8px_18px_rgba(16,198,111,0.12)] outline-none ring-1 ring-emerald-100 transition focus-visible:ring-2 focus-visible:ring-[#10c66f]"
                  : "group relative flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 text-xs font-semibold text-neutral-500 outline-none transition hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-[#10c66f]"
              }
              href={item.href}
            >
              {pathname === item.href ? (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#10c66f]" />
              ) : null}
              <span
                className={
                  pathname === item.href
                    ? "grid size-7 place-items-center rounded-lg bg-[#10c66f] text-base text-white"
                    : "grid size-7 place-items-center rounded-lg bg-slate-100 text-base text-neutral-500 transition group-hover:bg-white group-hover:text-slate-900"
                }
                aria-hidden="true"
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-slate-100 bg-slate-50 p-2">
          <p className="mb-2 px-1 text-[11px] text-slate-400">Session</p>
          <Link
            href="/login"
            onClick={logout}
            className="flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-slate-900 outline-none transition hover:bg-white hover:text-[#10c66f] focus-visible:ring-2 focus-visible:ring-[#10c66f]"
          >
            <span className="grid size-6 place-items-center rounded-md bg-white text-sm" aria-hidden="true">
              ↪
            </span>
          Logout
          </Link>
        </div>
      </aside>

      <main className="min-w-0 px-4 pb-8 pt-0 lg:px-8">
        <header className="flex h-11 items-center justify-end">
          <ProfileHeader />
        </header>
        {children}
      </main>
    </div>
  );
}

function ProfileHeader() {
  const { data: settings } = useSettingsQuery();
  const updateProfile = useUpdateProfileMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", email: "" });

  const user = settings?.user;
  const name = user?.name || "Unknown User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const role = user?.subscription ? `${user.subscription.replaceAll("_", " ")} User` : "User";

  function openModal() {
    setFormData({ name: user?.name || "", email: user?.email || "" });
    setIsEditing(false);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    try {
      await updateProfile.mutateAsync({ name: formData.name });
      setIsEditing(false);
      window.alert("Profile updated successfully!");
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  }

  return (
    <>
      <button 
        onClick={openModal}
        className="flex items-center gap-2 rounded-lg outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#10c66f]"
      >
        <span className="text-right leading-tight text-left">
          <strong className="block text-sm font-medium text-neutral-900">{name}</strong>
          <small className="block text-xs text-neutral-500 capitalize">{role}</small>
        </span>
        {user?.avatar ? (
          <img src={user.avatar} alt={name} className="size-9 rounded-full object-cover border border-neutral-300" />
        ) : (
          <span className="grid size-9 place-items-center rounded-full border border-neutral-400 bg-[linear-gradient(135deg,#f1d0bd,#374151)] text-xs font-bold text-white">
            {initials}
          </span>
        )}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold">Your Profile</h3>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  readOnly={!isEditing}
                  className={`w-full rounded-[6px] border border-slate-200 px-3 py-2 text-sm outline-none transition ${isEditing ? "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" : "bg-slate-50 text-slate-500 cursor-not-allowed"}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email (Cannot be changed)</label>
                <input
                  type="email"
                  readOnly
                  className="w-full rounded-[6px] border border-slate-200 px-3 py-2 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed"
                  value={formData.email}
                />
              </div>
              
              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-[6px] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="rounded-[6px] bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70 min-w-[80px]"
                >
                  {updateProfile.isPending ? "Saving..." : isEditing ? "Update" : "Edit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
