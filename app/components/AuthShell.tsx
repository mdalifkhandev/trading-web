import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  showBack?: boolean;
};

export function AuthShell({ children, showBack = true }: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-visual">
          <Image
            src="/images/auth-illustration.png?v=20260908"
            alt="Trading workspace illustration"
            fill
            priority
            unoptimized
            sizes="(max-width: 900px) 100vw, 62vw"
            className="auth-visual-image"
          />
        </div>

        <section className="auth-panel">
          {showBack ? (
            <Link className="back-link" href="/login" aria-label="Back to login">
              ‹
            </Link>
          ) : null}
          {children}
        </section>
      </section>
    </main>
  );
}
