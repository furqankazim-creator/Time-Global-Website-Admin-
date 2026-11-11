import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2, X, FileText, Briefcase, GraduationCap, Mail, Phone, User, Calendar, ExternalLink } from "lucide-react";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { DataTable, type Column, type Meta } from "../components/DataTable";
import { StatusPill } from "../components/ResourceList";

const STATUSES = ["new", "reviewed", "shortlisted", "rejected"] as const;

type Application = {
  _id: string;
  name: string;
  fatherName: string;
  email: string;
  phone: string;
  education: string;
  jobTitle: string;
  jobSlug?: string;
  experience: string;
  coverLetter?: string;
  portfolioUrl?: string;
  resume: {
    filename: string;
    size: number;
    mimeType?: string;
    dataUrl?: string;
  };
  status: string;
  createdAt: string;
};

function ApplicationDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { canEdit } = useAuth();
  const qc = useQueryClient();

  // Try API first, fallback to localStorage
  const { data: application } = useQuery({
    queryKey: ["application", id],
    queryFn: async (): Promise<Application | null> => {
      try {
        const res = await api<{ data: Application }>(`/api/v1/admin/applications/${id}`);
        return res.data;
      } catch {
        const local = JSON.parse(localStorage.getItem("tg_job_applications") || "[]");
        const found = local.find((a: any) => a._id === id || a.id === id);
        return found || null;
      }
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["application", id] });
    qc.invalidateQueries({ queryKey: ["applications"] });
  };

  const setStatus = useMutation({
    mutationFn: async (status: string) => {
      try {
        return await api(`/api/v1/admin/applications/${id}`, { method: "PATCH", body: { status } });
      } catch {
        // Update in localStorage
        const local = JSON.parse(localStorage.getItem("tg_job_applications") || "[]");
        const updated = local.map((a: any) => (a._id === id || a.id === id ? { ...a, status } : a));
        localStorage.setItem("tg_job_applications", JSON.stringify(updated));
        return { success: true };
      }
    },
    onSuccess: invalidate,
    meta: { success: "Status updated" },
  });

  if (!application) return null;

  const downloadResume = () => {
    if (application.resume.dataUrl) {
      const a = document.createElement("a");
      a.href = application.resume.dataUrl;
      a.download = application.resume.filename;
      a.click();
    } else {
      alert("Resume file was not stored with data URL.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl h-full bg-card border-l border-border p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-primary font-bold">
                {application.jobTitle}
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-0.5">{application.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={!canEdit || setStatus.isPending}
                  onClick={() => setStatus.mutate(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                    application.status === s
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Profile Details */}
          <div className="bg-muted/40 rounded-xl p-4 border border-border/50 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-muted-foreground block">Father's Name</span>
                <span className="font-semibold text-foreground">{application.fatherName || "—"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Education / Degree</span>
                <span className="font-semibold text-foreground">{application.education}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Email Address</span>
                <a href={`mailto:${application.email}`} className="text-primary hover:underline font-mono text-xs">
                  {application.email}
                </a>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Phone / WhatsApp</span>
                <a href={`tel:${application.phone}`} className="text-foreground font-mono text-xs">
                  {application.phone}
                </a>
              </div>
            </div>

            {application.portfolioUrl && (
              <div className="pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground block">Portfolio / Links</span>
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-mono"
                >
                  {application.portfolioUrl} <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          {/* Field Experience */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Experience & Skills Summary
            </h4>
            <div className="p-4 bg-muted/20 border border-border/50 rounded-xl text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {application.experience || "No experience summary provided."}
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Cover Letter
              </h4>
              <div className="p-4 bg-muted/20 border border-border/50 rounded-xl text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {application.coverLetter}
              </div>
            </div>
          )}

          {/* Resume Download Card */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Attached Resume / CV
            </h4>
            <div className="flex items-center justify-between p-3.5 bg-muted/40 border border-border/80 rounded-xl">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground truncate max-w-[260px]">
                    {application.resume?.filename || "Resume.pdf"}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {application.resume?.size ? `${Math.round(application.resume.size / 1024)} KB` : "Uploaded"}
                  </p>
                </div>
              </div>

              {application.resume?.dataUrl && (
                <button
                  type="button"
                  onClick={downloadResume}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <Download size={14} /> Download CV
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
          <span>Applied: {new Date(application.createdAt || Date.now()).toLocaleDateString()}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const params = new URLSearchParams({
    page: String(page),
    limit: "20",
  });
  if (q) params.set("q", q);
  if (statusFilter) params.set("status", statusFilter);
  if (roleFilter) params.set("jobTitle", roleFilter);

  const { data, isLoading } = useQuery({
    queryKey: ["applications", page, q, statusFilter, roleFilter],
    queryFn: async (): Promise<{ data: Application[]; meta: Meta }> => {
      try {
        return await api<{ data: Application[]; meta: Meta }>(`/api/v1/admin/applications?${params}`);
      } catch {
        // Fallback to local storage
        const local = JSON.parse(localStorage.getItem("tg_job_applications") || "[]");
        let list = local;
        if (statusFilter) list = list.filter((a: any) => a.status === statusFilter);
        if (roleFilter) list = list.filter((a: any) => a.jobTitle === roleFilter);
        if (q) {
          const lower = q.toLowerCase();
          list = list.filter(
            (a: any) =>
              a.name?.toLowerCase().includes(lower) ||
              a.email?.toLowerCase().includes(lower) ||
              a.jobTitle?.toLowerCase().includes(lower)
          );
        }
        return {
          data: list,
          meta: { page: 1, limit: 20, total: list.length, totalPages: 1 },
        };
      }
    },
  });

  const columns: Column<Application>[] = [
    {
      key: "name",
      header: "Candidate Name",
      sortable: true,
      render: (r) => (
        <div>
          <button
            onClick={() => setSelectedId(r._id)}
            className="font-bold text-foreground hover:text-primary transition-colors text-left text-sm"
          >
            {r.name}
          </button>
          <div className="text-xs text-muted-foreground">Father: {r.fatherName || "—"}</div>
        </div>
      ),
    },
    {
      key: "jobTitle",
      header: "Position",
      sortable: true,
      render: (r) => (
        <span className="font-semibold text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">
          {r.jobTitle}
        </span>
      ),
    },
    {
      key: "education",
      header: "Education",
      render: (r) => <span className="text-xs text-foreground/80">{r.education}</span>,
    },
    {
      key: "email",
      header: "Contact",
      render: (r) => (
        <div className="text-xs font-mono space-y-0.5">
          <div className="text-muted-foreground">{r.email}</div>
          <div className="text-foreground">{r.phone}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => <StatusPill status={r.status || "new"} />,
    },
    {
      key: "createdAt",
      header: "Applied Date",
      sortable: true,
      render: (r) => (
        <span className="text-xs text-muted-foreground">
          {new Date(r.createdAt || Date.now()).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => (
        <button
          onClick={() => setSelectedId(r._id)}
          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          View Profile
        </button>
      ),
    },
  ];

  return (
    <AdminLayout title="Job Applications">
      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        meta={data?.meta}
        loading={isLoading}
        search={q}
        onSearch={(v) => {
          setQ(v);
          setPage(1);
        }}
        onPage={setPage}
        rowKey={(r) => r._id}
        emptyMessage="No job applications received yet."
        toolbar={
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-xs"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        }
      />

      {selectedId && <ApplicationDrawer id={selectedId} onClose={() => setSelectedId(null)} />}
    </AdminLayout>
  );
}
