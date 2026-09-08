import Link from "next/link";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div>
        <h1 className="m-0 text-4xl font-medium tracking-normal text-[#06090f]">Reset Password</h1>
        <p className="mb-6 mt-3 text-[15px] text-neutral-500">
          Enter your email and we will send an OTP code.
        </p>
      </div>

      <form className="grid gap-4">
        <AuthField label="Email Address" type="email" placeholder="Enter your email" icon="✉" />
        <p className="text-sm text-amber-600">
          Forgot password backend endpoint is not available yet.
        </p>
        <Link href="/otp" className="block">
          <PrimaryButton type="button">Send OTP</PrimaryButton>
        </Link>
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
