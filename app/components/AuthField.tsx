type AuthFieldProps = {
  label: string;
  type?: string;
  placeholder: string;
  icon: string;
  trailing?: string;
};

export function AuthField({ label, type = "text", placeholder, icon, trailing }: AuthFieldProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-700">
      <span>{label}</span>
      <span className="grid min-h-12 grid-cols-[24px_1fr_24px] items-center rounded-[10px] border border-[#dce5f0] bg-[#f7faff] px-3">
        <span className="text-[#91a0b6]" aria-hidden="true">
          {icon}
        </span>
        <input
          className="min-w-0 bg-transparent text-[15px] text-[#172033] outline-none placeholder:text-[#8da0bb]"
          type={type}
          placeholder={placeholder}
        />
        {trailing ? (
          <span className="text-[#91a0b6]" aria-hidden="true">
            {trailing}
          </span>
        ) : null}
      </span>
    </label>
  );
}
