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

const lead = (over: object = {}) => ({
  name: "Jane Doe",
  email: "jane@acme.com",
  company: "Acme",
  message: "Need a mobile app",
  consent: true,
  ...over,
});

describe("public lead submission", () => {
  it("stores a valid submission", async () => {
    await request(app).post("/api/v1/public/leads").send(lead()).expect(201);

    const res = await request(app).get("/api/v1/admin/leads").set(auth(admin));
    expect(res.body.meta.total).toBe(1);
    expect(res.body.data[0].status).toBe("new");
  });

  it("requires consent (GDPR)", async () => {
    const res = await request(app).post("/api/v1/public/leads").send(lead({ consent: undefined }));
    expect(res.status).toBe(400);
    expect(res.body.error.fields.consent).toBeTruthy();
  });

  it("silently drops honeypot submissions without revealing the trap", async () => {
    // Regression: Zod used to reject with a `website` field error, telling the
    // bot exactly which field caught it. It must look like success.
    const res = await request(app)
      .post("/api/v1/public/leads")
      .send(lead({ name: "SpamBot", website: "http://spam.ru" }));

    expect(res.status).toBe(201);
    expect(res.body.data.received).toBe(true);
    expect(JSON.stringify(res.body)).not.toContain("website");

    const list = await request(app).get("/api/v1/admin/leads").set(auth(admin));
    expect(list.body.meta.total).toBe(0);
  });
});

describe("lead workflow", () => {
  const create = async () => {
    await request(app).post("/api/v1/public/leads").send(lead());
    const list = await request(app).get("/api/v1/admin/leads").set(auth(admin));
    return list.body.data[0]._id;
  };

  it("moves through statuses", async () => {
    const id = await create();
    const res = await request(app)
      .patch(`/api/v1/admin/leads/${id}`)
      .set(auth(admin))
      .send({ status: "qualified" });
    expect(res.body.data.status).toBe("qualified");
  });

  it("rejects an invalid status", async () => {
    const id = await create();
    const res = await request(app)
      .patch(`/api/v1/admin/leads/${id}`)
      .set(auth(admin))
      .send({ status: "bogus" });
    expect(res.status).toBe(400);
  });

  it("records follow-up notes with their author", async () => {
    const id = await create();
    const res = await request(app)
      .post(`/api/v1/admin/leads/${id}/notes`)
      .set(auth(admin))
      .send({ body: "Called — proposal Monday." });

    expect(res.status).toBe(201);
    expect(res.body.data.notes).toHaveLength(1);
    expect(res.body.data.notes[0].author.name).toBe("admin");
  });
});

describe("CSV export", () => {
  it("neutralises formula injection", async () => {
    // A field starting with = + - @ executes as a formula in Excel/Sheets.
    // The value comes from a public form, so this is a real attack path.
    await request(app)
      .post("/api/v1/public/leads")
      .send(lead({ name: "=cmd|'/c calc'!A1", company: "+HYPERLINK(\"http://evil\")", message: "@SUM(1+1)" }));

    const res = await request(app).get("/api/v1/admin/leads/export.csv").set(auth(admin));
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");

    expect(res.text).toContain("\"'=cmd");
    expect(res.text).toContain("\"'+HYPERLINK");
    expect(res.text).toContain("\"'@SUM");
    // The raw formula must never appear unprefixed at the start of a cell.
    expect(res.text).not.toMatch(/,"=cmd/);
  });
});

describe("GDPR erasure", () => {
  it("scrubs personal data but keeps the row for counts", async () => {
    await request(app).post("/api/v1/public/leads").send(lead());
    const list = await request(app).get("/api/v1/admin/leads").set(auth(admin));
    const id = list.body.data[0]._id;

    await request(app)
      .post(`/api/v1/admin/leads/${id}/notes`)
      .set(auth(admin))
      .send({ body: "note with personal detail" });

    const res = await request(app).delete(`/api/v1/admin/leads/${id}/pii`).set(auth(admin));

    expect(res.status).toBe(200);
    const d = res.body.data;
    expect(d.name).toBe("[erased]");
    expect(d.email).not.toContain("jane@acme.com");
    expect(d.phone).toBe("");
    expect(d.company).toBe("");
    expect(d.ipAddress).toBeNull();
    expect(d.notes).toHaveLength(0);
    expect(d.anonymizedAt).toBeTruthy();

    // The record itself survives, so historical reporting stays accurate.
    const after = await request(app).get("/api/v1/admin/leads").set(auth(admin));
    expect(after.body.meta.total).toBe(1);
  });
});

