"use client";

import { useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  BrokerConnection,
  useBrokerConnectMutation,
  useBrokerConnectionsQuery
} from "../lib/dashboard";

const brokerFallbacks: BrokerConnection[] = [
  makeBroker("thinkorswim", "Thinkorswim", "Equities & Options", "thinkorswim"),
  makeBroker("tradovate", "Tradovate", "Futures Execution", "tradovate"),
  makeBroker("interactive-brokers", "Interactive Brokers", "Global Multi-Asset", "interactive-brokers"),
  makeBroker("tradingview", "TradingView", "Chart Integration", "tradingview"),
  makeBroker("ninjatrader", "NinjaTrader", "Desktop Terminal", "ninjatrader"),
  makeBroker("tastytrade", "Tastytrade", "High Probability Trading", "tastytrade"),
  makeBroker("robinhood", "Robinhood", "Simple Execution", "robinhood"),
  {
    ...makeBroker("next-gateway", "Next Gateway", "Community Requested", "next-gateway"),
    status: "coming_soon",
    statusLabel: "COMING SOON",
    actionLabel: "COMING SOON",
    isEnabled: false
  }
];

export default function ConnectPage() {
  const brokersQuery = useBrokerConnectionsQuery();
  const connectMutation = useBrokerConnectMutation();
  const [pendingBrokerId, setPendingBrokerId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const brokers = brokersQuery.data?.brokers?.length ? brokersQuery.data.brokers : brokerFallbacks;
  const isInitialLoading = brokersQuery.isLoading && !brokersQuery.data;

  async function handleBrokerAction(broker: BrokerConnection) {
    if (!broker.isEnabled || broker.status === "coming_soon") {
      setNotice(`${broker.displayName} integration is coming soon.`);
      return;
    }

    setNotice(null);
    setPendingBrokerId(broker.id);

    try {
      const result = await connectMutation.mutateAsync(broker.id);
      setNotice(result.message);

      if (result.action === "redirect" && result.url) {
        window.location.href = result.url;
        return;
      }

      if (result.action === "manage" && result.url) {
        window.open(resolveBackendUrl(result.url), "_blank", "noopener,noreferrer");
      }
    } catch {
      setNotice("Broker connection start kora jacche na. Login/session check kore abar try korun.");
    } finally {
      setPendingBrokerId(null);
    }
  }

  return (
    <AppShell>
      <section className="min-h-[calc(100vh-44px)] bg-[#f7f7fb] px-0 pb-6 pt-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-medium leading-tight tracking-normal text-[#101827]">
              Broker Gateway
            </h1>
            <p className="mt-2 max-w-[680px] text-[15px] leading-5 text-[#667085]">
              Establish secure, encrypted connections to your primary trading venues.
              <br />
              Professional grade API bridges ensure millisecond execution sync.
            </p>
          </div>

          {brokersQuery.data ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-600">
              {brokersQuery.data.connectedCount} connected
            </span>
          ) : null}
        </div>

        {notice ? (
          <div className="mb-4 rounded-[10px] border border-blue-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-700">
            {notice}
          </div>
        ) : null}

        {brokersQuery.isError ? (
          <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
            Broker API load hoy nai. Backend run ache kina and login token ache kina check korun.
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {brokers.slice(0, 6).map((broker) => (
            <BrokerCard
              broker={broker}
              isLoading={isInitialLoading}
              isPending={pendingBrokerId === broker.id}
              key={broker.id}
              onAction={handleBrokerAction}
            />
          ))}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {brokers.slice(6).map((broker) => (
            <BrokerCard
              broker={broker}
              isLoading={isInitialLoading}
              isPending={pendingBrokerId === broker.id}
              key={broker.id}
              onAction={handleBrokerAction}
            />
          ))}
        </div>

        <div className="mt-[34vh] flex min-h-[82px] items-center justify-between gap-5 rounded-[10px] border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-4">
            <span className="grid size-10 place-items-center rounded-[8px] border border-blue-200 bg-blue-50 text-xl text-blue-600">
              ♢
            </span>
            <div>
              <h2 className="text-[15px] font-medium text-[#101827]">Military-Grade Encryption</h2>
              <p className="mt-1 text-[12px] leading-5 text-[#667085]">
                Your broker credentials never touch our servers. We use localized API proxies and OAuth 2.0 tunneling to ensure only your local terminal can execute trades.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 gap-3">
            <span className="grid min-h-[52px] min-w-[72px] place-items-center rounded-[8px] border border-blue-200 bg-blue-50 px-3 text-center text-sm font-medium text-blue-600">
              AES-256
              <small className="block text-[10px] font-normal text-blue-500">Encryption</small>
            </span>
            <span className="grid min-h-[52px] min-w-[78px] place-items-center rounded-[8px] border border-teal-200 bg-teal-50 px-3 text-center text-sm font-medium text-teal-600">
              TLS 1.3
              <small className="block text-[10px] font-normal text-teal-500">Transport</small>
            </span>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function BrokerCard({
  broker,
  isLoading,
  isPending,
  onAction
}: {
  broker: BrokerConnection;
  isLoading: boolean;
  isPending: boolean;
  onAction: (broker: BrokerConnection) => void;
}) {
  const logo = getBrokerLogo(broker);
  const isDisabled = !broker.isEnabled || broker.status === "coming_soon" || isPending || isLoading;

  return (
    <article
      className={
        !broker.isEnabled || broker.status === "coming_soon"
          ? "flex min-h-[174px] flex-col rounded-[10px] border border-slate-200 bg-white/45 p-4 opacity-70 shadow-[0_3px_10px_rgba(15,23,42,0.04)]"
          : "flex min-h-[174px] flex-col rounded-[10px] border border-slate-200 bg-white p-4 shadow-[0_3px_10px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)]"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid size-8 place-items-center overflow-hidden text-[18px] font-black leading-none ${logo.className}`}
        >
          {logo.text}
        </span>
        <span className={getStatusClassName(broker.status)}>
          • {isPending ? "WAITING FOR AUTH" : broker.statusLabel}
        </span>
      </div>

      <div className="mt-3">
        <h2 className="text-[15px] font-medium text-[#101827]">
          {isLoading ? <span className="block h-4 w-28 animate-pulse rounded bg-slate-200" /> : broker.displayName}
        </h2>
        <p className="mt-0.5 text-[12px] text-[#667085]">
          {isLoading ? <span className="block h-3 w-32 animate-pulse rounded bg-slate-100" /> : broker.subtitle}
        </p>
      </div>

      <button
        className="mt-auto h-7 rounded-[6px] border border-slate-300 bg-slate-50 px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 transition enabled:hover:border-emerald-300 enabled:hover:bg-emerald-50 enabled:hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isDisabled}
        onClick={() => onAction(broker)}
        type="button"
      >
        {isPending ? "WAITING FOR AUTH..." : broker.actionLabel}
      </button>
    </article>
  );
}

function makeBroker(
  id: string,
  displayName: string,
  subtitle: string,
  logoKey: string
): BrokerConnection {
  return {
    id,
    broker: id,
    displayName,
    subtitle,
    logoKey,
    status: "not_connected",
    statusLabel: "NOT CONNECTED",
    actionLabel: "CONNECT",
    isEnabled: true,
    connectUrl: null,
    manageUrl: null
  };
}

function getBrokerLogo(broker: BrokerConnection) {
  const key = broker.logoKey || broker.broker || broker.id;

  if (key.includes("thinkorswim")) {
    return { text: "✳", className: "text-sky-500" };
  }

  if (key.includes("tradovate") || key.includes("tastytrade") || key.includes("next")) {
    return { text: "▣", className: key.includes("next") ? "bg-blue-300 text-white" : "bg-blue-600 text-white" };
  }

  if (key.includes("interactive")) {
    return { text: "◖", className: "text-red-600" };
  }

  if (key.includes("tradingview")) {
    return { text: "TV", className: "text-black" };
  }

  if (key.includes("ninjatrader")) {
    return { text: "NT", className: "bg-black text-white" };
  }

  if (key.includes("robinhood")) {
    return { text: "Robinhood", className: "bg-lime-300 text-[6px] text-lime-950" };
  }

  return { text: broker.displayName.slice(0, 2).toUpperCase(), className: "bg-slate-100 text-slate-700" };
}

function getStatusClassName(status: BrokerConnection["status"]) {
  if (status === "connected") {
    return "rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-emerald-600";
  }

  if (status === "coming_soon") {
    return "rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400";
  }

  return "rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-500";
}

function resolveBackendUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";
  return `${baseUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}
