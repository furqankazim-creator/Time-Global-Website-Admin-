/** Shares the startup loader's styling from index.html for route transitions. */
export function PageLoader() {
  return (
    <div className="startup-loader" role="status" aria-live="polite">
      <strong>TIME GLOBAL</strong>
      <div className="startup-spinner" aria-hidden="true" />
      <span>Loading website…</span>
    </div>
  );
}
