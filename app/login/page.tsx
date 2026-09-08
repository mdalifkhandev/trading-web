"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";
import { getErrorMessage, useLoginMutation } from "../lib/auth";
import { useAuthStore } from "../store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const result = await loginMutation.mutateAsync({ email, password });
      setSession(result);
      router.push("/home");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <AuthShell showBack={false}>
      <div>
        <h1 className="m-0 text-4xl font-medium tracking-normal text-[#06090f]">Sign In</h1>
        <p className="mb-6 mt-3 text-[15px] text-neutral-500">
          Access your TradeLMT execution workspace.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          icon="✉"
          value={email}
          required
          onChange={setEmail}
        />
        <AuthField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          icon="▣"
          trailing="⌧"
          value={password}
          required
          onChange={setPassword}
        />
        <Link className="-mt-2 justify-self-end text-sm text-[#5f7191]" href="/forgot-password">
          Forgot Password?
        </Link>
        {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        <PrimaryButton disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </PrimaryButton>
      </form>

      <p className="mt-7 text-center text-[15px] text-neutral-500">
        New to the platform?{" "}
        <Link className="font-semibold text-[#12b85b]" href="/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
