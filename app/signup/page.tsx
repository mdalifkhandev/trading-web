"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";
import { getErrorMessage, useSignupMutation } from "../lib/auth";
import { useAuthStore } from "../store/auth-store";

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignupMutation();
  const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const result = await signupMutation.mutateAsync({ name, email, password });
      setSession(result);
      router.push("/home");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <AuthShell>
      <div>
        <h1 className="m-0 text-4xl font-medium tracking-normal text-[#06090f]">Join TradeLMT</h1>
        <p className="mb-6 mt-3 text-[15px] text-neutral-500">
          Start securing your risk parameters today.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          label="Full Name"
          name="name"
          placeholder="John Doe"
          icon="♙"
          value={name}
          required
          onChange={setName}
        />
        <AuthField
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@example.com"
          icon="✉"
          value={email}
          required
          onChange={setEmail}
        />
        <AuthField
          label="Password"
          type="password"
          name="password"
          placeholder="Create password"
          icon="▣"
          trailing="⌧"
          value={password}
          required
          minLength={8}
          onChange={setPassword}
        />
        {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        <PrimaryButton disabled={signupMutation.isPending}>
          {signupMutation.isPending ? "Creating..." : "Create Account"}
        </PrimaryButton>
      </form>

      <p className="mt-7 text-center text-[15px] text-neutral-500">
        Already have an account?{" "}
        <Link className="font-semibold text-[#12b85b]" href="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
