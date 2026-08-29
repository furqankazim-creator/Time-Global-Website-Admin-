import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search, Inbox } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
};

export type Meta = { page: number; limit: number; total: number; totalPages: number };

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  meta?: Meta;
  loading?: boolean;
  error?: string | null;
  search: string;
  onSearch: (v: string) => void;
  sort: string;
  onSort: (v: string) => void;
  onPage: (p: number) => void;
  rowKey: (row: T) => string;
  emptyMessage?: string;
  toolbar?: ReactNode;
};

/** Shared list UI: search + sort + pagination. One contract for every module. */
export function DataTable<T>({
  columns, rows, meta, loading, error, search, onSearch, sort, onSort, onPage,
  rowKey, emptyMessage = "Nothing here yet.", toolbar,
}: Props<T>) {
  const [term, setTerm] = useState(search);

  // Debounce: fire a query per keystroke and the API gets hammered.
  useEffect(() => {
    const t = setTimeout(() => {
      if (term !== search) onSearch(term);
    }, 350);
    return () => clearTimeout(t);
  }, [term]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSort = (key: string) =>
    onSort(sort === key ? `-${key}` : sort === `-${key}` ? key : key);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
          />
        </div>
        {toolbar}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`text-left font-semibold px-4 py-3 whitespace-nowrap ${c.className ?? ""} ${
                      c.sortable ? "cursor-pointer select-none hover:text-primary" : ""
                    }`}
                    onClick={c.sortable ? () => toggleSort(c.key) : undefined}
                  >
                    {c.header}
                    {c.sortable && (sort === c.key ? " ↑" : sort === `-${c.key}` ? " ↓" : "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-destructive">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <Inbox size={28} className="mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">{emptyMessage}</p>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                rows.map((row) => (
                  <tr key={rowKey(row)} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of{" "}
            {meta.total}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => onPage(meta.page - 1)}
              className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-xs text-muted-foreground">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPage(meta.page + 1)}
              className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
