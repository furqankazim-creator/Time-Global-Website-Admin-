import type { ReactNode } from "react";

const inputCls =
  "w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary disabled:opacity-60";

export function Field({
  label, error, hint, required, children,
}: {
  label: string; error?: string; hint?: string; required?: boolean; children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Text({
  value, onChange, ...rest
}: { value: string; onChange: (v: string) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"
>) {
  return <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
}

export function Num({
  value, onChange, ...rest
}: { value: number; onChange: (v: number) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"
>) {
  return (
    <input
      {...rest}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputCls}
    />
  );
}

export function Area({
  value, onChange, rows = 4, mono, ...rest
}: {
  value: string; onChange: (v: string) => void; rows?: number; mono?: boolean;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange" | "rows">) {
  return (
    <textarea
      {...rest}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-y focus:outline-none focus:border-primary ${
        mono ? "font-mono" : ""
      }`}
    />
  );
}

export function Select({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Check({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-primary"
      />
      {label}
    </label>
  );
}

/** Comma-separated list ⇄ string[] (tech stack, etc.). */
export function TagsInput({
  value, onChange, placeholder,
}: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <input
      value={value.join(", ")}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(
          e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      }
      className={inputCls}
    />
  );
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-4">
      {title && <h2 className="font-semibold text-sm">{title}</h2>}
      {children}
    </section>
  );
}
