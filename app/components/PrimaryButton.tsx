import type { ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
};

export function PrimaryButton({ children }: PrimaryButtonProps) {
  return (
    <button className="primary-button" type="button">
      <span>{children}</span>
      <span className="button-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}
