import request from "supertest";
import type { Express } from "express";
import { auth, makeApp, resetDb, tokenFor } from "./helpers.js";

let app: Express;
let admin: string;
beforeAll(async () => { app = await makeApp(); });
beforeEach(async () => { await resetDb(); admin = await tokenFor(app, "admin"); });

const application = (bytes = Buffer.from("%PDF-1.4\nQA resume\n%%EOF")) => ({
  name: "QA Candidate", fatherName: "QA Parent", email: "candidate@example.com",
  phone: "+923001234567", education: "BS Computer Science", jobTitle: "Web Developer",
  experience: "Experienced in developing React and Node applications.",
  resume: { filename: "resume.pdf", size: bytes.length, mimeType: "application/pdf", dataUrl: `data:application/pdf;base64,${bytes.toString("base64")}` },
});

it("submits an application, lists its metadata, and exposes the résumé in its admin profile", async () => {
  const payload = application();
  await request(app).post("/api/v1/public/applications").send(payload).expect(201);
  const list = await request(app).get("/api/v1/admin/applications?sort=name").set(auth(admin)).expect(200);
  expect(list.body.meta.total).toBe(1);
  expect(list.body.data[0]).toMatchObject({ name: payload.name, status: "new", resume: { filename: "resume.pdf" } });
  expect(list.body.data[0].resume.dataUrl).toBeUndefined();
  const profile = await request(app).get(`/api/v1/admin/applications/${list.body.data[0]._id}`).set(auth(admin)).expect(200);
  expect(profile.body.data.resume.dataUrl).toBe(payload.resume.dataUrl);
});

it("accepts a résumé above the generic 1 MB JSON limit and below the advertised 5 MB file limit", async () => {
  const bytes = Buffer.alloc(1200 * 1024, 32);
  bytes.write("%PDF-1.4");
  await request(app).post("/api/v1/public/applications").send(application(bytes)).expect(201);
});

it("rejects résumé sizes above 5 MB without saving an application", async () => {
  const payload = application();
  payload.resume.size = 5 * 1024 * 1024 + 1;
  await request(app).post("/api/v1/public/applications").send(payload).expect(400);
  const list = await request(app).get("/api/v1/admin/applications").set(auth(admin));
  expect(list.body.meta.total).toBe(0);
});
