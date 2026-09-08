"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/auth-store";

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
          <div className="flex items-center gap-2">
            <span className="text-right leading-tight">
              <strong className="block text-sm font-medium text-neutral-900">john doe</strong>
              <small className="block text-xs text-neutral-500">Premium User</small>
            </span>
            <span className="grid size-9 place-items-center rounded-full border border-neutral-400 bg-[linear-gradient(135deg,#f1d0bd,#374151)] text-xs font-bold text-white">
              JD
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
