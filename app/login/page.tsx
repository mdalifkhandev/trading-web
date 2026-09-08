import Link from "next/link";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";

export default function LoginPage() {
  return (
    <AuthShell showBack={false}>
      <div>
        <h1 className="m-0 text-4xl font-medium tracking-normal text-[#06090f]">Sign In</h1>
        <p className="mb-6 mt-3 text-[15px] text-neutral-500">
          Access your TradeLMT execution workspace.
        </p>
      </div>

      <form className="grid gap-4">
        <AuthField label="Email Address" type="email" placeholder="Enter your email" icon="✉" />
        <AuthField label="Password" type="password" placeholder="••••••••" icon="▣" trailing="⌧" />
        <Link className="-mt-2 justify-self-end text-sm text-[#5f7191]" href="/forgot-password">
          Forgot Password?
        </Link>
        <Link href="/home" className="block">
          <PrimaryButton>Login</PrimaryButton>
        </Link>
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
