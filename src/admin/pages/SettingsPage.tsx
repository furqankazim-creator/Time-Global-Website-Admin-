import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Loader2, Save, Plus, X, MailCheck, AlertTriangle } from "lucide-react";
import { ApiError, api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { Area, Card, Check, Field, Num, Text } from "../components/FormKit";

type MenuItem = { label: string; url: string; order: number; children: [] };
type Settings = {
  siteName: string;
  contact: { email: string; phone: string; address: string };
  socials: { linkedin: string; twitter: string; facebook: string; instagram: string; youtube: string };
  headerMenu: MenuItem[];
  footerMenu: MenuItem[];
  smtp: {
    host: string; port: number; secure: boolean; user: string; password: string;
    fromName: string; fromEmail: string; notifyOnLead: boolean; notifyTo: string;
    passwordSet?: boolean;
  };
  maintenanceMode: boolean;
  defaultSeo: { metaTitle: string; metaDescription: string };
};

const EMPTY: Settings = {
  siteName: "",
  contact: { email: "", phone: "", address: "" },
  socials: { linkedin: "", twitter: "", facebook: "", instagram: "", youtube: "" },
  headerMenu: [], footerMenu: [],
  smtp: { host: "", port: 587, secure: false, user: "", password: "", fromName: "", fromEmail: "", notifyOnLead: true, notifyTo: "" },
  maintenanceMode: false,
  defaultSeo: { metaTitle: "", metaDescription: "" },
};

const TABS = [
  { slug: "general", label: "General" },
  { slug: "menus", label: "Menus" },
  { slug: "email", label: "Email/SMTP" },
  { slug: "backup", label: "Backup" },
];

function MenuEditor({
  items, onChange, disabled, label,
}: { items: MenuItem[]; onChange: (v: MenuItem[]) => void; disabled: boolean; label: string }) {
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((it, idx) => ({ ...it, order: idx })));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-xs text-muted-foreground">No items.</p>}
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={it.label}
              placeholder="Label"
              disabled={disabled}
              onChange={(e) => { const n = [...items]; n[i] = { ...n[i], label: e.target.value }; onChange(n); }}
              className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
            <input
              value={it.url}
              placeholder="/path"
              disabled={disabled}
              onChange={(e) => { const n = [...items]; n[i] = { ...n[i], url: e.target.value }; onChange(n); }}
              className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary"
            />
            {!disabled && (
              <>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  className="px-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
                  className="px-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move down">↓</button>
                <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="p-1.5 rounded text-muted-foreground hover:text-destructive" aria-label="Remove">
                  <X size={14} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {!disabled && (
        <button type="button"
          onClick={() => onChange([...items, { label: "", url: "", order: items.length, children: [] }])}
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
          <Plus size={14} /> Add item
        </button>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [, params] = useRoute("/admin/settings/:tab");
  const tab = params?.tab ?? "general";
  const { user, canEdit } = useAuth();
  const isAdmin = user?.role === "admin";
  const qc = useQueryClient();

  const [form, setForm] = useState<Settings>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [testMsg, setTestMsg] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api<{ data: Settings }>("/api/v1/admin/settings").then((r) => r.data),
    enabled: isAdmin,
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...EMPTY, ...data,
        contact: { ...EMPTY.contact, ...data.contact },
        socials: { ...EMPTY.socials, ...data.socials },
        // The API never returns the password; keep it blank = "unchanged".
        smtp: { ...EMPTY.smtp, ...data.smtp, password: "" },
        defaultSeo: { ...EMPTY.defaultSeo, ...data.defaultSeo },
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: (body: object) => api("/api/v1/admin/settings", { method: "PUT", body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    meta: { success: "Settings saved" },
  });

  const testEmail = useMutation({
    mutationFn: (to: string) => api("/api/v1/admin/settings/test-email", { method: "POST", body: { to } }),
    onSuccess: () => setTestMsg("Sent — check the inbox."),
    onError: (e) => setTestMsg(e instanceof ApiError ? e.message : "Test failed"),
     meta: { silent: true },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await save.mutateAsync(form);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    }
  }

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm((f) => ({ ...f, [k]: v }));

  if (!isAdmin) {
    return (
      <AdminLayout title="Settings">
        <div className="rounded-xl border border-border p-8 text-center">
          <p className="font-semibold mb-1">Admins only</p>
          <p className="text-muted-foreground text-sm">
            Settings hold live credentials and site-wide switches.
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) return <AdminLayout title="Settings"><p className="text-muted-foreground">Loading…</p></AdminLayout>;

  return (
    <AdminLayout
      title="Settings"
      actions={saved && <span className="text-primary text-sm font-medium">Saved ✓</span>}
    >
      <div className="flex gap-1 mb-6 border-b border-border">
        {/* Link, not <a> — a raw href would full-page reload and drop the
            in-memory access token, forcing a silent refresh round trip. */}
        {TABS.map((t) => (
          <Link
            key={t.slug}
            href={`/admin/settings/${t.slug}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.slug
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
        {error && (
          <div role="alert" className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {tab === "general" && (
          <>
            <Card title="Site">
              <Field label="Site name"><Text value={form.siteName} onChange={(v) => set("siteName", v)} /></Field>
              <Check checked={form.maintenanceMode} onChange={(v) => set("maintenanceMode", v)}
                label="Maintenance mode (public site shows a holding page)" />
            </Card>

            <Card title="Contact">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email"><Text value={form.contact.email} onChange={(v) => set("contact", { ...form.contact, email: v })} /></Field>
                <Field label="Phone"><Text value={form.contact.phone} onChange={(v) => set("contact", { ...form.contact, phone: v })} /></Field>
              </div>
              <Field label="Address"><Area value={form.contact.address} onChange={(v) => set("contact", { ...form.contact, address: v })} rows={2} /></Field>
            </Card>

            <Card title="Social links">
              <div className="grid sm:grid-cols-2 gap-4">
                {(Object.keys(form.socials) as (keyof Settings["socials"])[]).map((k) => (
                  <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                    <Text value={form.socials[k]} onChange={(v) => set("socials", { ...form.socials, [k]: v })} placeholder="https://…" />
                  </Field>
                ))}
              </div>
            </Card>

            <Card title="Default SEO">
              <Field label="Meta title"><Text value={form.defaultSeo.metaTitle} onChange={(v) => set("defaultSeo", { ...form.defaultSeo, metaTitle: v })} maxLength={70} /></Field>
              <Field label="Meta description"><Area value={form.defaultSeo.metaDescription} onChange={(v) => set("defaultSeo", { ...form.defaultSeo, metaDescription: v })} rows={2} maxLength={170} /></Field>
            </Card>
          </>
        )}

        {tab === "menus" && (
          <Card title="Navigation">
            <MenuEditor label="Header menu" items={form.headerMenu} disabled={!canEdit} onChange={(v) => set("headerMenu", v)} />
            <div className="pt-4 border-t border-border">
              <MenuEditor label="Footer menu" items={form.footerMenu} disabled={!canEdit} onChange={(v) => set("footerMenu", v)} />
            </div>
          </Card>
        )}

        {tab === "email" && (
          <>
            <Card title="SMTP">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Host"><Text value={form.smtp.host} onChange={(v) => set("smtp", { ...form.smtp, host: v })} placeholder="smtp.gmail.com" /></Field>
                <Field label="Port"><Num value={form.smtp.port} onChange={(v) => set("smtp", { ...form.smtp, port: v })} /></Field>
              </div>
              <Check checked={form.smtp.secure} onChange={(v) => set("smtp", { ...form.smtp, secure: v })} label="Use TLS (port 465)" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Username"><Text value={form.smtp.user} onChange={(v) => set("smtp", { ...form.smtp, user: v })} /></Field>
                <Field
                  label="Password"
                  hint={data?.smtp?.passwordSet ? "A password is saved. Leave blank to keep it." : "Not set."}
                >
                  <input
                    type="password"
                    value={form.smtp.password}
                    onChange={(e) => set("smtp", { ...form.smtp, password: e.target.value })}
                    placeholder={data?.smtp?.passwordSet ? "•••••••• (unchanged)" : ""}
                    autoComplete="new-password"
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="From name"><Text value={form.smtp.fromName} onChange={(v) => set("smtp", { ...form.smtp, fromName: v })} /></Field>
                <Field label="From email"><Text value={form.smtp.fromEmail} onChange={(v) => set("smtp", { ...form.smtp, fromEmail: v })} /></Field>
              </div>
            </Card>

            <Card title="Lead notifications">
              <Check checked={form.smtp.notifyOnLead} onChange={(v) => set("smtp", { ...form.smtp, notifyOnLead: v })}
                label="Email me when a new contact form is submitted" />
              <Field label="Notify to" hint="Falls back to the contact email if blank.">
                <Text value={form.smtp.notifyTo} onChange={(v) => set("smtp", { ...form.smtp, notifyTo: v })} />
              </Field>
            </Card>

            <Card title="Test">
              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex-1 min-w-[200px]">
                  <Field label="Send a test email to"><Text value={testTo} onChange={setTestTo} placeholder="you@example.com" /></Field>
                </div>
                <button
                  type="button"
                  onClick={() => { setTestMsg(null); testEmail.mutate(testTo); }}
                  disabled={!testTo || testEmail.isPending}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-50"
                >
                  {testEmail.isPending ? <Loader2 size={15} className="animate-spin" /> : <MailCheck size={15} />}
                  Send test
                </button>
              </div>
              {testMsg && <p className="text-xs text-muted-foreground">{testMsg}</p>}
              <p className="text-xs text-muted-foreground">Save your SMTP settings before testing.</p>
            </Card>
          </>
        )}

        {tab === "backup" && (
          <Card title="Backup">
            <div className="flex gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
              <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Use your database provider's backups.</p>
                <p className="text-muted-foreground">
                  MongoDB Atlas takes automated snapshots with point-in-time restore — more reliable
                  than anything triggered from this panel, and it survives the server being down.
                  For a local database, schedule <code className="font-mono text-xs">mongodump</code> via cron.
                </p>
              </div>
            </div>
          </Card>
        )}

        {tab !== "backup" && (
          canEdit ? (
            <button type="submit" disabled={save.isPending}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-60">
              {save.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {save.isPending ? "Saving…" : "Save settings"}
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">Your account is read-only.</p>
          )
        )}
      </form>
    </AdminLayout>
  );
}
