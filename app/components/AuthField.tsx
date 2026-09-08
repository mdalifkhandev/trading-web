type AuthFieldProps = {
  label: string;
  type?: string;
  placeholder: string;
  icon: string;
  trailing?: string;
};

export function AuthField({ label, type = "text", placeholder, icon, trailing }: AuthFieldProps) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className="input-wrap">
        <span className="input-icon" aria-hidden="true">
          {icon}
        </span>
        <input type={type} placeholder={placeholder} />
        {trailing ? (
          <span className="input-trailing" aria-hidden="true">
            {trailing}
          </span>
        ) : null}
      </span>
    </label>
  );
}
