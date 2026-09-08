import type { ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
};

export function PrimaryButton({ children }: PrimaryButtonProps) {
  return (
    <button
      className="grid h-[52px] w-full grid-cols-[1fr_44px] items-center rounded-full bg-[#35ce78] p-1 text-base font-semibold text-white transition hover:-translate-y-px hover:bg-[#18b85f]"
      type="button"
    >
      <span>{children}</span>
      <span
        className="grid size-11 place-items-center rounded-full bg-white text-[25px] text-[#18b85f]"
        aria-hidden="true"
      >
        →
      </span>
    </button>
  );
}
