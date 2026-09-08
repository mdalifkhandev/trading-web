import Link from "next/link";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";

export default function OtpPage() {
  return (
    <AuthShell>
      <div className="auth-copy">
        <h1>Enter OTP</h1>
        <p>Use the 6 digit code sent to your email.</p>
      </div>

      <form className="auth-form">
        <div className="otp-row" aria-label="OTP code">
          {Array.from({ length: 6 }).map((_, index) => (
            <input key={index} inputMode="numeric" maxLength={1} />
          ))}
        </div>
        <Link href="/login" className="button-link">
          <PrimaryButton>Verify OTP</PrimaryButton>
        </Link>
      </form>

      <p className="auth-switch">
        Did not receive code? <Link href="/forgot-password">Send again</Link>
      </p>
    </AuthShell>
  );
}
