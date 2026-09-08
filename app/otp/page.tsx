import Link from "next/link";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";

export default function OtpPage() {
  return (
    <AuthShell>
      <div>
        <h1 className="m-0 text-4xl font-medium tracking-normal text-[#06090f]">Enter OTP</h1>
        <p className="mb-6 mt-3 text-[15px] text-neutral-500">
          Use the 6 digit code sent to your email.
        </p>
      </div>

      <form className="grid gap-4">
        <div className="grid grid-cols-6 gap-2.5" aria-label="OTP code">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              className="aspect-square w-full rounded-[10px] border border-[#dce5f0] bg-[#f7faff] text-center text-2xl text-[#172033] outline-none"
              key={index}
              inputMode="numeric"
              maxLength={1}
            />
          ))}
        </div>
        <Link href="/login" className="block">
          <PrimaryButton>Verify OTP</PrimaryButton>
        </Link>
      </form>

      <p className="mt-7 text-center text-[15px] text-neutral-500">
        Did not receive code?{" "}
        <Link className="font-semibold text-[#12b85b]" href="/forgot-password">
          Send again
        </Link>
      </p>
    </AuthShell>
  );
}
