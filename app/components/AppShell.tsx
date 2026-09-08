import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", icon: "▦", href: "/home", active: true },
  { label: "Connect", icon: "∞", href: "/home" },
  { label: "Setting", icon: "⚙", href: "/home" },
  { label: "Subscription", icon: "♛", href: "/home" }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo" aria-hidden="true">
          <span className="candle candle-red" />
          <span className="candle candle-yellow" />
          <span className="candle candle-green" />
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className={item.active ? "nav-item nav-item-active" : "nav-item"}
              href={item.href}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/login" className="logout-link">
          <span aria-hidden="true">↪</span>
          Logout
        </Link>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="profile-chip">
            <span>
              <strong>john doe</strong>
              <small>Premium User</small>
            </span>
            <span className="avatar">JD</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
