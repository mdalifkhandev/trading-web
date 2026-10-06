"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";
import {
  getErrorMessage,
  useResetForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation
} from "../lib/auth";

export default function OtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const verifyOtp = useVerifyForgotPasswordOtpMutation();
  const resetPassword = useResetForgotPasswordMutation();
  const otp = useMemo(() => digits.join(""), [digits]);
  const isOtpVerified = Boolean(resetToken);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") ?? "");
  }, []);

  function handleDigitChange(index: number, value: string) {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((digit, digitIndex) => (digitIndex === index ? nextValue : digit)));

    if (nextValue) {
      const nextInput = document.querySelector<HTMLInputElement>(`input[data-otp-index="${index + 1}"]`);
      nextInput?.focus();
    }
  }

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      const result = await verifyOtp.mutateAsync({ email, otp });
      setResetToken(result.resetToken);
      setMessage("OTP verified. Now set your new password.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      const result = await resetPassword.mutateAsync({
        email,
        resetToken,
        newPassword,
        confirmPassword
      });
      setMessage(result.message);
      setTimeout(() => router.push("/login"), 900);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <AuthShell>
      <div>
        <h1 className="m-0 text-4xl font-medium tracking-normal text-[#06090f]">
          {isOtpVerified ? "New Password" : "Enter OTP"}
        </h1>
        <p className="mb-6 mt-3 text-[15px] text-neutral-500">
          {isOtpVerified
            ? "Create a new password for your account."
            : `Use the 6 digit code printed in backend console${email ? ` for ${email}` : ""}.`}
        </p>
      </div>

      {!isOtpVerified ? (
        <form className="grid gap-4" onSubmit={handleVerifyOtp}>
          <div className="grid grid-cols-6 gap-2.5" aria-label="OTP code">
            {digits.map((digit, index) => (
              <input
                className="aspect-square w-full rounded-[10px] border border-[#dce5f0] bg-[#f7faff] text-center text-2xl text-[#172033] outline-none"
                data-otp-index={index}
                inputMode="numeric"
                key={index}
                maxLength={1}
                onChange={(event) => handleDigitChange(index, event.target.value)}
                value={digit}
              />
            ))}
          </div>
          {message ? <p className="text-sm text-amber-600">{message}</p> : null}
          <PrimaryButton disabled={!email || otp.length !== 6 || verifyOtp.isPending} type="submit">
            {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
          </PrimaryButton>
        </form>
      ) : (
        <form className="grid gap-4" onSubmit={handleResetPassword}>
          <AuthField
            icon="▣"
            label="New Password"
            minLength={8}
            name="newPassword"
            onChange={setNewPassword}
            placeholder="Create new password"
            required
            type="password"
            value={newPassword}
          />
          <AuthField
            icon="▣"
            label="Confirm Password"
            minLength={8}
            name="confirmPassword"
            onChange={setConfirmPassword}
            placeholder="Confirm new password"
            required
            type="password"
            value={confirmPassword}
          />
          {message ? <p className="text-sm text-amber-600">{message}</p> : null}
          <PrimaryButton disabled={resetPassword.isPending} type="submit">
            {resetPassword.isPending ? "Resetting..." : "Reset Password"}
          </PrimaryButton>
        </form>
      )}

      <p className="mt-7 text-center text-[15px] text-neutral-500">
        Did not receive code?{" "}
        <Link className="font-semibold text-[#12b85b]" href="/forgot-password">
          Send again
        </Link>
      </p>
    </AuthShell>
  );
}
