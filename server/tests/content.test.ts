import request from "supertest";
import type { Express } from "express";
import { auth, makeApp, resetDb, tokenFor } from "./helpers.js";

let app: Express;
let admin: string;

beforeAll(async () => {
  app = await makeApp();
});
beforeEach(async () => {
  await resetDb();
  admin = await tokenFor(app, "admin");
});

describe("slugs", () => {
  it("derives a slug from the title, handling punctuation and accents", async () => {
    const res = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Crédit & Cloud Consulting!" });
    expect(res.body.data.slug).toBe("credit-cloud-consulting");
  });

  it("suffixes duplicate slugs instead of colliding", async () => {
    await request(app).post("/api/v1/admin/services").set(auth(admin)).send({ title: "Cloud" });
    const res = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Cloud" });
    expect(res.body.data.slug).toBe("cloud-2");
  });

  it("does NOT change the slug when only the title is edited", async () => {
    // Re-slugging on a title tweak would silently break the live URL.
    const created = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Original", status: "published" });

    const res = await request(app)
      .patch(`/api/v1/admin/services/${created.body.data._id}`)
      .set(auth(admin))
      .send({ title: "Completely Different Title" });

    expect(res.body.data.slug).toBe("original");
  });
});

describe("publishing", () => {
  it("stamps publishedAt when first published", async () => {
    const res = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Live", status: "published" });
    expect(res.body.data.publishedAt).toBeTruthy();
  });

  it("shows published content on the public API", async () => {
    await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Public Service", status: "published" });

    const res = await request(app).get("/api/v1/public/services");
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Public Service");
  });

  it("removes content from the site when unpublished", async () => {
    const created = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Temporary", status: "published" });

    await request(app)
      .patch(`/api/v1/admin/services/${created.body.data._id}`)
      .set(auth(admin))
      .send({ status: "draft" });

    const res = await request(app).get("/api/v1/public/services");
    expect(res.body.data).toHaveLength(0);
  });
});

describe("soft delete", () => {
  it("hides from lists but restores intact", async () => {
    const created = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Deletable" });
    const id = created.body.data._id;

    await request(app).delete(`/api/v1/admin/services/${id}`).set(auth(admin)).expect(204);

    const hidden = await request(app).get("/api/v1/admin/services").set(auth(admin));
    expect(hidden.body.meta.total).toBe(0);

    const trash = await request(app)
      .get("/api/v1/admin/services?includeDeleted=true")
      .set(auth(admin));
    expect(trash.body.meta.total).toBe(1);

    await request(app).post(`/api/v1/admin/services/${id}/restore`).set(auth(admin)).expect(200);

    const back = await request(app).get("/api/v1/admin/services").set(auth(admin));
    expect(back.body.meta.total).toBe(1);
  });
});

describe("pagination and search", () => {
  beforeEach(async () => {
    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post("/api/v1/admin/services")
        .set(auth(admin))
        .send({ title: `Service ${i}`, order: i });
    }
  });

  it("paginates with accurate meta", async () => {
    const res = await request(app).get("/api/v1/admin/services?limit=2&page=2").set(auth(admin));
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toMatchObject({ page: 2, limit: 2, total: 5, totalPages: 3 });
  });

  it("caps the page size so a huge limit cannot exhaust memory", async () => {
    const res = await request(app).get("/api/v1/admin/services?limit=99999").set(auth(admin));
    expect(res.status).toBe(400);
  });

  it("searches by title", async () => {
    const res = await request(app).get("/api/v1/admin/services?q=Service 3").set(auth(admin));
    expect(res.body.meta.total).toBe(1);
  });

  it("treats regex metacharacters in search as literals", async () => {
    // Unescaped, `.*` would match everything and is a ReDoS vector.
    const res = await request(app).get("/api/v1/admin/services?q=.*").set(auth(admin));
    expect(res.body.meta.total).toBe(0);
  });

  it("sorts, and ignores an unknown sort field", async () => {
    const asc = await request(app).get("/api/v1/admin/services?sort=order").set(auth(admin));
    expect(asc.body.data[0].order).toBe(1);

    const desc = await request(app).get("/api/v1/admin/services?sort=-order").set(auth(admin));
    expect(desc.body.data[0].order).toBe(5);

    // A non-whitelisted field must not probe the schema.
    const bogus = await request(app).get("/api/v1/admin/services?sort=passwordHash").set(auth(admin));
    expect(bogus.status).toBe(200);
  });
});

