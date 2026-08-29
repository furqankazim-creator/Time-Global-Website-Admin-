import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { ApiError, api } from "../lib/api";
import { useAuth } from "../lib/auth";
import type { Meta } from "./DataTable";

export type MediaRef = {
  _id: string;
  url: string;
  alt: string;
  filename: string;
  mimeType: string;
};

/**
 * Accepts either an id (what we send on save) or a populated object (what the
 * API returns on read), so callers don't have to normalise before rendering.
 * Only _id and url are needed here — anything wider would force every caller
 * to model fields the picker never reads.
 */
type Value = string | { _id: string; url?: string } | null | undefined;

const idOf = (v: Value) => (typeof v === "string" ? v : v?._id ?? null);
const urlOf = (v: Value) => (typeof v === "object" && v ? v.url ?? null : null);

function Browser({
  folder, onPick, onClose,
}: { folder: string; onPick: (m: MediaRef) => void; onClose: () => void }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["media", "picker"],
    queryFn: () => api<{ data: MediaRef[]; meta: Meta }>("/api/v1/admin/media?limit=60&type=image"),
  });

  const upload = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      // Seed alt from the filename so nothing lands with empty alt text.
      fd.append("alt", file.name.replace(/\.[^.]+$/, ""));
      return api<{ data: MediaRef }>("/api/v1/admin/media/upload", { method: "POST", body: fd });
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["media"] });
      onPick(res.data); // pick it immediately — that's why they uploaded
      onClose();
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : "Upload failed"),
    meta: { success: "Image uploaded" },
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[80vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
        <header className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <h2 className="font-bold flex-1">Select an image</h2>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload.mutate(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={upload.isPending}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {upload.isPending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Upload new
          </button>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-muted" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        {error && (
          <p className="mx-5 mt-4 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
            {error}
          </p>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && !data?.data.length && (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No images yet — upload one to get started.
              </p>
            </div>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {data?.data.map((m) => (
              <button
                key={m._id}
                type="button"
                onClick={() => {
                  onPick(m);
                  onClose();
                }}
                className="group rounded-lg border border-border overflow-hidden hover:border-primary transition-colors"
                title={m.filename}
              >
                <div className="aspect-square bg-muted">
                  <img src={m.url} alt={m.alt} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="px-2 py-1 text-[10px] truncate text-muted-foreground group-hover:text-primary">
                  {m.filename}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MediaPicker({
  label, value, onChange, folder = "general", hint,
}: {
  label: string;
  value: Value;
  /** Emits the media id — what the API expects on write. */
  onChange: (id: string | null) => void;
  folder?: string;
  hint?: string;
}) {
  const { canEdit } = useAuth();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<MediaRef | null>(null);

  // Prefer a just-picked item, since `value` is only an id until the next read.
  const preview = picked?.url ?? urlOf(value);
  const hasValue = !!idOf(value) || !!picked;

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 shrink-0 rounded-lg border border-border bg-muted overflow-hidden grid place-items-center">
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={20} className="text-muted-foreground/40" />
          )}
        </div>

        {canEdit && (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="h-8 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted"
            >
              {hasValue ? "Change" : "Select image"}
            </button>
            {hasValue && (
              <button
                type="button"
                onClick={() => {
                  setPicked(null);
                  onChange(null);
                }}
                className="h-8 px-3 rounded-lg text-xs text-muted-foreground hover:text-destructive"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}

      {open && (
        <Browser
          folder={folder}
          onClose={() => setOpen(false)}
          onPick={(m) => {
            setPicked(m);
            onChange(m._id);
          }}
        />
      )}
    </div>
  );
}
