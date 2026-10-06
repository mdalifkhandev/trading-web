"use client";

import { useState, type ReactNode, type MouseEvent } from "react";

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

type AuthFieldProps = {
  label: string;
  type?: string;
  placeholder: string;
  icon: ReactNode;
  trailing?: ReactNode;
  name?: string;
  value?: string;
  required?: boolean;
  minLength?: number;
  onChange?: (value: string) => void;
};

export function AuthField({
  label,
  type = "text",
  placeholder,
  icon,
  trailing,
  name,
  value,
  required,
  minLength,
  onChange
}: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleTogglePassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <label className="grid gap-2 text-sm text-slate-700">
      <span>{label}</span>
      <span className="grid min-h-12 grid-cols-[24px_1fr_24px] items-center rounded-[10px] border border-[#dce5f0] bg-[#f7faff] px-3">
        <span className="text-[#91a0b6]" aria-hidden="true">
          {icon}
        </span>
        <input
          className="min-w-0 bg-transparent text-[15px] text-[#172033] outline-none placeholder:text-[#8da0bb]"
          type={resolvedType}
          name={name}
          placeholder={placeholder}
          value={value}
          required={required}
          minLength={minLength}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[#91a0b6] transition-colors hover:text-[#475569] focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : trailing ? (
          <span className="text-[#91a0b6]" aria-hidden="true">
            {trailing}
          </span>
        ) : null}
      </span>
    </label>
  );
}
