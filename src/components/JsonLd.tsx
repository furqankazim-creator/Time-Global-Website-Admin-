/**
 * JsonLd — injects a <script type="application/ld+json"> tag into the <head>
 * for the given structured-data schema.
 *
 * Three schemas are supported:
 *
 *  • Organization  — site-wide, rendered once in App.tsx on the public site.
 *  • Article       — per blog post, rendered by BlogPostPage.
 *  • JobPosting    — per job opening, rendered by CareersPage for each role
 *                    that has enough data (title, description, location).
 *
 * Using dangerouslySetInnerHTML is intentional and safe here: the JSON is
 * produced entirely from trusted internal data, not from user input.
 */

import { useEffect } from "react";

// ─── Schema types (minimal — only the fields we actually populate) ─────────

export type OrganizationSchema = {
  type: "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];          // social profile URLs
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
    postalCode: string;
  };
  email?: string;
  telephone?: string;
};

export type ArticleSchema = {
  type: "Article";
  headline: string;
  description: string;
  url: string;
  datePublished: string;     // ISO-8601
  dateModified?: string;
  author?: string;
  image?: string;            // absolute URL
};

export type JobPostingSchema = {
  type: "JobPosting";
  title: string;
  description: string;
  datePosted: string;        // ISO-8601
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN";
  hiringOrganization?: { name: string; sameAs: string };
  jobLocation?: string;      // city / "TELECOMMUTE"
  baseSalary?: string;       // free-form, e.g. "$120k–$180k"
  validThrough?: string;     // ISO-8601
};

type Schema = OrganizationSchema | ArticleSchema | JobPostingSchema;

// ─── Serialisers ──────────────────────────────────────────────────────────

function buildOrganization(s: OrganizationSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.name,
    url: s.url,
    logo: { "@type": "ImageObject", url: s.logo },
    description: s.description,
    sameAs: s.sameAs,
    ...(s.email     && { email: s.email }),
    ...(s.telephone && { telephone: s.telephone }),
    ...(s.address   && {
      address: {
        "@type": "PostalAddress",
        streetAddress:   s.address.streetAddress,
        addressLocality: s.address.addressLocality,
        addressCountry:  s.address.addressCountry,
        postalCode:      s.address.postalCode,
      },
    }),
  };
}

function buildArticle(s: ArticleSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.headline,
    description: s.description,
    url: s.url,
    datePublished: s.datePublished,
    ...(s.dateModified && { dateModified: s.dateModified }),
    ...(s.image && { image: s.image }),
    author: {
      "@type": "Organization",
      name: "Time Global",
      url: "https://timeglobaltech.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Time Global",
      logo: {
        "@type": "ImageObject",
        url: "https://timeglobaltech.com/assets/tg-logo.png",
      },
    },
  };
}

function buildJobPosting(s: JobPostingSchema) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: s.title,
    description: s.description,
    datePosted: s.datePosted,
    hiringOrganization: s.hiringOrganization ?? {
      "@type": "Organization",
      name: "Time Global",
      sameAs: "https://timeglobaltech.com",
    },
  };
  if (s.employmentType) schema.employmentType = s.employmentType;
  if (s.validThrough)   schema.validThrough   = s.validThrough;
  if (s.jobLocation) {
    schema.jobLocation =
      s.jobLocation.toLowerCase() === "remote" || s.jobLocation.toLowerCase() === "telecommute"
        ? { "@type": "Place", address: { "@type": "VirtualLocation" } }
        : { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: s.jobLocation } };
  }
  if (s.baseSalary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: { "@type": "QuantitativeValue", value: s.baseSalary, unitText: "YEAR" },
    };
  }
  return schema;
}

// ─── Component ────────────────────────────────────────────────────────────

function serialise(schema: Schema): string {
  switch (schema.type) {
    case "Organization": return JSON.stringify(buildOrganization(schema));
    case "Article":      return JSON.stringify(buildArticle(schema));
    case "JobPosting":   return JSON.stringify(buildJobPosting(schema));
  }
}

/**
 * Injects (and cleans up) a <script type="application/ld+json"> tag.
 * Re-injects whenever the schema changes — safe for SPA navigation.
 */
export function JsonLd({ schema }: { schema: Schema }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-schema", schema.type);
    script.textContent = serialise(schema);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
    // Serialise to string so the dep comparison is stable across re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialise(schema)]);

  return null;
}

// ─── Pre-built Organization for Time Global ───────────────────────────────

/** Drop this in App.tsx once — covers every page automatically. */
export const TIME_GLOBAL_ORG: OrganizationSchema = {
  type: "Organization",
  name: "Time Global",
  url: "https://timeglobaltech.com",
  logo: "https://timeglobaltech.com/assets/tg-logo.png",
  description:
    "AI-powered software development agency — web, mobile, cloud and automation for businesses worldwide. Est. 2013.",
  email: "info@timeglobaltech.com",
  telephone: "+923148455430",
  address: {
    streetAddress: "Bungalow Office #1/2-L, Block 6, PECHS Society, Shahrah-e-Faisal",
    addressLocality: "Karachi",
    addressCountry: "PK",
    postalCode: "75350",
  },
  sameAs: [
    "https://www.linkedin.com/company/timeglobaltech",
    "https://www.facebook.com/timeglobaltech/",
    "https://www.instagram.com/timeglobaltech/",
    "https://www.youtube.com/@timeglobaltech",
    "https://github.com/timeglobaltech",
    "https://www.tiktok.com/@time.global.tech",
  ],
};
