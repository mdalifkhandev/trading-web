import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  showBack?: boolean;
};

export function AuthShell({ children, showBack = true }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-white">
      <section className="grid min-h-screen grid-cols-1 overflow-hidden bg-white lg:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.55fr)]">
        <div className="relative min-h-[280px] bg-[#dfeef8] lg:min-h-screen">
          <Image
            src="/images/auth-illustration.png?v=20260908"
            alt="Trading workspace illustration"
            fill
            priority
            unoptimized
            sizes="(max-width: 900px) 100vw, 62vw"
            className="object-cover object-center"
          />
        </div>

        <section className="flex w-full max-w-[470px] flex-col justify-center justify-self-center bg-white px-7 py-10 sm:px-12 lg:px-12 lg:py-[72px]">
          {showBack ? (
            <Link
              className="mb-5 grid size-8 place-items-center rounded-full text-4xl leading-none text-slate-900"
              href="/login"
              aria-label="Back to login"
            >
              ‹
            </Link>
          ) : null}
          {children}
        </section>
      </section>
    </main>
  );
}
