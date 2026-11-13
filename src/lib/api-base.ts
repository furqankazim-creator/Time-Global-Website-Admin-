// Same-origin requests work with Vite's proxy locally and the host proxy in production.
export const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
