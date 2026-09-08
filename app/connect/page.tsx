import { AppShell } from "../components/AppShell";

const brokers = [
  {
    name: "Thinkorswim",
    subtitle: "Equities & Options",
    logo: "✳",
    logoClass: "text-sky-500",
    status: "NOT CONNECTED",
      action: "CONNECT"
  },
  {
    name: "Tradovate",
    subtitle: "Futures Execution",
    logo: "▣",
    logoClass: "bg-blue-600 text-white",
    status: "NOT CONNECTED",
    action: "CONNECT"
  },
  {
    name: "Interactive Brokers",
    subtitle: "Global Multi-Asset",
    logo: "◖",
    logoClass: "text-red-600",
    status: "NOT CONNECTED",
    action: "CONNECT"
  },
  {
    name: "TradingView",
    subtitle: "Chart Integration",
    logo: "TV",
    logoClass: "text-black",
    status: "NOT CONNECTED",
    action: "CONNECT"
  },
  {
    name: "NinjaTrader",
    subtitle: "Desktop Terminal",
    logo: "NT",
    logoClass: "bg-black text-white",
    status: "NOT CONNECTED",
    action: "CONNECT"
  },
  {
    name: "Tastytrade",
    subtitle: "High Probability Trading",
    logo: "▣",
    logoClass: "bg-blue-600 text-white",
    status: "NOT CONNECTED",
    action: "CONNECT"
  },
  {
    name: "Robinhood",
    subtitle: "Simple Execution",
    logo: "Robinhood",
    logoClass: "bg-lime-300 text-[6px] text-lime-950",
    status: "NOT CONNECTED",
    action: "CONNECT"
  },
  {
    name: "Next Gateway",
    subtitle: "Community Requested",
    logo: "▣",
    logoClass: "bg-blue-300 text-white",
    status: "COMING SOON",
    action: "",
    disabled: true
  }
];

export default function ConnectPage() {
  return (
    <AppShell>
      <section className="min-h-[calc(100vh-44px)] bg-[#f7f7fb] px-0 pb-6 pt-8">
        <div className="mb-6">
          <h1 className="text-[26px] font-medium leading-tight tracking-normal text-[#101827]">
            Broker Gateway
          </h1>
          <p className="mt-2 max-w-[680px] text-[15px] leading-5 text-[#667085]">
            Establish secure, encrypted connections to your primary trading venues.
            <br />
            Professional grade API bridges ensure millisecond execution sync.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {brokers.slice(0, 6).map((broker) => (
            <BrokerCard key={broker.name} broker={broker} />
          ))}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {brokers.slice(6).map((broker) => (
            <BrokerCard key={broker.name} broker={broker} />
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

function BrokerCard({ broker }: { broker: (typeof brokers)[number] }) {
  return (
    <article
      className={
        broker.disabled
          ? "flex min-h-[174px] flex-col rounded-[10px] border border-slate-200 bg-white/45 p-4 opacity-70 shadow-[0_3px_10px_rgba(15,23,42,0.04)]"
          : "flex min-h-[174px] flex-col rounded-[10px] border border-slate-200 bg-white p-4 shadow-[0_3px_10px_rgba(15,23,42,0.06)]"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid size-8 place-items-center overflow-hidden text-[18px] font-black leading-none ${broker.logoClass}`}
        >
          {broker.logo}
        </span>
        <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-500">
          • {broker.status}
        </span>
      </div>

      <div className="mt-3">
        <h2 className="text-[15px] font-medium text-[#101827]">{broker.name}</h2>
        <p className="mt-0.5 text-[12px] text-[#667085]">{broker.subtitle}</p>
      </div>

      {broker.action ? (
        <button
          className="mt-auto h-7 rounded-[6px] border border-slate-300 bg-slate-50 px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500"
          type="button"
        >
      
          {broker.action}
        </button>
      ) : null}
    </article>
  );
}
