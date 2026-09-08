import Link from "next/link";
import { AuthField } from "../components/AuthField";
import { AuthShell } from "../components/AuthShell";
import { PrimaryButton } from "../components/PrimaryButton";

export default function LoginPage() {
  return (
    <AuthShell showBack={false}>
      <div className="auth-copy">
        <h1>Sign In</h1>
        <p>Access your TradeLMT execution workspace.</p>
      </div>

      <form className="auth-form">
        <AuthField label="Email Address" type="email" placeholder="Enter your email" icon="✉" />
        <AuthField label="Password" type="password" placeholder="••••••••" icon="▣" trailing="⌧" />
        <Link className="forgot-link" href="/forgot-password">
          Forgot Password?
        </Link>
        <Link href="/home" className="button-link">
          <PrimaryButton>Login</PrimaryButton>
        </Link>
      </form>

      <p className="auth-switch">
        New to the platform? <Link href="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}
