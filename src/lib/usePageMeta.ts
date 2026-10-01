import { useEffect } from "react";

type Meta = {
  title: string;
  description?: string;
  /** Absolute URL preferred; social scrapers ignore relative ones. */
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
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

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

/**
 * Per-page titles and meta for an SPA. Without this every page shows the
 * static index.html title in tabs, search results and shares — and the SEO
 * fields editors fill in the admin are never rendered anywhere.
 */
export function usePageMeta({ title, description, ogImage, canonical, noIndex }: Meta) {
  useEffect(() => {
    const full = title === SITE ? title : `${title} — ${SITE}`;
    document.title = full;
    setMeta("property", "og:title", full);
    setMeta("name", "twitter:title", full);
    setMeta("property", "og:site_name", SITE);

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    if (ogImage) {
      setMeta("property", "og:image", ogImage);
      setMeta("name", "twitter:card", "summary_large_image");
    }

    const currentUrl = window.location.href.split("?")[0].split("#")[0];
    const canonicalUrl = canonical || currentUrl;
    setMeta("property", "og:url", currentUrl);
    setCanonical(canonicalUrl);

    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
  }, [title, description, ogImage, canonical, noIndex]);
}
