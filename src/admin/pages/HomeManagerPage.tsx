import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Plus, X, GripVertical } from "lucide-react";
import { ApiError, api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { Area, Card, Field, Text } from "../components/FormKit";

type Ref = { _id: string; title?: string; clientName?: string; company?: string };
type Stat = { label: string; value: string; suffix: string };
type Home = {
  hero: { headline: string; subheadline: string; ctaText: string; ctaUrl: string };
  featuredServices: Ref[];
  featuredProjects: Ref[];
  featuredTestimonials: Ref[];
  stats: Stat[];
};

const EMPTY: Home = {
  hero: { headline: "", subheadline: "", ctaText: "", ctaUrl: "" },
  featuredServices: [], featuredProjects: [], featuredTestimonials: [], stats: [],
};

const labelOf = (r: Ref) => r.title ?? r.clientName ?? r._id;

/**
 * Mirrors HeroSection's line splitting exactly, so the preview cannot drift
 * from what the site actually renders.
 */
function previewLines(headline: string): string[] {
  const raw = headline.trim();
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) return lines;

  const words = raw.split(/\s+/);
  if (words.length < 2) return [raw];
  return [words.slice(0, -1).join(" "), words[words.length - 1]];
}

/**
 * Featured picker. Array order IS display order, so moving an item up/down
 * is the reorder — no separate order field to keep in sync.
 */
