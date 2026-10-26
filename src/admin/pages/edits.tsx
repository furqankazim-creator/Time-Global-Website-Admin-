import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { ApiError, api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { Area, Card, Check, Field, Num, Select, TagsInput, Text } from "../components/FormKit";
import { MediaPicker } from "../components/MediaPicker";
import { RichTextEditor } from "../components/RichTextEditor";

/**
 * Shared edit-screen engine: load, save, field errors, concurrency conflicts.
 * Each module supplies only its own fields.
 */
/** "projects" -> "Project", for the save confirmation. */
const singular = (r: string) =>
  r.replace(/ies$/, "y").replace(/s$/, "").replace(/^./, (c) => c.toUpperCase());

function useResourceForm<T extends object>(resource: string, id: string | undefined, empty: T) {
  const isNew = !id || id === "new";
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  const [form, setForm] = useState<T>(empty);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [resource, id],
    queryFn: () => api<{ data: T }>(`/api/v1/admin/${resource}/${id}`).then((r) => r.data),
    enabled: !isNew,
  });

  useEffect(() => {
    if (data) setForm({ ...empty, ...data });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useMutation({
    mutationFn: (body: T) =>
      isNew
        ? api<{ data: { _id: string } }>(`/api/v1/admin/${resource}`, { method: "POST", body })
        : api<{ data: { _id: string } }>(`/api/v1/admin/${resource}/${id}`, { method: "PATCH", body }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: [resource] });
      qc.invalidateQueries({ queryKey: ["cms"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      try {
        localStorage.setItem("tg_cms_updated_at", String(Date.now()));
      } catch {}
      navigate(`/admin/${resource}/${res.data._id}`);
    },
    meta: { success: resource === "projects" ? "Case study saved" : `${singular(resource)} saved` },
  });

  const submit = async (e: FormEvent, transform?: (f: T) => object) => {
    e.preventDefault();
    setError(null);
    setFields({});
    try {
      await save.mutateAsync((transform ? transform(form) : form) as T);
    } catch (err) {
      if (err instanceof ApiError) {
        setFields(err.fields);
        setError(
          err.payload.code === "CONFLICT"
            ? "Someone else changed this since you opened it. Reload before saving."
            : err.message
        );
      } else setError("Save failed. Is the API running?");
    }
  };

  const set = <K extends keyof T>(k: K, v: T[K]) => setForm((f) => ({ ...f, [k]: v }));

  return { isNew, form, set, setForm, fields, error, save, submit, isLoading };
}

function EditShell({
  title, resource, saving, canEdit, error, children, onSubmit,
}: {
  title: string; resource: string; saving: boolean; canEdit: boolean;
  error: string | null; children: ReactNode; onSubmit: (e: FormEvent) => void;
}) {
  return (
    <AdminLayout
      title={title}
      actions={
        <Link
          href={`/admin/${resource}`}
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
        {children}
        {canEdit ? (
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save"}
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">Your account is read-only.</p>
        )}
      </form>
    </AdminLayout>
  );
}

/**
 * The API returns populated media objects on read but expects an id on write.
 * Every edit form goes through this rather than repeating the check.
 */
const mediaId = (v: unknown): string | null =>
  typeof v === "object" && v !== null ? ((v as { _id: string })._id ?? null) : ((v as string) || null);

const STATUS_OPTS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

/* ----------------------------- Project -------------------------------- */
type Metric = { value: string; label: string };
type ProjectForm = {
  title: string; slug: string; client: string; category: string;
  problem: string; solution: string; result: string; techStack: string[];
  metrics: Metric[];
  liveUrl: string; featured: boolean; order: number; status: string;
  coverImage: string | { _id: string; url: string; alt: string } | null; clientLogo: string | { _id: string; url: string; alt: string } | null;
};
const EMPTY_PROJECT: ProjectForm = {
  title: "", slug: "", client: "", category: "web", problem: "", solution: "",
  result: "", techStack: [], metrics: [], liveUrl: "", featured: false, order: 0, status: "published",
  coverImage: null, clientLogo: null,
};

export function ProjectEditPage({ id }: { id?: string }) {
  const { canEdit } = useAuth();
  const f = useResourceForm<ProjectForm>("projects", id, EMPTY_PROJECT);
  if (!f.isNew && f.isLoading) return <AdminLayout title="Case Study"><p className="text-muted-foreground">Loading…</p></AdminLayout>;

  return (
    <EditShell
      title={f.isNew ? "New Case Study" : f.form.title || "Edit Case Study"}
      resource="projects"
      saving={f.save.isPending}
      canEdit={canEdit}
      error={f.error}
      // Send ids, not the populated objects the API returns on read.
      onSubmit={(e) =>
        f.submit(e, (v) => ({
          ...v,
          slug: v.slug || undefined,
          coverImage: mediaId(v.coverImage),
          clientLogo: mediaId(v.clientLogo),
        }))
      }
    >
      <Card>
        <Field label="Title" required error={f.fields.title}>
          <Text value={f.form.title} onChange={(v) => f.set("title", v)} required />
        </Field>
        <Field label="Slug" hint={f.isNew ? "Auto-generated from title" : "Changing a live slug breaks its links"}>
          <Text value={f.form.slug} onChange={(v) => f.set("slug", v)} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Client" error={f.fields.client}>
            <Text value={f.form.client} onChange={(v) => f.set("client", v)} />
          </Field>
          <Field label="Category">
            <Select
              value={f.form.category}
              onChange={(v) => f.set("category", v)}
              options={[
                { value: "web", label: "Web" },
                { value: "mobile", label: "Mobile" },
                { value: "custom-software", label: "Custom software" },
                { value: "ecommerce", label: "E-commerce" },
              ]}
            />
          </Field>
        </div>
        <Field label="Tech stack" hint="Comma separated">
          <TagsInput value={f.form.techStack} onChange={(v) => f.set("techStack", v)} placeholder="React, Node.js, MongoDB" />
        </Field>
        <Field label="Live URL" error={f.fields.liveUrl}>
          <Text value={f.form.liveUrl} onChange={(v) => f.set("liveUrl", v)} placeholder="https://…" />
        </Field>

        {/* Headline outcomes — these are what make the case-study card land */}
        <Field label="Key metrics" hint="Shown on the portfolio card. Three works best.">
          <div className="space-y-2">
            {f.form.metrics.map((m, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  value={m.value}
                  placeholder="42%"
                  onChange={(e) => {
                    const n = [...f.form.metrics];
                    n[i] = { ...n[i], value: e.target.value };
                    f.set("metrics", n);
                  }}
                  className="w-28 h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
                <input
                  value={m.label}
                  placeholder="Cost Reduction"
                  onChange={(e) => {
                    const n = [...f.form.metrics];
                    n[i] = { ...n[i], label: e.target.value };
                    f.set("metrics", n);
                  }}
                  className="flex-1 h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => f.set("metrics", f.form.metrics.filter((_, j) => j !== i))}
                  className="h-10 px-3 rounded-lg text-muted-foreground hover:text-destructive"
                  aria-label="Remove metric"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {f.form.metrics.length < 6 && (
            <button
              type="button"
              onClick={() => f.set("metrics", [...f.form.metrics, { value: "", label: "" }])}
              className="mt-2 text-sm text-primary font-medium hover:underline"
            >
              + Add metric
            </button>
          )}
        </Field>
      </Card>

      <Card title="Images">
        <div className="grid sm:grid-cols-2 gap-6">
          <MediaPicker
            label="Cover image"
            value={f.form.coverImage}
            onChange={(v) => f.set("coverImage", v)}
            folder="projects"
            hint="Shown on the work grid and case study header."
          />
          <MediaPicker
            label="Client logo"
            value={f.form.clientLogo}
            onChange={(v) => f.set("clientLogo", v)}
            folder="logos"
            hint="Optional. Transparent PNG preferred."
          />
        </div>
      </Card>

      <Card title="Case study">
        <Field label="Problem"><Area value={f.form.problem} onChange={(v) => f.set("problem", v)} mono /></Field>
        <Field label="Solution"><Area value={f.form.solution} onChange={(v) => f.set("solution", v)} mono /></Field>
        <Field label="Result"><Area value={f.form.result} onChange={(v) => f.set("result", v)} mono /></Field>
        <p className="text-xs text-muted-foreground">HTML is sanitized server-side.</p>
      </Card>

      <Card>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Status"><Select value={f.form.status} onChange={(v) => f.set("status", v)} options={STATUS_OPTS} /></Field>
          <Field label="Order"><Num value={f.form.order} onChange={(v) => f.set("order", v)} min={0} /></Field>
          <div className="sm:pt-7">
            <Check checked={f.form.featured} onChange={(v) => f.set("featured", v)} label="Featured on homepage" />
          </div>
        </div>
      </Card>
    </EditShell>
  );
}

/* ------------------------------- Post --------------------------------- */
type PostForm = {
  title: string; slug: string; excerpt: string; content: string;
  category: string | null; status: string; publishedAt: string | null;
  featuredImage: string | { _id: string; url: string; alt: string } | null;
};
const EMPTY_POST: PostForm = {
  title: "", slug: "", excerpt: "", content: "", category: null, status: "published", publishedAt: null,
  featuredImage: null,
};

export function PostEditPage({ id }: { id?: string }) {
  const { canEdit } = useAuth();
  const f = useResourceForm<PostForm>("posts", id, EMPTY_POST);
  const { data: cats } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api<{ data: { _id: string; name: string }[] }>("/api/v1/admin/categories").then((r) => r.data),
  });

  if (!f.isNew && f.isLoading) return <AdminLayout title="Post"><p className="text-muted-foreground">Loading…</p></AdminLayout>;

  return (
    <EditShell
      title={f.isNew ? "New post" : f.form.title || "Edit post"}
      resource="posts"
      saving={f.save.isPending}
      canEdit={canEdit}
      error={f.error}
      onSubmit={(e) =>
        f.submit(e, (v) => ({
          ...v,
          slug: v.slug || undefined,
          // A populated category comes back as an object; send just the id.
          category: typeof v.category === "object" && v.category ? (v.category as any)._id : v.category || null,
          featuredImage: mediaId(v.featuredImage),
        }))
      }
    >
      <Card>
        <Field label="Title" required error={f.fields.title}>
          <Text value={f.form.title} onChange={(v) => f.set("title", v)} required />
        </Field>
        <Field label="Slug" hint={f.isNew ? "Auto-generated from title" : undefined}>
          <Text value={f.form.slug} onChange={(v) => f.set("slug", v)} />
        </Field>
        <Field label="Excerpt"><Area value={f.form.excerpt} onChange={(v) => f.set("excerpt", v)} rows={2} /></Field>
        <div className="pt-2">
          <RichTextEditor
            label="Post Content"
            value={f.form.content}
            onChange={(v) => f.set("content", v)}
            rows={14}
            placeholder="Write the full blog post content here..."
          />
        </div>
        <MediaPicker
          label="Featured image"
          value={f.form.featuredImage}
          onChange={(v) => f.set("featuredImage", v)}
          folder="blog"
          hint="Used on the blog grid and as the social preview."
        />
      </Card>

      <Card>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Category">
            <Select
              value={
                typeof f.form.category === "object" && f.form.category
                  ? (f.form.category as any)._id
                  : f.form.category ?? ""
              }
              onChange={(v) => f.set("category", v || null)}
              options={[{ value: "", label: "— none —" }, ...(cats ?? []).map((c) => ({ value: c._id, label: c.name }))]}
            />
          </Field>
          <Field label="Status"><Select value={f.form.status} onChange={(v) => f.set("status", v)} options={STATUS_OPTS} /></Field>
          <Field label="Publish date" hint="Required for 'scheduled'">
            <input
              type="datetime-local"
              value={f.form.publishedAt ? new Date(f.form.publishedAt).toISOString().slice(0, 16) : ""}
              onChange={(e) => f.set("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
          </Field>
        </div>
      </Card>
    </EditShell>
  );
}

/* --------------------------- Testimonial ------------------------------ */
type TestimonialForm = {
  clientName: string; company: string; position: string; quote: string;
  rating: number; caseStudyUrl: string; featured: boolean; order: number;
  approvalStatus: string;
  photo: string | { _id: string; url: string; alt: string } | null;
  companyLogo: string | { _id: string; url: string; alt: string } | null;
};
const EMPTY_TESTIMONIAL: TestimonialForm = {
  clientName: "", company: "", position: "", quote: "", rating: 5,
  caseStudyUrl: "", featured: false, order: 0, approvalStatus: "approved",
  photo: null, companyLogo: null,
};

/** Mirrors the server's bounds so the counter can't disagree with validation. */
const QUOTE_MIN_WORDS = 8;
const QUOTE_MAX_WORDS = 40;
const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function TestimonialEditPage({ id }: { id?: string }) {
  const { canEdit } = useAuth();
  const f = useResourceForm<TestimonialForm>("testimonials", id, EMPTY_TESTIMONIAL);
  if (!f.isNew && f.isLoading) return <AdminLayout title="Testimonial"><p className="text-muted-foreground">Loading…</p></AdminLayout>;

  const words = countWords(f.form.quote);
  const tooLong = words > QUOTE_MAX_WORDS;
  const tooShort = words > 0 && words < QUOTE_MIN_WORDS;

  return (
    <EditShell
      title={f.isNew ? "New testimonial" : f.form.clientName || "Edit testimonial"}
      resource="testimonials"
      saving={f.save.isPending}
      canEdit={canEdit}
      error={f.error}
      // Send ids, not the populated objects the API returns on read.
      onSubmit={(e) =>
        f.submit(e, (v) => ({
          ...v,
          photo: mediaId(v.photo),
          companyLogo: mediaId(v.companyLogo),
        }))
      }
    >
      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Client name" required error={f.fields.clientName}>
            <Text value={f.form.clientName} onChange={(v) => f.set("clientName", v)} required />
          </Field>
          <Field label="Company"><Text value={f.form.company} onChange={(v) => f.set("company", v)} /></Field>
        </div>
        <Field label="Position"><Text value={f.form.position} onChange={(v) => f.set("position", v)} /></Field>

        <Field label="Quote" required error={f.fields.quote} hint="Plain text — no HTML.">
          <Area value={f.form.quote} onChange={(v) => f.set("quote", v)} rows={5} />
          {/* Bounds keep every carousel card the same height — a 6-word quote
              beside a 300-word one is what makes the row look broken. */}
          <div className="flex items-center justify-between mt-1.5">
            <span
              className={`text-xs font-mono ${
                tooLong || tooShort ? "text-destructive font-semibold" : "text-muted-foreground"
              }`}
            >
              {words} / {QUOTE_MAX_WORDS} words
            </span>
            <span className="text-xs text-muted-foreground">
              {tooLong
                ? `Trim ${words - QUOTE_MAX_WORDS} word${words - QUOTE_MAX_WORDS === 1 ? "" : "s"}`
                : tooShort
                ? `At least ${QUOTE_MIN_WORDS} words`
                : "Aim for 20–35 words"}
            </span>
          </div>
          <div className="h-1 rounded-full bg-muted mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all ${tooLong ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${Math.min(100, (words / QUOTE_MAX_WORDS) * 100)}%` }}
            />
          </div>
        </Field>
        <Field label="Case study URL" error={f.fields.caseStudyUrl}>
          <Text value={f.form.caseStudyUrl} onChange={(v) => f.set("caseStudyUrl", v)} placeholder="https://…" />
        </Field>
      </Card>

      <Card title="Images">
        <div className="grid sm:grid-cols-2 gap-6">
          <MediaPicker
            label="Client photo"
            value={f.form.photo}
            onChange={(v) => f.set("photo", v)}
            folder="testimonials"
            hint="Square works best — shown as a small avatar."
          />
          <MediaPicker
            label="Company logo"
            value={f.form.companyLogo}
            onChange={(v) => f.set("companyLogo", v)}
            folder="logos"
            hint="Optional. Transparent PNG preferred."
          />
        </div>
      </Card>

      <Card>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Rating">
            <Select
              value={String(f.form.rating)}
              onChange={(v) => f.set("rating", Number(v))}
              options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? "s" : ""}` }))}
            />
          </Field>
          <Field label="Approval">
            <Select
              value={f.form.approvalStatus}
              onChange={(v) => f.set("approvalStatus", v)}
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ]}
            />
          </Field>
          <Field label="Order"><Num value={f.form.order} onChange={(v) => f.set("order", v)} min={0} /></Field>
        </div>
        <Check checked={f.form.featured} onChange={(v) => f.set("featured", v)} label="Featured on homepage" />
      </Card>
    </EditShell>
  );
}

/* ------------------------------- Team --------------------------------- */
type TeamForm = {
  name: string; role: string; bio: string; department: string; order: number;
  status: string; socials: { linkedin: string; twitter: string; github: string; website: string };
  photo: string | { _id: string; url: string; alt: string } | null;
};
const EMPTY_TEAM: TeamForm = {
  name: "", role: "", bio: "", department: "development", order: 0, status: "published",
  socials: { linkedin: "", twitter: "", github: "", website: "" },
  photo: null,
};

export function TeamEditPage({ id }: { id?: string }) {
  const { canEdit } = useAuth();
  const f = useResourceForm<TeamForm>("team", id, EMPTY_TEAM);
  if (!f.isNew && f.isLoading) return <AdminLayout title="Team member"><p className="text-muted-foreground">Loading…</p></AdminLayout>;

  // Same bounds as testimonial quotes — the bio renders as a quote card.
  const bioText = f.form.bio.replace(/<[^>]+>/g, " ").trim();
  const bioWords = countWords(bioText);
  const bioTooLong = bioWords > QUOTE_MAX_WORDS;
  const bioTooShort = bioWords > 0 && bioWords < QUOTE_MIN_WORDS;

  const social = (k: keyof TeamForm["socials"], label: string) => (
    <Field label={label} error={f.fields[`socials.${k}`]}>
      <Text value={f.form.socials[k]} onChange={(v) => f.set("socials", { ...f.form.socials, [k]: v })} placeholder="https://…" />
    </Field>
  );

  return (
    <EditShell
      title={f.isNew ? "New team member" : f.form.name || "Edit member"}
      resource="team"
      saving={f.save.isPending}
      canEdit={canEdit}
      error={f.error}
      onSubmit={(e) => f.submit(e)}
    >
      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name" required error={f.fields.name}>
            <Text value={f.form.name} onChange={(v) => f.set("name", v)} required />
          </Field>
          <Field label="Role"><Text value={f.form.role} onChange={(v) => f.set("role", v)} /></Field>
        </div>
        <Field
          label="Bio"
          error={f.fields.bio}
          hint={'Shown as this person\u2019s quote in "Life at Time Global" on the Careers page. Leave blank for a neutral default.'}
        >
          <Area value={f.form.bio} onChange={(v) => f.set("bio", v)} rows={5} mono />
          <div className="flex items-center justify-between mt-1.5">
            <span className={`text-xs font-mono ${bioTooLong || bioTooShort ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
              {bioWords} / {QUOTE_MAX_WORDS} words
            </span>
            <span className="text-xs text-muted-foreground">
              {bioTooLong
                ? `Trim ${bioWords - QUOTE_MAX_WORDS} word${bioWords - QUOTE_MAX_WORDS === 1 ? "" : "s"}`
                : bioTooShort
                ? `At least ${QUOTE_MIN_WORDS} words (or leave blank)`
                : "Aim for 20\u201335 words"}
            </span>
          </div>
          <div className="h-1 rounded-full bg-muted mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all ${bioTooLong ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${Math.min(100, (bioWords / QUOTE_MAX_WORDS) * 100)}%` }}
            />
          </div>
        </Field>
        <MediaPicker
          label="Photo"
          value={f.form.photo}
          onChange={(v) => f.set("photo", v)}
          folder="team"
          hint="Square headshot works best."
        />
      </Card>

      <Card title="Social links">
        <div className="grid sm:grid-cols-2 gap-4">
          {social("linkedin", "LinkedIn")}
          {social("twitter", "Twitter / X")}
          {social("github", "GitHub")}
          {social("website", "Website")}
        </div>
      </Card>

      <Card>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Department">
            <Select
              value={f.form.department}
              onChange={(v) => f.set("department", v)}
              options={[
                { value: "design", label: "Design" },
                { value: "development", label: "Development" },
                { value: "marketing", label: "Marketing" },
                { value: "management", label: "Management" },
              ]}
            />
          </Field>
          <Field label="Status">
            <Select
              value={f.form.status}
              onChange={(v) => f.set("status", v)}
              options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]}
            />
          </Field>
          <Field label="Order"><Num value={f.form.order} onChange={(v) => f.set("order", v)} min={0} /></Field>
        </div>
      </Card>
    </EditShell>
  );
}

/* -------------------------------- Job ---------------------------------- */
type JobForm = {
  title: string; slug: string; department: string; location: string;
  type: string; description: string; applyEmail: string; status: string;
  closesAt: string | null; order: number;
};
const EMPTY_JOB: JobForm = {
  title: "", slug: "", department: "development", location: "Remote",
  type: "full-time", description: "", applyEmail: "", status: "published",
  closesAt: null, order: 0,
};

export function JobEditPage({ id }: { id?: string }) {
  const { canEdit } = useAuth();
  const f = useResourceForm<JobForm>("jobs", id, EMPTY_JOB);
  if (!f.isNew && f.isLoading) return <AdminLayout title="Job"><p className="text-muted-foreground">Loading…</p></AdminLayout>;

  return (
    <EditShell
      title={f.isNew ? "New job posting" : f.form.title || "Edit posting"}
      resource="jobs"
      saving={f.save.isPending}
      canEdit={canEdit}
      error={f.error}
      onSubmit={(e) => f.submit(e, (v) => ({ ...v, slug: v.slug || undefined }))}
    >
      <Card>
        <Field label="Title" required error={f.fields.title}>
          <Text value={f.form.title} onChange={(v) => f.set("title", v)} required placeholder="Senior React Developer" />
        </Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Department">
            <Select
              value={f.form.department}
              onChange={(v) => f.set("department", v)}
              options={[
                { value: "design", label: "Design" },
                { value: "development", label: "Development" },
                { value: "marketing", label: "Marketing" },
                { value: "management", label: "Management" },
              ]}
            />
          </Field>
          <Field label="Type">
            <Select
              value={f.form.type}
              onChange={(v) => f.set("type", v)}
              options={[
                { value: "full-time", label: "Full-time" },
                { value: "part-time", label: "Part-time" },
                { value: "contract", label: "Contract" },
                { value: "internship", label: "Internship" },
              ]}
            />
          </Field>
          <Field label="Location">
            <Text value={f.form.location} onChange={(v) => f.set("location", v)} placeholder="Remote" />
          </Field>
        </div>
        <div className="pt-2">
          <RichTextEditor
            label="Job Description & Requirements"
            value={f.form.description}
            onChange={(v) => f.set("description", v)}
            rows={10}
            placeholder="Describe role responsibilities, qualifications, and perks..."
          />
        </div>
        <Field label="Apply email" error={f.fields.applyEmail} hint="Applications go to this address.">
          <Text value={f.form.applyEmail} onChange={(v) => f.set("applyEmail", v)} placeholder="careers@timeglobaltech.com" />
        </Field>
      </Card>

      <Card>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Status">
            <Select value={f.form.status} onChange={(v) => f.set("status", v)} options={STATUS_OPTS} />
          </Field>
          <Field label="Closes on" hint="Past date retires the posting automatically.">
            <input
              type="date"
              value={f.form.closesAt ? new Date(f.form.closesAt).toISOString().slice(0, 10) : ""}
              onChange={(e) => f.set("closesAt", e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
          </Field>
          <Field label="Order"><Num value={f.form.order} onChange={(v) => f.set("order", v)} min={0} /></Field>
        </div>
      </Card>
    </EditShell>
  );
}

/* -------------------------------- Story ------------------------------- */
type StoryForm = {
  title: string;
  slug: string;
  type: "success" | "lesson";
  tag: string;
  desc: string;
  impact: string;
  lesson: string;
  challenge: string;
  solution: string;
  fix: string;
  color: string;
  image: any;
  imageUrl: string;
  order: number;
  status: "draft" | "published" | "archived";
};

const EMPTY_STORY: StoryForm = {
  title: "",
  slug: "",
  type: "success",
  tag: "",
  desc: "",
  impact: "",
  lesson: "",
  challenge: "",
  solution: "",
  fix: "",
  color: "from-emerald-500/20 to-teal-500/20",
  image: null,
  imageUrl: "",
  order: 0,
  status: "published",
};

const STORY_TYPE_OPTS = [
  { value: "success", label: "Success Story (Win)" },
  { value: "lesson", label: "Hard Lesson (Failure / Wisdom)" },
];

const GRADIENT_PRESETS = [
  { label: "Emerald (Success)", value: "from-emerald-500/20 to-teal-500/20" },
  { label: "Blue / Indigo (Tech)", value: "from-blue-500/20 to-indigo-500/20" },
  { label: "Rose / Orange (Lesson)", value: "from-rose-500/20 to-orange-500/20" },
  { label: "Amber / Yellow (Lesson)", value: "from-amber-500/20 to-yellow-500/20" },
  { label: "Violet / Purple", value: "from-violet-500/20 to-purple-500/20" },
];

export function StoryEditPage({ id }: { id?: string }) {
  const { can } = useAuth();
  const canEdit = can("content:edit");
  const f = useResourceForm<StoryForm>("stories", id, EMPTY_STORY);

  const previewImage = f.form.imageUrl || f.form.image?.url;

  return (
    <EditShell
      title={f.isNew ? "New Story" : `Edit Story: ${f.form.title || ""}`}
      resource="stories"
      saving={f.save.isPending}
      canEdit={canEdit}
      error={f.error}
      onSubmit={(e) =>
        f.submit(e, (v) => ({
          ...v,
          slug: v.slug || undefined,
          // Sync solution/fix and impact/lesson so either field is populated
          solution: v.type === "lesson" ? (v.fix || v.solution) : (v.solution || v.fix),
          fix: v.type === "lesson" ? (v.fix || v.solution) : (v.solution || v.fix),
          impact: v.type === "lesson" ? (v.lesson || v.impact) : (v.impact || v.lesson),
          lesson: v.type === "lesson" ? (v.lesson || v.impact) : (v.impact || v.lesson),
        }))
      }
    >
      <Card title="Story Overview">
        <Field label="Title" required error={f.fields.title}>
          <Text
            value={f.form.title}
            onChange={(v) => {
              f.set("title", v);
              if (f.isNew && !f.form.slug) {
                f.set(
                  "slug",
                  v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                );
              }
            }}
            required
            placeholder="e.g. A Checkout Redesign That Tripled Revenue"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Story Type" required>
            <Select
              value={f.form.type}
              onChange={(v) => {
                const newType = v as "success" | "lesson";
                f.set("type", newType);
                if (newType === "lesson" && f.form.color.includes("emerald")) {
                  f.set("color", "from-rose-500/20 to-orange-500/20");
                } else if (newType === "success" && f.form.color.includes("rose")) {
                  f.set("color", "from-emerald-500/20 to-teal-500/20");
                }
              }}
              options={STORY_TYPE_OPTS}
            />
          </Field>

          <Field label="Tag / Domain" required hint="e.g. E-commerce & UI/UX, Mobile App, Web Development">
            <Text
              value={f.form.tag}
              onChange={(v) => f.set("tag", v)}
              placeholder="e.g. E-commerce & UI/UX"
              required
            />
          </Field>
        </div>

        <Field label="Slug" error={f.fields.slug} hint="URL identifier">
          <Text value={f.form.slug} onChange={(v) => f.set("slug", v)} placeholder="checkout-redesign-tripled-revenue" />
        </Field>

        <Field label="Story Narrative" required hint="The core narrative text shown on the story card">
          <Area
            value={f.form.desc}
            onChange={(v) => f.set("desc", v)}
            rows={4}
            required
            placeholder="A fashion retailer had strong brand recognition and steady traffic — but was bleeding customers at checkout..."
          />
        </Field>
      </Card>

      <Card title={f.form.type === "lesson" ? "The Failure & The Lesson" : "The Challenge & The Results"}>
        {f.form.type === "success" ? (
          <Field
            label="Key Metric / Impact"
            hint="Highlighted metric badge with zap icon"
          >
            <Text
              value={f.form.impact}
              onChange={(v) => f.set("impact", v)}
              placeholder="e.g. 3× Conversion Rate · 58% Drop in Abandonment"
            />
          </Field>
        ) : (
          <Field
            label="Key Lesson / Hard Truth"
            hint="Core wisdom badge or quote from the experience"
          >
            <Text
              value={f.form.lesson}
              onChange={(v) => f.set("lesson", v)}
              placeholder="e.g. Speed without resilience isn't delivery — it's a delayed disaster."
            />
          </Field>
        )}

        <Field
          label={f.form.type === "lesson" ? "What Went Wrong (The Challenge)" : "The Challenge"}
          required
        >
          <Area
            value={f.form.challenge}
            onChange={(v) => f.set("challenge", v)}
            rows={3}
            required
            placeholder="A 6-step desktop-only checkout that was losing 74% of mobile visitors before they ever reached payment."
          />
        </Field>

        <Field
          label={f.form.type === "lesson" ? "How We Fixed It" : "What We Built (The Solution)"}
          required
        >
          <Area
            value={f.form.type === "lesson" ? (f.form.fix || f.form.solution) : (f.form.solution || f.form.fix)}
            onChange={(v) => {
              f.set("solution", v);
              f.set("fix", v);
            }}
            rows={3}
            required
            placeholder="Mobile-first Shopify redesign with one-tap checkout, smart product recommendations, and a streamlined 2-step purchase flow."
          />
        </Field>
      </Card>

      <Card title="Visuals & Image">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-6">
            <MediaPicker
              label="Select from Media Library"
              value={f.form.image}
              onChange={(v) => f.set("image", v)}
              folder="stories"
              hint="Pick or upload an image from the TG Admin media library."
            />

            <div className="space-y-2">
              <Field
                label="Direct Image URL"
                hint="Or paste an external image link directly (Unsplash, Cloudinary, S3, etc.)"
              >
                <Text
                  value={f.form.imageUrl}
                  onChange={(v) => f.set("imageUrl", v)}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </Field>

              <Field label="Gradient Backdrop">
                <Select
                  value={f.form.color}
                  onChange={(v) => f.set("color", v)}
                  options={GRADIENT_PRESETS}
                />
              </Field>
            </div>
          </div>

          {previewImage && (
            <div className="pt-2">
              <span className="text-xs font-medium text-muted-foreground block mb-2">Live Image Preview:</span>
              <div className="relative h-48 w-full max-w-md rounded-xl overflow-hidden border border-border shadow-md">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.form.color} opacity-40 z-10`} />
                <img
                  src={previewImage}
                  alt={f.form.title || "Preview"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/90 text-xs font-mono font-bold z-20">
                  {f.form.tag || "Preview Tag"}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card title="Publishing">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Status">
            <Select
              value={f.form.status}
              onChange={(v) => f.set("status", v as any)}
              options={STATUS_OPTS}
            />
          </Field>
          <Field label="Display Order" hint="Lower numbers appear first">
            <Num value={f.form.order} onChange={(v) => f.set("order", v)} min={0} />
          </Field>
        </div>
      </Card>
    </EditShell>
  );
}
