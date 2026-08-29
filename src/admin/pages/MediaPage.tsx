import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Upload } from "lucide-react";
import { ApiError, api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import type { Meta } from "../components/DataTable";

type MediaItem = {
  _id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string;
  folder: string;
};

const kb = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`);

export default function MediaPage() {
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: () => api<{ data: MediaItem[]; meta: Meta }>("/api/v1/admin/media?limit=60"),
  });

  const upload = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "general");
      // Alt starts as the filename so nothing lands with empty alt text;
      // it's editable inline below.
      fd.append("alt", file.name.replace(/\.[^.]+$/, ""));
      return api<{ data: MediaItem }>("/api/v1/admin/media/upload", { method: "POST", body: fd });
    },
    onSuccess: () => {
      setError(null);
      qc.invalidateQueries({ queryKey: ["media"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : "Upload failed"),
    meta: { success: "Image uploaded" },
  });

  const updateAlt = useMutation({
    mutationFn: ({ id, alt }: { id: string; alt: string }) =>
      api(`/api/v1/admin/media/${id}`, { method: "PATCH", body: { alt } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
    meta: { success: "Alt text saved" },
  });

  const del = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/media/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
    meta: { success: "Image deleted" },
  });

  return (
    <AdminLayout
      title="Media"
      actions={
        canEdit && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload.mutate(f);
                e.target.value = ""; // allow re-selecting the same file
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={upload.isPending}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {upload.isPending ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              Upload
            </button>
          </>
        )
      }
    >
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-4">
        JPEG, PNG, GIF, WebP, PDF up to 10MB. SVG is rejected — it can carry scripts.
      </p>

      {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}

      {!isLoading && !data?.data.length && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">No media yet. Upload your first file.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {data?.data.map((m) => (
          <div key={m._id} className="rounded-xl border border-border bg-card overflow-hidden group">
            <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
              {m.mimeType.startsWith("image/") ? (
                <img src={m.url} alt={m.alt} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <span className="text-xs font-mono text-muted-foreground">PDF</span>
              )}
            </div>
            <div className="p-2.5 space-y-1.5">
              <p className="text-xs font-medium truncate" title={m.filename}>
                {m.filename}
              </p>
              <input
                defaultValue={m.alt}
                onBlur={(e) => {
                  if (e.target.value !== m.alt) updateAlt.mutate({ id: m._id, alt: e.target.value });
                }}
                placeholder="Alt text (a11y)"
                disabled={!canEdit}
                className="w-full text-xs px-2 py-1 rounded border border-border bg-background focus:outline-none focus:border-primary disabled:opacity-60"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono">{kb(m.size)}</span>
                {canEdit && (
                  <button
                    onClick={() => confirm(`Move "${m.filename}" to trash?`) && del.mutate(m._id)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${m.filename}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
