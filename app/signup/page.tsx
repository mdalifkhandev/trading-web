import Link from "next/link";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";

export default function SignupPage() {
  return (
    <AuthShell>
      <div>
        <h1 className="m-0 text-4xl font-medium tracking-normal text-[#06090f]">Join TradeLMT</h1>
        <p className="mb-6 mt-3 text-[15px] text-neutral-500">
          Start securing your risk parameters today.
        </p>
      </div>

      <form className="grid gap-4">
        <AuthField label="Full Name" placeholder="John Doe" icon="♙" />
        <AuthField label="Email Address" type="email" placeholder="john@example.com" icon="✉" />
        <AuthField label="Password" type="password" placeholder="Create password" icon="▣" trailing="⌧" />
        <Link href="/home" className="block">
          <PrimaryButton>Create Account</PrimaryButton>
        </Link>
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
