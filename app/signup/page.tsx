import Link from "next/link";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";

export default function SignupPage() {
  return (
    <AuthShell>
      <div className="auth-copy">
        <h1>Join TradeLMT</h1>
        <p>Start securing your risk parameters today.</p>
      </div>

      <form className="auth-form">
        <AuthField label="Full Name" placeholder="John Doe" icon="♙" />
        <AuthField label="Email Address" type="email" placeholder="john@example.com" icon="✉" />
        <AuthField label="Password" type="password" placeholder="Create password" icon="▣" trailing="⌧" />
        <Link href="/home" className="button-link">
          <PrimaryButton>Create Account</PrimaryButton>
        </Link>
      </form>

      <p className="auth-switch">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
