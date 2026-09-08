import Link from "next/link";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div className="auth-copy">
        <h1>Reset Password</h1>
        <p>Enter your email and we will send an OTP code.</p>
      </div>

      <form className="auth-form">
        <AuthField label="Email Address" type="email" placeholder="Enter your email" icon="✉" />
        <Link href="/otp" className="button-link">
          <PrimaryButton>Send OTP</PrimaryButton>
        </Link>
      </form>

      <p className="auth-switch">
        Remember password? <Link href="/login">Back to login</Link>
      </p>
    </AuthShell>
  );
}
