/**
 * useAnalytics — privacy-safe page-view tracking hook.
 *
 * Supports two providers, configured via env vars:
 *
 *   VITE_PLAUSIBLE_DOMAIN   e.g. "timeglobaltech.com"
 *   VITE_GA_MEASUREMENT_ID  e.g. "G-XXXXXXXXXX"
 *
 * Both are opt-in: if neither var is set this hook is a complete no-op so
 * it is safe to ship now and configure later in the deployment environment.
 *
 * Usage — call once in App.tsx inside the public site branch:
 *
 *   useAnalytics();
 *
 * How it works:
 *  • Plausible: loads the Plausible script once, then calls
 *    window.plausible("pageview") on every route change.
 *  • GA4: loads gtag.js once, then fires a page_view event on each change.
 *
 * The hook uses wouter's useLocation so it automatically re-fires on SPA
 * navigation without any extra wiring.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;

// ── Helpers ───────────────────────────────────────────────────────────────

function loadScript(src: string, id: string, onLoad?: () => void) {
  if (document.getElementById(id)) { onLoad?.(); return; }
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  if (onLoad) s.onload = onLoad;
  document.head.appendChild(s);
}

declare global {
  interface Window {
    plausible?: (event: string, opts?: object) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function initGtag(id: string) {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false }); // we fire manually
}

function initGtm(id: string) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  loadScript(`https://www.googletagmanager.com/gtm.js?id=${id}`, "gtm-script");
}

/** Track custom business conversions across GA4, GTM, and Plausible */
export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  // Push to GTM dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }

  // GA4 gtag
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  // Plausible custom event
  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props: params });
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useAnalytics() {
  const [location] = useLocation();
  const initialised = useRef(false);

  // One-time script injection
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    if (GTM_ID) {
      initGtm(GTM_ID);
    }

    if (PLAUSIBLE_DOMAIN) {
      loadScript(
        `https://plausible.io/js/script.js`,
        "plausible-script",
      );
      // Plausible reads data-domain from the script tag; set it now.
      const el = document.getElementById("plausible-script");
      if (el) el.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
    }

    if (GA_ID) {
      loadScript(
        `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
        "gtag-script",
        () => initGtag(GA_ID),
      );
    }
  }, []);

  // Per-route page-view event
  useEffect(() => {
    const pageData = {
      page_path: location,
      page_title: document.title,
      page_location: window.location.href,
    };

    if (window.dataLayer) {
      window.dataLayer.push({
        event: "page_view",
        ...pageData,
      });
    }

    if (PLAUSIBLE_DOMAIN && typeof window.plausible === "function") {
      window.plausible("pageview");
    }

    if (GA_ID && typeof window.gtag === "function") {
      window.gtag("event", "page_view", pageData);
    }
  // Re-run on every route change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
}