describe("slug-change redirects", () => {
  it("records a 301 when a published slug is renamed", async () => {
    const created = await request(app)
      .post("/api/v1/admin/projects")
      .set(auth(admin))
      .send({ title: "Bonnet Platform", status: "published" });

    await request(app)
      .patch(`/api/v1/admin/projects/${created.body.data._id}`)
      .set(auth(admin))
      .send({ slug: "bonnet-v2" });

    const res = await request(app).get("/api/v1/public/resolve?path=/work/bonnet-platform");
    expect(res.body.data.toPath).toBe("/work/bonnet-v2");
    expect(res.body.data.statusCode).toBe(301);
  });

  it("flattens chains so A points straight at C", async () => {
    // Chained redirects leak ranking and can loop.
    const created = await request(app)
      .post("/api/v1/admin/projects")
      .set(auth(admin))
      .send({ title: "Alpha", status: "published" });
    const id = created.body.data._id;

    await request(app).patch(`/api/v1/admin/projects/${id}`).set(auth(admin)).send({ slug: "beta" });
    await request(app).patch(`/api/v1/admin/projects/${id}`).set(auth(admin)).send({ slug: "gamma" });

    const a = await request(app).get("/api/v1/public/resolve?path=/work/alpha");
    const b = await request(app).get("/api/v1/public/resolve?path=/work/beta");
    expect(a.body.data.toPath).toBe("/work/gamma");
    expect(b.body.data.toPath).toBe("/work/gamma");
  });

  it("does not record a redirect for a draft", async () => {
    const created = await request(app)
      .post("/api/v1/admin/projects")
      .set(auth(admin))
      .send({ title: "Unpublished", status: "draft" });

    await request(app)
      .patch(`/api/v1/admin/projects/${created.body.data._id}`)
      .set(auth(admin))
      .send({ slug: "renamed" });

    const res = await request(app).get("/api/v1/public/resolve?path=/work/unpublished");
    expect(res.body.data).toBeNull();
  });

  it("returns null for an unknown path", async () => {
    const res = await request(app).get("/api/v1/public/resolve?path=/work/never-existed");
    expect(res.body.data).toBeNull();
  });
});

describe("home page singleton", () => {
  it("auto-creates on first read", async () => {
    const res = await request(app).get("/api/v1/admin/home").set(auth(admin));
    expect(res.status).toBe(200);
    expect(res.body.data.key).toBe("home");
  });

  it("propagates an edit to the public API", async () => {
    await request(app)
      .put("/api/v1/admin/home")
      .set(auth(admin))
      .send({ hero: { headline: "Engineering Excellence." } });

    const res = await request(app).get("/api/v1/public/home");
    expect(res.body.data.hero.headline).toBe("Engineering Excellence.");
  });

  it("omits a featured service that was later unpublished", async () => {
    const svc = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Featured", status: "published" });

    await request(app)
      .put("/api/v1/admin/home")
      .set(auth(admin))
      .send({ featuredServices: [svc.body.data._id] });

    expect((await request(app).get("/api/v1/public/home")).body.data.featuredServices).toHaveLength(1);

    await request(app)
      .patch(`/api/v1/admin/services/${svc.body.data._id}`)
      .set(auth(admin))
      .send({ status: "draft" });

    // Unpublishing must remove it from the homepage, not leave a dead card.
    const after = await request(app).get("/api/v1/public/home");
    expect(after.body.data.featuredServices).toHaveLength(0);
  });
});

describe("seo endpoints", () => {
  it("lists published content in the sitemap and excludes drafts", async () => {
    await request(app)
      .post("/api/v1/admin/projects")
      .set(auth(admin))
      .send({ title: "Indexed", status: "published" });
    await request(app)
      .post("/api/v1/admin/projects")
      .set(auth(admin))
      .send({ title: "Hidden Draft", status: "draft" });

    const res = await request(app).get("/sitemap.xml");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("xml");
    expect(res.text).toContain("/work/indexed");
    expect(res.text).not.toContain("hidden-draft");
  });

  it("omits service detail URLs, which have no route", async () => {
    // Listing /services/:slug would hand Google a list of 404s.
    await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Cloud Consulting", status: "published" });

    const res = await request(app).get("/sitemap.xml");
    expect(res.text).toContain("/services");          // the listing page
    expect(res.text).not.toContain("/services/cloud"); // no detail URL
  });

  it("excludes noIndex pages from the sitemap", async () => {
    await request(app)
      .post("/api/v1/admin/projects")
      .set(auth(admin))
      .send({ title: "No Index Me", status: "published", seo: { noIndex: true } });

    const res = await request(app).get("/sitemap.xml");
    expect(res.text).not.toContain("no-index-me");
  });

  it("serves robots.txt blocking admin and api", async () => {
    const res = await request(app).get("/robots.txt");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Disallow: /admin");
    expect(res.text).toContain("Sitemap:");
  });
});