function Picker({
  label, selected, options, onChange, disabled,
}: {
  label: string; selected: Ref[]; options: Ref[];
  onChange: (v: Ref[]) => void; disabled: boolean;
}) {
  const available = options.filter((o) => !selected.some((s) => s._id === o._id));

  const move = (i: number, dir: -1 | 1) => {
    const next = [...selected];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>

      <div className="space-y-1.5 mb-2">
        {selected.length === 0 && (
          <p className="text-xs text-muted-foreground py-2">None selected.</p>
        )}
        {selected.map((s, i) => (
          <div key={s._id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
            <GripVertical size={14} className="text-muted-foreground/50 shrink-0" />
            <span className="text-sm flex-1 truncate">{labelOf(s)}</span>
            <span className="text-xs text-muted-foreground font-mono">{i + 1}</span>
            {!disabled && (
              <>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  className="px-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === selected.length - 1}
                  className="px-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move down">↓</button>
                <button type="button" onClick={() => onChange(selected.filter((x) => x._id !== s._id))}
                  className="p-1 rounded text-muted-foreground hover:text-destructive" aria-label={`Remove ${labelOf(s)}`}>
                  <X size={13} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {!disabled && available.length > 0 && (
        <select
          value=""
          onChange={(e) => {
            const pick = available.find((o) => o._id === e.target.value);
            if (pick) onChange([...selected, pick]);
          }}
          className="h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
        >
          <option value="">+ Add…</option>
          {available.map((o) => (
            <option key={o._id} value={o._id}>{labelOf(o)}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default function HomeManagerPage() {
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState<Home>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: () => api<{ data: Home }>("/api/v1/admin/home").then((r) => r.data),
  });

  const lists = useQuery({
    queryKey: ["home-options"],
    queryFn: async () => {
      const [s, p, t] = await Promise.all([
        api<{ data: Ref[] }>("/api/v1/admin/services?limit=100"),
        api<{ data: Ref[] }>("/api/v1/admin/projects?limit=100"),
        api<{ data: Ref[] }>("/api/v1/admin/testimonials?limit=100&approvalStatus=approved"),
      ]);
      return { services: s.data, projects: p.data, testimonials: t.data };
    },
  });

  useEffect(() => {
    if (data) setForm({ ...EMPTY, ...data, hero: { ...EMPTY.hero, ...data.hero } });
  }, [data]);

  const save = useMutation({
    mutationFn: (body: object) => api("/api/v1/admin/home", { method: "PUT", body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["home"] });
      qc.invalidateQueries({ queryKey: ["cms"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    meta: { success: "Home page saved" },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      // Send ids only — the API populates objects on read but expects refs on write.
      await save.mutateAsync({
        hero: form.hero,
        featuredServices: form.featuredServices.map((r) => r._id),
        featuredProjects: form.featuredProjects.map((r) => r._id),
        featuredTestimonials: form.featuredTestimonials.map((r) => r._id),
        stats: form.stats,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    }
  }

  if (isLoading) return <AdminLayout title="Home Page"><p className="text-muted-foreground">Loading…</p></AdminLayout>;

  return (
    <AdminLayout
      title="Home Page"
      actions={saved && <span className="text-primary text-sm font-medium">Saved ✓</span>}
    >
      <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
        {error && (
          <div role="alert" className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        <Card title="Hero">
          <Field
            label="Headline"
            hint="One line per row — the last row is shown in the accent colour."
          >
            {/* Textarea, not an input: line breaks are meaningful here. */}
            <Area
              value={form.hero.headline}
              onChange={(v) => setForm((f) => ({ ...f, hero: { ...f.hero, headline: v } }))}
              rows={3}
            />
          </Field>

          {/* Live preview: shows the real line breaks and accent before saving,
              so the layout is never a surprise on the public site. */}
          {form.hero.headline.trim() && (
            <div className="rounded-lg border border-border bg-background px-4 py-3">
              <div className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground mb-2">
                Preview
              </div>
              <div className="font-display font-bold text-xl leading-[1.15]">
                {previewLines(form.hero.headline).map((line, i, arr) => (
                  <div key={i} className={i === arr.length - 1 ? "text-primary" : ""}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
          <Field label="Subheadline">
            <Area value={form.hero.subheadline} onChange={(v) => setForm((f) => ({ ...f, hero: { ...f.hero, subheadline: v } }))} rows={2} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CTA text">
              <Text value={form.hero.ctaText} onChange={(v) => setForm((f) => ({ ...f, hero: { ...f.hero, ctaText: v } }))} />
            </Field>
            <Field label="CTA link">
              <Text value={form.hero.ctaUrl} onChange={(v) => setForm((f) => ({ ...f, hero: { ...f.hero, ctaUrl: v } }))} placeholder="/contact" />
            </Field>
          </div>
        </Card>

        <Card title="Featured content">
          <p className="text-xs text-muted-foreground -mt-2">Order here is the display order.</p>
          <Picker label="Services" selected={form.featuredServices} options={lists.data?.services ?? []}
            onChange={(v) => setForm((f) => ({ ...f, featuredServices: v }))} disabled={!canEdit} />
          <Picker label="Projects" selected={form.featuredProjects} options={lists.data?.projects ?? []}
            onChange={(v) => setForm((f) => ({ ...f, featuredProjects: v }))} disabled={!canEdit} />
          <Picker label="Testimonials (approved only)" selected={form.featuredTestimonials} options={lists.data?.testimonials ?? []}
            onChange={(v) => setForm((f) => ({ ...f, featuredTestimonials: v }))} disabled={!canEdit} />
        </Card>

        <Card title="Stats / counters">
          <div className="space-y-2">
            {form.stats.map((s, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input value={s.label} placeholder="Years in business"
                  onChange={(e) => setForm((f) => { const n = [...f.stats]; n[i] = { ...n[i], label: e.target.value }; return { ...f, stats: n }; })}
                  className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary" />
                <input value={s.value} placeholder="25"
                  onChange={(e) => setForm((f) => { const n = [...f.stats]; n[i] = { ...n[i], value: e.target.value }; return { ...f, stats: n }; })}
                  className="w-20 h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary" />
                <input value={s.suffix} placeholder="+"
                  onChange={(e) => setForm((f) => { const n = [...f.stats]; n[i] = { ...n[i], suffix: e.target.value }; return { ...f, stats: n }; })}
                  className="w-14 h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary" />
                {canEdit && (
                  <button type="button" onClick={() => setForm((f) => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }))}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive" aria-label="Remove stat">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {canEdit && form.stats.length < 8 && (
            <button type="button"
              onClick={() => setForm((f) => ({ ...f, stats: [...f.stats, { label: "", value: "", suffix: "" }] }))}
              className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
              <Plus size={14} /> Add stat
            </button>
          )}
        </Card>

        {canEdit ? (
          <button type="submit" disabled={save.isPending}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-60">
            {save.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {save.isPending ? "Saving…" : "Save home page"}
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">Your account is read-only.</p>
        )}
      </form>
    </AdminLayout>
  );
}
