"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  useBrokerConnectionsQuery,
  useJournalQuery,
  useJournalSummaryQuery,
  useJournalSyncMutation,
  useLockoutStatusQuery,
  useManualLockoutMutation,
  useSaveTradeLimitMutation,
  useTradeLimitQuery,
  useWeeklyLockoutMutation
} from "../lib/dashboard";

const platforms = [
  { name: "Thinkorswim", logo: "✳", tone: "text-sky-500" },
  { name: "Tradovate", logo: "▣", tone: "text-blue-600" },
  { name: "TradingView", logo: "TV", tone: "text-black" },
  { name: "Robinhood", logo: "RH", tone: "text-lime-500" },
  { name: "NinjaTrader", logo: "NT", tone: "text-black" },
  { name: "Interactive", logo: "▰", tone: "text-red-600" }
];

const durations = ["1 H", "2 H", "4 H", "8 H", "12 H", "24 H"];

export default function HomePage() {
  const tradeLimitQuery = useTradeLimitQuery();
  const lockoutQuery = useLockoutStatusQuery();
  const brokersQuery = useBrokerConnectionsQuery();
  const journalQuery = useJournalQuery();
  const journalSummaryQuery = useJournalSummaryQuery();
  const syncMutation = useJournalSyncMutation();
  const saveTradeLimitMutation = useSaveTradeLimitMutation();
  const manualLockoutMutation = useManualLockoutMutation();
  const weeklyLockoutMutation = useWeeklyLockoutMutation();
  const [selectedDailyLimit, setSelectedDailyLimit] = useState(2);
  const [selectedLockoutHours, setSelectedLockoutHours] = useState(4);
  const [manualLockoutHours, setManualLockoutHours] = useState<4 | 8 | 12 | 24>(4);
  const [weeklyLimit, setWeeklyLimit] = useState(2);
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
    .format(new Date())
    .replaceAll(" ", "")
    .toUpperCase();
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(new Date());

  const dailyLimit = tradeLimitQuery.data?.tradeLimit?.dailyLimit ?? 2;
  const remainingTrades = tradeLimitQuery.data?.remainingTrades ?? dailyLimit;
  const usedTrades = Math.max(dailyLimit - remainingTrades, 0);
  const progressPercent = dailyLimit ? Math.round((usedTrades / dailyLimit) * 100) : 0;
  const connectedPlatforms = brokersQuery.data?.connectedCount ?? 0;
  const platformList =
    brokersQuery.data?.brokers.map((broker) => ({
      name: broker.displayName,
      logo: broker.displayName.slice(0, 2).toUpperCase(),
      tone:
        broker.status === "connected"
          ? "text-emerald-600"
          : broker.status === "coming_soon"
            ? "text-slate-400"
            : "text-slate-900"
    })) ?? platforms;
  const journalTrades = journalQuery.data?.trades ?? [];
  const summary = journalSummaryQuery.data;
  const visibleJournalRows = journalTrades.slice(0, 4).map((trade, index) => ({
    label: `${trade.symbol} - ${trade.side}`,
    amount: trade.pnl === null ? "$0" : `${trade.pnl >= 0 ? "+" : "-"}$${Math.abs(trade.pnl).toFixed(2)}`,
    loss: (trade.pnl ?? 0) < 0,
    key: trade.id ?? `${trade.symbol}-${index}`
  }));

  useEffect(() => {
    if (tradeLimitQuery.data?.tradeLimit) {
      setSelectedDailyLimit(tradeLimitQuery.data.tradeLimit.dailyLimit);
      setSelectedLockoutHours(tradeLimitQuery.data.tradeLimit.lockoutHours);
    }
  }, [tradeLimitQuery.data?.tradeLimit]);

  function saveDailyTradeLimit() {
    saveTradeLimitMutation.mutate({
      dailyLimit: selectedDailyLimit,
      lockoutHours: selectedLockoutHours,
      isEnabled: true
    });
  }

  function engageManualLockout() {
    manualLockoutMutation.mutate({
      lockoutHours: manualLockoutHours,
      reason: "Manual protection"
    });
  }

  function engageWeeklyLockout() {
    weeklyLockoutMutation.mutate({
      weeklyLimit,
      reason: "Weekly lockout"
    });
  }

  return (
    <AppShell>
      <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(560px,0.98fr)]">
        <div className="grid gap-3">
          <article className="rounded-[8px] border border-[#2dc75f] bg-white px-4 py-5 shadow-sm">
            <h2 className="text-xl font-medium text-black">Trades Today</h2>
            <div className="mt-4 flex items-end gap-2">
              <strong className="text-4xl leading-none text-black">{usedTrades}</strong>
              <span className="text-2xl font-semibold text-slate-500">/ {dailyLimit}</span>
            </div>
          </article>

          <div className="grid gap-2 sm:grid-cols-2">
            <article className="rounded-[8px] border border-[#2dc75f] bg-white px-4 py-5 shadow-sm">
              <h2 className="text-xl font-medium text-black">Lock Status</h2>
              <p
                className={
                  lockoutQuery.data?.locked
                    ? "mt-5 text-2xl font-medium text-[#ef4b43]"
                    : "mt-5 text-2xl font-medium text-[#00c773]"
                }
              >
                • {lockoutQuery.data?.locked ? "Locked" : "Active"}
              </p>
            </article>
            <article className="rounded-[8px] border border-[#2dc75f] bg-white px-4 py-5 shadow-sm">
              <h2 className="text-xl font-medium text-black">Platforms</h2>
              <p className="mt-4 text-3xl font-medium text-black">{connectedPlatforms}</p>
            </article>
          </div>

          <article className="rounded-[18px] border border-[#2dc75f] bg-white px-5 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-medium text-black">Daily Trade Limit</h2>
              <span className="text-lg font-medium text-[#00c773]">{progressPercent}%</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-neutral-300">
              <span className="block h-full bg-[#2dc75f]" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-3 text-sm tracking-wide text-slate-500">
              {remainingTrades} trade(s) remaining before auto-lock
            </p>
          </article>

          <section className="flex flex-wrap gap-5 px-4 pt-2">
            {platformList.map((platform) => (
              <div className="relative grid w-[76px] justify-items-center gap-2 text-center" key={platform.name}>
                <span className="absolute right-2 top-0 grid size-4 place-items-center rounded-full bg-slate-800 text-[8px] text-white">
                  ▣
                </span>
                <span className="grid size-14 place-items-center rounded-full bg-white text-lg shadow-lg">
                  <span className={platform.tone}>{platform.logo}</span>
                </span>
                <small className="max-w-[76px] truncate text-xs text-black" title={platform.name}>
                  {platform.name}
                </small>
              </div>
            ))}
          </section>
        </div>

        <article className="rounded-[8px] border border-[#2dc75f] bg-[#e8edf3] p-3 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Trade Journal</h2>
            <button
              className="rounded-md px-2 py-1 text-2xl leading-none text-slate-900 hover:bg-white"
              type="button"
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              title="Sync journal"
            >
              {syncMutation.isPending ? "↻" : "☰"}
            </button>
          </div>

          <div className="rounded-[10px] border border-slate-800/70 bg-[#eef2f6] px-4 py-3">
            <h3 className="text-lg font-medium text-black">Journal Overview</h3>
            <div className="mt-2 grid gap-4 text-sm text-slate-900 sm:grid-cols-3">
              <span>
                <i className="mr-2 inline-block size-2.5 rounded-full bg-[#2ecc71]" />
                {summary?.winRate ?? 0}% Wins
                <small className="mt-1 block pl-5 text-slate-400">
                  {summary ? Math.max(100 - summary.winRate, 0) : 0}% Loss
                </small>
              </span>
              <span>
                <i className="mr-2 inline-block size-2.5 rounded-full bg-[#e74c3c]" />
                {summary?.wins ?? 0} Wins
                <small className="mt-1 block pl-5 text-slate-400">{summary?.losses ?? 0} Loss</small>
              </span>
              <span>
                <i className="mr-2 inline-block size-2.5 rounded-full bg-[#e74c3c]" />
                ${summary?.totalPnl.toFixed(2) ?? "0.00"} P&amp;L
                <small className="mt-1 block pl-5 text-slate-400">{summary?.totalTrades ?? 0} Trades</small>
              </span>
            </div>
          </div>

          <div className="mt-2 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-[10px] bg-[#151b22] p-3 text-white">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span>Daily Journal ({todayLabel})</span>
                <i className="size-1.5 rounded-full bg-[#ef4b43]" />
              </div>
              <div className="grid gap-2">
                {journalQuery.isLoading ? (
                  <div className="rounded-md bg-[#22282f] px-3 py-4 text-sm text-slate-300">
                    Loading journal...
                  </div>
                ) : journalQuery.isError ? (
                  <div className="rounded-md bg-[#22282f] px-3 py-4 text-sm text-[#ffb4b0]">
                    Journal data load failed.
                  </div>
                ) : visibleJournalRows.length === 0 ? (
                  <div className="rounded-md bg-[#22282f] px-3 py-4 text-sm text-slate-300">
                    No journal trades yet.
                  </div>
                ) : (
                  visibleJournalRows.map((row) => (
                    <div
                      className="grid min-h-8 grid-cols-[24px_1fr_auto] items-center rounded-md bg-[#22282f] px-2 text-sm"
                      key={row.key}
                    >
                      <span
                        className={
                          row.loss
                            ? "grid size-4 place-items-center rounded-full bg-[#ef4b43] text-xs font-bold text-black"
                            : "grid size-4 place-items-center rounded-full bg-[#2ecc71] text-xs font-bold text-black"
                        }
                      >
                        {row.loss ? "×" : "✓"}
                      </span>
                      <span>{row.label}</span>
                      <strong className={row.amount.startsWith("+") ? "text-[#00d775]" : "text-[#ff443f]"}>
                        {row.amount}
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[10px] bg-[#151b22] p-3 text-white">
              <h3 className="text-sm leading-tight">
                Monthly Journal
                <br />
                ({monthLabel})
              </h3>
              <div className="relative mt-4 h-40 border-y border-[#29323a]">
                <div className="absolute inset-x-0 top-1/3 border-t border-[#29323a]" />
                <div className="absolute inset-x-0 top-2/3 border-t border-[#29323a]" />
                <div
                  className="absolute bottom-4 left-[28%] w-6 rounded-t bg-[#2ecc71]"
                  style={{ height: `${Math.max((summary?.wins ?? 0) * 28, 18)}px` }}
                />
                <div
                  className="absolute bottom-4 right-[22%] w-6 rounded-t bg-[#ef4b43]"
                  style={{ height: `${Math.max((summary?.losses ?? 0) * 28, 18)}px` }}
                />
                <div className="absolute bottom-0 left-[26%] text-xs text-neutral-400">Wins</div>
                <div className="absolute bottom-0 right-[19%] text-xs text-neutral-400">Loss</div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-32 grid gap-4 lg:mt-32 lg:grid-cols-2">
        <article className="rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-lg bg-blue-50 text-blue-600">◆</span>
            <h2 className="text-base font-bold text-slate-900">Daily Trade Limit</h2>
          </div>
          <p className="mt-8 text-xs text-neutral-500">
            Configure your daily trade limit to prevent overtrading. The terminal will enter
            Restricted Mode upon reaching this limit.
          </p>
          <div className="mt-8 flex flex-wrap gap-5">
            <div>
              <label className="text-xs font-medium text-black">Max Trades</label>
              <div className="mt-1 flex h-9 items-center gap-3 rounded-[10px] border border-slate-200 bg-slate-50 px-2">
                <button
                  className="grid size-7 place-items-center rounded-full bg-white text-xl"
                  type="button"
                  onClick={() => setSelectedDailyLimit((value) => Math.max(value - 1, 1))}
                >
                  −
                </button>
                <strong>{selectedDailyLimit}</strong>
                <button
                  className="grid size-7 place-items-center rounded-full bg-white text-xl"
                  type="button"
                  onClick={() => setSelectedDailyLimit((value) => value + 1)}
                >
                  ＋
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-black">Lockout Duration</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {durations.map((duration) => (
                  <button
                    className={
                      Number.parseInt(duration, 10) === selectedLockoutHours
                        ? "h-9 rounded-md border border-[#2ecc71] bg-emerald-50 px-3 text-xs font-semibold text-[#2ecc71]"
                        : "h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-black"
                    }
                    type="button"
                    key={duration}
                    onClick={() => setSelectedLockoutHours(Number.parseInt(duration, 10))}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            className="mt-8 h-10 w-full rounded-[8px] bg-[#2f65ed] text-sm font-bold text-white"
            type="button"
            onClick={saveDailyTradeLimit}
            disabled={saveTradeLimitMutation.isPending}
          >
            ✓ {saveTradeLimitMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </article>

        <article className="rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-[#2ecc71]">◆</span>
            <h2 className="text-base font-bold text-slate-900">Manual Protection</h2>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Voluntarily restrict account access if you don't feel like trading or want to step away.
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_115px]">
            <div>
              <label className="text-xs font-medium text-black">Lock Date</label>
              <button className="mt-1 flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 text-sm" type="button">
                <span>▣ 08 Sep 2026</span>
                <span>⌄</span>
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-black">Weekly Limit</label>
              <div className="mt-1 flex h-9 items-center gap-3 rounded-[10px] border border-slate-200 bg-slate-50 px-2">
                <button
                  className="grid size-7 place-items-center rounded-full bg-white text-xl"
                  type="button"
                  onClick={() => setWeeklyLimit((value) => Math.max(value - 1, 1))}
                >
                  −
                </button>
                <strong>{weeklyLimit}</strong>
                <button
                  className="grid size-7 place-items-center rounded-full bg-white text-xl"
                  type="button"
                  onClick={() => setWeeklyLimit((value) => value + 1)}
                >
                  ＋
                </button>
              </div>
            </div>
          </div>
          <label className="mt-3 block text-xs font-medium text-black">Lockout Duration</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {durations.map((duration) => (
              <button
                className={
                  Number.parseInt(duration, 10) === manualLockoutHours
                    ? "h-9 rounded-md border border-[#2ecc71] bg-emerald-50 px-3 text-xs font-semibold text-[#2ecc71]"
                    : "h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-black"
                }
                type="button"
                key={duration}
                onClick={() => {
                  const hours = Number.parseInt(duration, 10);

                  if (hours === 4 || hours === 8 || hours === 12 || hours === 24) {
                    setManualLockoutHours(hours);
                  }
                }}
              >
                {duration}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr]">
            <button
              className="h-9 rounded-[8px] bg-[#ef4b43] text-xs font-bold text-white disabled:opacity-70"
              type="button"
              onClick={engageWeeklyLockout}
              disabled={weeklyLockoutMutation.isPending}
            >
              ⏱ {weeklyLockoutMutation.isPending ? "Locking..." : "Weekly Lock"}
            </button>
            <button
              className="h-9 rounded-[8px] border border-[#2ecc71] bg-emerald-50 text-xs font-bold text-[#2ecc71] disabled:opacity-70"
              type="button"
              onClick={engageManualLockout}
              disabled={manualLockoutMutation.isPending}
            >
              {manualLockoutMutation.isPending ? "Engaging..." : "Engage Lockout"}
            </button>
          </div>
        </article>
      </section>

      <section className="mt-4 flex min-h-[68px] items-center gap-4 rounded-xl bg-white px-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <span className="grid size-6 place-items-center rounded-full border-2 border-[#39b54a] text-[#39b54a]">✓</span>
        <div>
          <strong className="text-lg font-medium text-slate-900">Binance Block</strong>
          <p className="text-sm text-neutral-400">Binance can open freely</p>
        </div>
      </section>
    </AppShell>
  );
}
