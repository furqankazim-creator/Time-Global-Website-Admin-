import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, Plus, KeyRound, UserCheck, UserX, Trash2, Mail, ShieldAlert } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { DataTable, type Column, type Meta } from "../components/DataTable";

type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "author" | "viewer";
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  editor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  author: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  viewer: "bg-muted text-muted-foreground border-border",
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [roleFilter, setRoleFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [resetUser, setResetUser] = useState<UserItem | null>(null);

  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "editor" | "author" | "viewer">("editor");
  const [resetPass, setResetPass] = useState("");
  const [formError, setFormError] = useState("");

  const params = new URLSearchParams({ page: String(page), limit: "20", sort });
  if (q) params.set("q", q);
  if (roleFilter) params.set("role", roleFilter);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, q, roleFilter, sort],
    queryFn: () => api<{ data: UserItem[]; meta: Meta }>(`/api/v1/admin/users?${params}`),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["users"] });

  const createMut = useMutation({
    mutationFn: (body: any) => api("/api/v1/admin/users", { method: "POST", body }),
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setFormError("");
    },
    onError: (e: any) => setFormError(e.message || "Failed to create user"),
    meta: { success: "User created successfully" },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      api(`/api/v1/admin/users/${id}`, { method: "PATCH", body: updates }),
    onSuccess: invalidate,
    meta: { success: "User updated" },
  });

  const resetPassMut = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      api(`/api/v1/admin/users/${id}/reset-password`, { method: "POST", body: { password } }),
    onSuccess: () => {
      setResetUser(null);
      setResetPass("");
    },
    meta: { success: "Password reset successful" },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/users/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
    meta: { success: "User deleted" },
  });

  const columns: Column<UserItem>[] = [
    {
      key: "name",
      header: "User",
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {u.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-foreground flex items-center gap-1.5">
              {u.name}
              {u._id === currentUser?._id && (
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded font-mono">
                  You
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail size={11} /> {u.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (u) => (
        <select
          value={u.role}
          disabled={u._id === currentUser?._id}
          onChange={(e) => updateMut.mutate({ id: u._id, updates: { role: e.target.value } })}
          className={`text-xs px-2.5 py-1 rounded-md border font-semibold capitalize cursor-pointer focus:outline-none ${
            ROLE_COLORS[u.role]
          }`}
        >
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="author">Author</option>
          <option value="viewer">Viewer</option>
        </select>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (u) => (
        <button
          onClick={() =>
            u._id !== currentUser?._id &&
            updateMut.mutate({ id: u._id, updates: { isActive: !u.isActive } })
          }
          disabled={u._id === currentUser?._id}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
            u.isActive
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/15 text-destructive"
          }`}
        >
          {u.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
          {u.isActive ? "Active" : "Disabled"}
        </button>
      ),
    },
    {
      key: "lastLoginAt",
      header: "Last Active",
      sortable: true,
      render: (u) => (
        <span className="text-xs text-muted-foreground">
          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setResetUser(u)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Reset Password"
          >
            <KeyRound size={15} />
          </button>
          {u._id !== currentUser?._id && (
            <button
              onClick={() => confirm(`Permanently delete user "${u.name}"?`) && deleteMut.mutate(u._id)}
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              title="Delete User"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Users & Permissions"
      actions={
        <button
          onClick={() => {
            setFormError("");
            setCreateOpen(true);
          }}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> New User
        </button>
      }
    >
      <div className="mb-4">
        <DataTable
          columns={columns}
          rows={data?.data ?? []}
          meta={data?.meta}
          loading={isLoading}
          error={error ? (error as Error).message : null}
          search={q}
          onSearch={(v) => {
            setQ(v);
            setPage(1);
          }}
          sort={sort}
          onSort={setSort}
          onPage={setPage}
          rowKey={(u) => u._id}
          emptyMessage="No users found."
          toolbar={
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
            >
              <option value="">All Roles</option>
              <option value="admin">Admins</option>
              <option value="editor">Editors</option>
              <option value="author">Authors</option>
              <option value="viewer">Viewers</option>
            </select>
          }
        />
      </div>

      {/* Create User Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Shield size={18} className="text-primary" /> Create User
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Add a team member to manage or view website content.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {formError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMut.mutate({
                  name: newName,
                  email: newEmail,
                  password: newPassword,
                  role: newRole,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold mb-1">Full Name</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Role & Permissions</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary capitalize"
                >
                  <option value="editor">Editor — Full content editing</option>
                  <option value="admin">Admin — Full system & settings access</option>
                  <option value="author">Author — Manage own posts only</option>
                  <option value="viewer">Viewer — Read-only access</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMut.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {createMut.isPending ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-base font-bold mb-1 flex items-center gap-2">
              <KeyRound size={16} className="text-primary" /> Reset Password
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Enter a new password for <span className="font-semibold text-foreground">{resetUser.name}</span>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                resetPassMut.mutate({ id: resetUser._id, password: resetPass });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={resetPass}
                  onChange={(e) => setResetPass(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setResetUser(null)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetPassMut.isPending}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {resetPassMut.isPending ? "Updating..." : "Set Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
