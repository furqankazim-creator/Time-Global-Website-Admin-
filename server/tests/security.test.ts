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

describe("stored XSS", () => {
  it("strips scripts, event handlers and javascript: urls from rich text", async () => {
    const res = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({
        title: "XSS probe",
        fullDescription:
          '<p>ok</p><script>alert(1)</script><img src=x onerror=alert(2)>' +
          '<a href="javascript:alert(3)">bad</a><iframe src="evil"></iframe>',
      });

    const html = res.body.data.fullDescription;
    expect(html).toContain("<p>ok</p>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<iframe");
  });

  it("sanitizes every rich-text field on a project", async () => {
    const res = await request(app)
      .post("/api/v1/admin/projects")
      .set(auth(admin))
      .send({
        title: "XSS probe project",
        problem: "<p>a</p><script>alert(1)</script>",
        solution: "<p>b</p><iframe></iframe>",
        result: "<p>c</p><img src=x onerror=alert(1)>",
      });

    expect(res.status).toBe(201);

    const d = res.body.data;
    for (const field of [d.problem, d.solution, d.result]) {
      expect(field).not.toContain("<script");
      expect(field).not.toContain("<iframe");
      expect(field).not.toContain("onerror");
    }
  });
});

describe("public API isolation", () => {
  it("never exposes drafts", async () => {
    await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Secret draft", status: "draft" });

    const res = await request(app).get("/api/v1/public/services");
    expect(res.body.data).toHaveLength(0);
  });

  it("404s a draft fetched directly by slug", async () => {
    const created = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(admin))
      .send({ title: "Secret draft", status: "draft" });

    const res = await request(app).get(`/api/v1/public/services/${created.body.data.slug}`);
    expect(res.status).toBe(404);
  });

  it("hides testimonials until approved", async () => {
    await request(app)
      .post("/api/v1/admin/testimonials")
      .set(auth(admin))
      .send({ clientName: "Pending Person", quote: "Should not be public yet" });

    const res = await request(app).get("/api/v1/public/testimonials");
    expect(res.body.data).toHaveLength(0);
  });

  it("hides a scheduled post until its publish date arrives", async () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    await request(app)
      .post("/api/v1/admin/posts")
      .set(auth(admin))
      .send({ title: "Tomorrow", status: "published", publishedAt: future });

    const res = await request(app).get("/api/v1/public/posts");
    expect(res.body.data).toHaveLength(0);
  });

  it("never exposes SMTP credentials publicly", async () => {
    await request(app)
      .put("/api/v1/admin/settings")
      .set(auth(admin))
      .send({ smtp: { host: "smtp.test", user: "u", password: "SuperSecret123" } });

    const res = await request(app).get("/api/v1/public/settings");
    expect(JSON.stringify(res.body)).not.toContain("SuperSecret123");
    expect(res.body.data.smtp).toBeUndefined();
  });
});

describe("SMTP password handling", () => {
  it("never returns the password, only whether one is set", async () => {
    await request(app)
      .put("/api/v1/admin/settings")
      .set(auth(admin))
      .send({ smtp: { host: "smtp.test", user: "u", password: "SuperSecret123" } });

    const res = await request(app).get("/api/v1/admin/settings").set(auth(admin));
    expect(JSON.stringify(res.body)).not.toContain("SuperSecret123");
    expect(res.body.data.smtp.passwordSet).toBe(true);
  });

  it("keeps the stored password when saving other SMTP fields", async () => {
    // Regression: `$set: { smtp: {...} }` replaced the whole subdocument and
    // silently wiped the credential. Cost: lead emails die days later.
    await request(app)
      .put("/api/v1/admin/settings")
      .set(auth(admin))
      .send({ smtp: { host: "smtp.test", user: "u", password: "SuperSecret123" } });

    await request(app)
      .put("/api/v1/admin/settings")
      .set(auth(admin))
      .send({ smtp: { port: 465, secure: true, password: "" } });

    const res = await request(app).get("/api/v1/admin/settings").set(auth(admin));
    expect(res.body.data.smtp.passwordSet).toBe(true);
    expect(res.body.data.smtp.port).toBe(465);
  });
});

describe("upload validation", () => {
  const PNG = Buffer.from(
    "89504e470d0a1a0a0000000d494844520000000100000001080600000" +
      "01f15c4890000000a49444154789c6300010000050001" +
      "0d0a2db40000000049454e44ae426082",
    "hex"
  );

  it("accepts a real PNG", async () => {
    const res = await request(app)
      .post("/api/v1/admin/media/upload")
      .set(auth(admin))
      .attach("file", PNG, { filename: "real.png", contentType: "image/png" })
      .field("alt", "A real png");

    expect(res.status).toBe(201);
    expect(res.body.data.mimeType).toBe("image/png");
    // Client filename must never be trusted for the stored path.
    expect(res.body.data.url).not.toContain("real.png");
  });

  it("rejects a webshell disguised as image/png", async () => {
    // Extension AND Content-Type both lie; only magic-number sniffing catches it.
    const evil = Buffer.from('<?php system($_GET["c"]); ?>');
    const res = await request(app)
      .post("/api/v1/admin/media/upload")
      .set(auth(admin))
      .attach("file", evil, { filename: "shell.png", contentType: "image/png" });

    expect(res.status).toBe(400);
  });
});

describe("input validation", () => {
  it("rejects unknown enum values", async () => {
    const res = await request(app)
      .get("/api/v1/admin/projects?category=bogus")
      .set(auth(admin));
    expect(res.status).toBe(400);
    expect(res.body.error.fields.category).toBeTruthy();
  });

  it("returns a clean 400 for a malformed id, not a cast crash", async () => {
    const res = await request(app).get("/api/v1/admin/services/not-an-id").set(auth(admin));
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("reports nested field errors by path", async () => {
    const res = await request(app)
      .post("/api/v1/admin/team")
      .set(auth(admin))
      .send({ name: "Bad URL", socials: { linkedin: "not-a-url" } });
    expect(res.status).toBe(400);
    expect(res.body.error.fields["socials.linkedin"]).toBeTruthy();
  });
});
