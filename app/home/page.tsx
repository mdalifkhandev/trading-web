import { AppShell } from "../components/AppShell";

const platformItems = [
  { name: "Thinkorswim", logo: "✳" },
  { name: "Tradovate", logo: "▣" },
  { name: "TradingView", logo: "TV" },
  { name: "Robinhood", logo: "RH" },
  { name: "NinjaTrader", logo: "NT" },
  { name: "Interactive", logo: "▰" }
];

const dailyJournal = [
  { label: "T#01 - WIN", amount: "+$00", state: "win" },
  { label: "T#02 - WIN", amount: "-$20", state: "win negative" },
  { label: "T#03 - WIN", amount: "+$20", state: "win" },
  { label: "T#04 - LOSS", amount: "-$30", state: "loss negative" }
];

const lockoutDurations = ["1 H", "2 H", "4 H", "8 H", "12 H", "24 H"];

export default function HomePage() {
  return (
    <AppShell>
      <section className="dashboard-grid">
        <div className="left-dashboard">
          <article className="outline-card trades-card">
            <h2>Trades Today</h2>
            <div className="trade-count">
              <strong>0</strong>
              <span>/ 2</span>
            </div>
          </article>

          <div className="mini-grid">
            <article className="outline-card">
              <h2>Lock Status</h2>
              <p className="status-active">• Active</p>
            </article>
            <article className="outline-card">
              <h2>Platforms</h2>
              <p className="platform-count">3</p>
            </article>
          </div>

          <article className="outline-card limit-overview">
            <div className="limit-top">
              <h2>Daily Trade Limit</h2>
              <span>0%</span>
            </div>
            <div className="progress-track">
              <span />
            </div>
            <p>2 trade(s) remaining before auto-lock</p>
          </article>

          <section className="platform-strip" aria-label="Platforms">
            {platformItems.map((platform) => (
              <div className="platform-item" key={platform.name}>
                <span className="platform-lock">▣</span>
                <span className="platform-logo">{platform.logo}</span>
                <small>{platform.name}</small>
              </div>
            ))}
          </section>
        </div>

        <article className="outline-card journal-card">
          <div className="journal-title">
            <h2>Trade Journal</h2>
            <span>☰</span>
          </div>

          <div className="journal-overview">
            <h3>Journal Overview</h3>
            <div className="overview-stats">
              <span><i className="dot-green" />60% Wins<small>40% Loss</small></span>
              <span><i className="dot-red" />30% Wins<small>10% Loss</small></span>
              <span><i className="dot-red" />20% Wins<small>—</small></span>
            </div>
          </div>

          <div className="journal-content">
            <div className="daily-card">
              <div className="daily-head">
                <span>Daily Journal (12JUN2026)</span>
                <i />
              </div>
              {dailyJournal.map((item) => (
                <div className="daily-row" key={item.label}>
                  <span className={item.state.includes("loss") ? "loss-mark" : "win-mark"}>
                    {item.state.includes("loss") ? "×" : "✓"}
                  </span>
                  <span>{item.label}</span>
                  <strong className={item.amount.startsWith("+") ? "positive" : "negative"}>
                    {item.amount}
                  </strong>
                </div>
              ))}
            </div>

            <div className="monthly-card">
              <h3>Monthly Journal<br />(June 2026)</h3>
              <div className="chart">
                <div className="chart-lines">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="bar bar-win" />
                <div className="bar bar-loss" />
                <div className="chart-labels">
                  <span>Wins</span>
                  <span>Loss</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="control-grid">
        <article className="control-card">
          <div className="control-title">
            <span className="shield-blue">◆</span>
            <h2>Daily Trade Limit</h2>
          </div>
          <p>
            Configure your daily trade limit to prevent overtrading. The terminal will enter
            Restricted Mode upon reaching this limit.
          </p>

          <div className="control-row">
            <div>
              <label>Max Trades</label>
              <div className="stepper">
                <button type="button">−</button>
                <strong>2</strong>
                <button type="button">＋</button>
              </div>
            </div>
            <div>
              <label>Lockout Duration</label>
              <div className="duration-row">
                {lockoutDurations.map((duration) => (
                  <button className={duration === "4 H" ? "duration-active" : ""} type="button" key={duration}>
                    {duration}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="save-button" type="button">
            ✓ Save Changes
          </button>
        </article>

        <article className="control-card">
          <div className="control-title">
            <span className="shield-green">◆</span>
            <h2>Manual Protection</h2>
          </div>
          <p>Voluntarily restrict account access if you don't feel like trading or want to step away.</p>

          <div className="manual-grid">
            <div>
              <label>Lock Date</label>
              <button className="date-field" type="button">
                <span>▣ 08 Sep 2026</span>
                <span>⌄</span>
              </button>
            </div>
            <div>
              <label>Weekly Limit</label>
              <div className="stepper">
                <button type="button">−</button>
                <strong>2</strong>
                <button type="button">＋</button>
              </div>
            </div>
          </div>

          <label>Lockout Duration</label>
          <div className="duration-row">
            {lockoutDurations.map((duration) => (
              <button className={duration === "4 H" ? "duration-active" : ""} type="button" key={duration}>
                {duration}
              </button>
            ))}
          </div>

          <div className="manual-actions">
            <button className="weekly-lock" type="button">⏱ Weekly Lock</button>
            <button className="engage-lockout" type="button">Engage Lockout</button>
          </div>
        </article>
      </section>

      <section className="binance-card">
        <span>✓</span>
        <div>
          <strong>Binance Block</strong>
          <p>Binance can open freely</p>
        </div>
      </section>
    </AppShell>
  );
}
