import { useEffect } from "react";

type Meta = {
  title: string;
  description?: string;
  /** Absolute URL preferred; social scrapers ignore relative ones. */
  ogImage?: string;
};

const SITE = "Time Global";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Per-page titles and meta for an SPA. Without this every page shows the
 * static index.html title in tabs, search results and shares — and the SEO
 * fields editors fill in the admin are never rendered anywhere.
 *
 * No dependency needed: it's four DOM writes on mount.
 */
export function usePageMeta({ title, description, ogImage }: Meta) {
  useEffect(() => {
    const full = title === SITE ? title : `${title} — ${SITE}`;
    document.title = full;
    setMeta("property", "og:title", full);
    setMeta("name", "twitter:title", full);

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    if (ogImage) {
      setMeta("property", "og:image", ogImage);
      setMeta("name", "twitter:card", "summary_large_image");
    }

    setMeta("property", "og:url", window.location.href);
  }, [title, description, ogImage]);
}
