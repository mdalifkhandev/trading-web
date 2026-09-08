import Link from "next/link";
import { AppShell } from "../components/AppShell";

const brokers = [
  { name: "Tradovate", subtitle: "Futures Execution", status: "CONNECTED" },
  { name: "Interactive Brokers", subtitle: "Global Multi-Asset", status: "CONNECTED" },
  { name: "TradingView", subtitle: "Chart Integration", status: "DISCONNECTED" }
];

const restrictionItems = [
  ["Daily Trade Limit", "5 trades"],
  ["Max Position Size", "$10,000"],
  ["Instruments", "Single/Stocks"],
  ["Risk Level", "Unknown"]
];

const accountItems = [
  { label: "Change Password", icon: "▣", extra: "›" },
  { label: "Two-Factor Authentication", icon: "⬟", extra: "ACTIVE" },
  { label: "Device Management", icon: "▰", extra: "›" },
  { label: "Login Sessions", icon: "◴", extra: "›" }
];

const systemInfo = [
  ["OS", "Windows 11 (Premium Workstation)"],
  ["Version", "V12.0-stable"],
  ["Last Login", "Today, 08:22 AM"],
  ["Account Type", "Professional Trader (Active)"]
];

export default function SettingPage() {
  return (
    <AppShell>
      <section className="min-h-[calc(100vh-44px)] bg-[#f7f7fb] pb-6 pt-5">
        <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="grid content-start gap-[60px]">
            <ProfileCard />
            <SubscriptionCard />
          </aside>

          <div className="grid gap-4">
            <BrokerConnections />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
              <ActiveRestrictions />
              <AccountSettings />
            </div>
          </div>
        </div>

        <SystemInformation />
        <DangerZone />
      </section>
    </AppShell>
  );
}

function ProfileCard() {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <div className="flex gap-4">
        <span className="grid size-[50px] shrink-0 place-items-center rounded-full bg-[#2f65ed] text-xl text-white">
          ◒
        </span>
        <div>
          <h2 className="text-[15px] font-medium text-slate-950">john doe</h2>
          <p className="text-[12px] text-slate-500">tester1@yopmail.com</p>
          <span className="mt-2 inline-flex rounded-full border border-orange-300 px-2 py-0.5 text-[9px] font-semibold text-orange-500">
            STARTER
          </span>
        </div>
      </div>
      <div className="my-4 border-t border-dashed border-slate-600" />
      <dl className="grid gap-3 text-xs">
        <div className="flex justify-between gap-4">
          <dt className="font-bold text-slate-900">Member Since</dt>
          <dd>2026-09-08</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-bold text-slate-900">Role</dt>
          <dd>Trader</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-bold text-slate-900">Status</dt>
          <dd>Active</dd>
        </div>
      </dl>
    </article>
  );
}

function SubscriptionCard() {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] uppercase text-slate-700">Subscription</p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-slate-950">Premium Plan</h2>
          <p className="text-sm text-slate-900">
            <span className="text-[#00c773]">$29.00</span> / monthly
          </p>
          <p className="text-xs font-semibold text-slate-900">Days left</p>
        </div>
        <span className="text-3xl text-yellow-400">♕</span>
      </div>
      <dl className="mt-9 grid gap-3 text-xs">
        <div className="flex justify-between">
          <dt className="font-bold">Started</dt>
          <dd>Aug 01, 2024</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-bold">Expires</dt>
          <dd>July 01, 2026</dd>
        </div>
      </dl>
      <button className="mt-3 h-8 w-full rounded-[8px] border border-blue-200 text-xs font-medium tracking-wide text-blue-600" type="button">
        UPGRADE
      </button>
      <button className="mt-2 h-8 w-full rounded-[8px] border border-red-200 text-xs font-medium tracking-wide text-red-500" type="button">
        CANCEL
      </button>
    </article>
  );
}

function BrokerConnections() {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-slate-950">Broker Connections</h2>
        <Link className="text-xs font-medium text-blue-600" href="/connect">
          Manage Connections
        </Link>
      </div>
      <div className="grid gap-2">
        {brokers.map((broker) => (
          <div className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-3 shadow-sm" key={broker.name}>
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-blue-50 text-blue-600">▥</span>
              <span>
                <strong className="block text-sm font-medium text-slate-900">{broker.name}</strong>
                <small className="block text-xs text-slate-500">{broker.subtitle}</small>
              </span>
            </div>
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${broker.status === "CONNECTED" ? "border-slate-300 text-[#00a852]" : "border-slate-300 text-slate-400"}`}>
              ● {broker.status}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function ActiveRestrictions() {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-slate-950">Active Restrictions</h2>
        <span className="rounded-full border border-slate-300 px-3 py-0.5 text-[9px] font-bold text-[#00a852]">
          STATUS: ACTIVE
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {restrictionItems.map(([label, value]) => (
          <div className="rounded-[8px] border border-slate-200 bg-white p-3 shadow-sm" key={label}>
            <p className="text-[11px] text-slate-500">{label}</p>
            <strong className="mt-1 block text-sm font-medium text-black">{value}</strong>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-[7px] border border-orange-300 bg-orange-100 px-3 py-3 text-sm text-red-500">
        ⚠ Trade limit reached. Account locked
      </div>
    </article>
  );
}

function AccountSettings() {
  return (
    <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <h2 className="mb-3 text-xl font-medium text-slate-950">Account settings</h2>
      <div className="grid gap-1.5">
        {accountItems.map((item) => (
          <button className="flex min-h-10 items-center justify-between rounded-[8px] bg-white px-3 text-left text-sm shadow-[0_4px_12px_rgba(15,23,42,0.08)]" type="button" key={item.label}>
            <span className="flex items-center gap-3">
              <span className="text-slate-500">{item.icon}</span>
              {item.label}
            </span>
            <span className={item.extra === "ACTIVE" ? "rounded-full border border-slate-300 px-2 py-0.5 text-[9px] font-bold text-[#00a852]" : "text-xl text-slate-500"}>
              {item.extra}
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}

function SystemInformation() {
  return (
    <article className="mt-4 rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <h2 className="text-[15px] font-medium text-slate-950">System Information</h2>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {systemInfo.map(([label, value]) => (
          <div className="rounded-[7px] border border-slate-200 bg-[#f7f7fb] px-3 py-3" key={label}>
            <p className="text-[11px] text-slate-400">{label}</p>
            <strong className="mt-1 block text-sm font-medium text-slate-900">{value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function DangerZone() {
  return (
    <article className="mt-4 rounded-[8px] bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <h2 className="text-sm font-bold text-red-500">⚠ Danger Zone</h2>
      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <button className="min-h-[60px] rounded-[7px] border border-orange-200 bg-orange-50 px-4 text-left" type="button">
          <strong className="block text-sm font-medium text-orange-500">⊘ Reset All Restrictions</strong>
          <span className="text-xs text-slate-500">Align all active locks & trade limits. Action can't be undone.</span>
        </button>
        <button className="min-h-[60px] rounded-[7px] border border-red-200 bg-red-50 px-4 text-left" type="button">
          <strong className="block text-sm font-medium text-red-500">▣ Delete Account</strong>
          <span className="text-xs text-slate-500">Permanently removes profile and all trading history.</span>
        </button>
        <button className="min-h-[60px] rounded-[7px] border border-blue-200 bg-blue-50 px-4 text-left" type="button">
          <strong className="block text-sm font-medium text-blue-600">↪ Logout</strong>
          <span className="text-xs text-slate-500">Disconnects all sessions and returns to login screen.</span>
        </button>
      </div>
    </article>
  );
}
