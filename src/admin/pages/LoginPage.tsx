import { useState, type FormEvent } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFields({});
    try {
      await login(email, password);
      // No redirect needed — AdminApp re-renders once `user` is set.
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFields(err.fields);
      } else {
        setError("Could not reach the server. Is the API running?");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center mx-auto mb-4">
            TG
          </div>
          <h1 className="text-2xl font-display font-bold">Admin sign in</h1>
          <p className="text-muted-foreground text-sm mt-1">Time Global Tech</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          {error && (
            <div
              role="alert"
              className="px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
            {fields.email && <p className="text-destructive text-xs mt-1">{fields.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
            {fields.password && <p className="text-destructive text-xs mt-1">{fields.password}</p>}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <p className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground pt-1">
            <ShieldCheck size={13} />
            Attempts are rate limited and logged.
          </p>
        </form>
      </div>
    </div>
  );
}
