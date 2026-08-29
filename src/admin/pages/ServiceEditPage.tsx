import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { ApiError, api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";

type Form = {
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  order: number;
  featured: boolean;
  status: "draft" | "published" | "scheduled" | "archived";
  seo: { metaTitle: string; metaDescription: string; noIndex: boolean };
};

const EMPTY: Form = {
  title: "", slug: "", icon: "", shortDescription: "", fullDescription: "",
  order: 0, featured: false, status: "published",
  seo: { metaTitle: "", metaDescription: "", noIndex: false },
};

export default function ServiceEditPage({ id }: { id?: string }) {
  const isNew = !id || id === "new";
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const [, navigate] = useLocation();

  const [form, setForm] = useState<Form>(EMPTY);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => api<{ data: Form }>(`/api/v1/admin/services/${id}`).then((r) => r.data),
    enabled: !isNew,
  });

  useEffect(() => {
    if (data) setForm({ ...EMPTY, ...data, seo: { ...EMPTY.seo, ...data.seo } });
  }, [data]);

  const save = useMutation({
    mutationFn: (body: Form) =>
      isNew
        ? api<{ data: { _id: string } }>("/api/v1/admin/services", { method: "POST", body })
        : api<{ data: { _id: string } }>(`/api/v1/admin/services/${id}`, { method: "PATCH", body }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["service", id] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      navigate(`/admin/services/${res.data._id}`);
    },
    meta: { success: "Service saved" },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFields({});
    try {
      // Slug is server-derived when blank — don't send an empty string.
      const body = { ...form, slug: form.slug || undefined } as Form;
      await save.mutateAsync(body);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFields(err.fields);
        if (err.payload.code === "CONFLICT") {
          setError("Someone else changed this since you opened it. Reload before saving.");
        }
      } else setError("Save failed. Is the API running?");
    }
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  if (!isNew && isLoading) {
    return (
      <AdminLayout title="Service">
        <p className="text-muted-foreground">Loading…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isNew ? "New service" : form.title || "Edit service"}
      actions={
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted"
        >
          <ArrowLeft size={15} /> Back
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
        {error && (
          <div role="alert" className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
            {fields.title && <p className="text-destructive text-xs mt-1">{fields.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder={isNew ? "auto-generated from title" : ""}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Changing a published slug breaks its existing links until redirects ship (Phase 6).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Short description</label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              rows={2}
              maxLength={400}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-none focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Full description</label>
            <textarea
              value={form.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
              rows={8}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono resize-y focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              HTML is sanitized server-side. Rich text editor arrives in Phase 4.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as Form["status"])}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Order</label>
            <input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => set("order", Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <label className="flex items-center gap-2 sm:pt-7 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            Featured on homepage
          </label>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-semibold text-sm">SEO</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5">Meta title</label>
            <input
              value={form.seo.metaTitle}
              onChange={(e) => set("seo", { ...form.seo, metaTitle: e.target.value })}
              maxLength={70}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">{form.seo.metaTitle.length}/70</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Meta description</label>
            <textarea
              value={form.seo.metaDescription}
              onChange={(e) => set("seo", { ...form.seo, metaDescription: e.target.value })}
              rows={2}
              maxLength={170}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-none focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">{form.seo.metaDescription.length}/170</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.seo.noIndex}
              onChange={(e) => set("seo", { ...form.seo, noIndex: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            Hide from search engines (noindex)
          </label>
        </section>

        {canEdit ? (
          <button
            type="submit"
            disabled={save.isPending}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-60"
          >
            {save.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {save.isPending ? "Saving…" : "Save service"}
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">Your account is read-only.</p>
        )}
      </form>
    </AdminLayout>
  );
}