describe("hero headline formatting", () => {
  it("preserves newlines through the API round-trip", async () => {
    // The hero renders one line per newline and accents the last, so losing
    // the newlines would silently collapse the design's stacked layout.
    const headline = "AI-Powered Solutions.\nBuilt for\nGrowth.";
    await request(app).put("/api/v1/admin/home").set(auth(admin)).send({ hero: { headline } });

    const res = await request(app).get("/api/v1/public/home");
    expect(res.body.data.hero.headline).toBe(headline);
    expect(res.body.data.hero.headline.split("\n")).toHaveLength(3);
  });

  it("keeps internal newlines when the value is trimmed", async () => {
    await request(app)
      .put("/api/v1/admin/home")
      .set(auth(admin))
      .send({ hero: { headline: "  Line one\nLine two  " } });

    const res = await request(app).get("/api/v1/public/home");
    expect(res.body.data.hero.headline).toBe("Line one\nLine two");
  });
});

describe("testimonial quote bounds", () => {
  const base = { clientName: "Test Client", rating: 5 };
  const words = (n: number) => "word ".repeat(n).trim();

  it("rejects a quote over 40 words", async () => {
    // Card heights are fixed in the carousel; an unbounded quote either
    // overflows or gets clipped mid-sentence.
    const res = await request(app)
      .post("/api/v1/admin/testimonials")
      .set(auth(admin))
      .send({ ...base, quote: words(60) });

    expect(res.status).toBe(400);
    expect(res.body.error.fields.quote).toContain("40 words");
  });

  it("rejects a quote under 8 words", async () => {
    const res = await request(app)
      .post("/api/v1/admin/testimonials")
      .set(auth(admin))
      .send({ ...base, quote: "Great work." });

    expect(res.status).toBe(400);
    expect(res.body.error.fields.quote).toContain("8 words");
  });

  it("accepts a well-sized quote", async () => {
    const res = await request(app)
      .post("/api/v1/admin/testimonials")
      .set(auth(admin))
      .send({ ...base, quote: words(40) });
    expect(res.status).toBe(201);
  });
});

describe("testimonial images", () => {
  const PNG = Buffer.from(
    "89504e470d0a1a0a0000000d494844520000000100000001080600000" +
      "01f15c4890000000a49444154789c6300010000050001" +
      "0d0a2db40000000049454e44ae426082",
    "hex"
  );

  it("attaches an uploaded photo and serves it publicly", async () => {
    const up = await request(app)
      .post("/api/v1/admin/media/upload")
      .set(auth(admin))
      .attach("file", PNG, { filename: "client.png", contentType: "image/png" })
      .field("alt", "Client photo")
      .field("folder", "testimonials");
    expect(up.status).toBe(201);

    const created = await request(app)
      .post("/api/v1/admin/testimonials")
      .set(auth(admin))
      .send({
        clientName: "Photo Client",
        quote: "They delivered exactly what we needed, on time and within the agreed budget.",
        photo: up.body.data._id,
        approvalStatus: "approved",
      });
    expect(created.status).toBe(201);

    const pub = await request(app).get("/api/v1/public/testimonials");
    const row = pub.body.data.find((t: any) => t.clientName === "Photo Client");

    // Assert the folder and extension, not the upload root — that's env config
    // (tests write to tests/.uploads, dev to uploads/).
    expect(row.photo.url).toContain("/testimonials/");
    expect(row.photo.url).toMatch(/\.png$/);
    expect(row.photo.alt).toBe("Client photo");
    // Never the client's filename — the stored name is randomised.
    expect(row.photo.url).not.toContain("client.png");
  });
});
