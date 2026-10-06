"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";
import { getErrorMessage, useForgotPasswordMutation } from "../lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const forgotPassword = useForgotPasswordMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      const result = await forgotPassword.mutateAsync({ email });
      setMessage(result.message);
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <AuthShell>
      <div>
        <h1 className="m-0 text-4xl font-medium tracking-normal text-[#06090f]">Reset Password</h1>
        <p className="mb-6 mt-3 text-[15px] text-neutral-500">
          Enter your email and we will send an OTP code.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          icon="✉"
          label="Email Address"
          name="email"
          onChange={setEmail}
          placeholder="Enter your email"
          required
          type="email"
          value={email}
        />
        {message ? <p className="text-sm text-amber-600">{message}</p> : null}
        <PrimaryButton type="submit">
          {forgotPassword.isPending ? "Sending..." : "Send OTP"}
        </PrimaryButton>
      </form>

      <p className="mt-7 text-center text-[15px] text-neutral-500">
        Remember password?{" "}
        <Link className="font-semibold text-[#12b85b]" href="/login">
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
