import request from "supertest";
import type { Express } from "express";
import { auth, makeApp, makeUser, resetDb, tokenFor } from "./helpers.js";

let app: Express;

beforeAll(async () => {
  app = await makeApp();
});
beforeEach(resetDb);

describe("auth", () => {
  it("logs in with valid credentials and never returns the password hash", async () => {
    await makeUser("admin");
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@test.com", password: "TestPass123!" });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toContain("TestPass123!");
  });

  it("sets the refresh token as an httpOnly, SameSite=Strict cookie", async () => {
    await makeUser("admin");
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@test.com", password: "TestPass123!" });

    const cookie = res.headers["set-cookie"][0];
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Strict");
  });

  it("gives an identical error for a wrong password and an unknown user", async () => {
    // Differing messages would turn login into a user-enumeration oracle.
    await makeUser("admin");
    const wrongPw = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@test.com", password: "nope" });
    const noUser = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ghost@test.com", password: "nope" });

    expect(wrongPw.status).toBe(401);
    expect(noUser.status).toBe(401);
    expect(wrongPw.body.error.message).toBe(noUser.body.error.message);
  });

  it("rejects a request with no token", async () => {
    const res = await request(app).get("/api/v1/admin/services");
    expect(res.status).toBe(401);
  });

  it("rejects a malformed token", async () => {
    const res = await request(app).get("/api/v1/auth/me").set(auth("garbage.token.here"));
    expect(res.status).toBe(401);
  });

  it("revokes refresh tokens on logout", async () => {
    await makeUser("admin");
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@test.com", password: "TestPass123!" });
    const cookie = login.headers["set-cookie"];

    await request(app).post("/api/v1/auth/logout").set("Cookie", cookie).expect(204);

    // The cookie is still syntactically valid — tokenVersion is what invalidates it.
    const res = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookie);
    expect(res.status).toBe(401);
  });

  it("locks the account after repeated failures", async () => {
    await makeUser("admin");
    // The IP rate limiter also fires here; either 401→423 or 429 is a pass —
    // what matters is that unlimited guessing is impossible.
    let sawBlock = false;
    for (let i = 0; i < 12; i++) {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "admin@test.com", password: "wrong" });
      if (res.status === 423 || res.status === 429) {
        sawBlock = true;
        break;
      }
    }
    expect(sawBlock).toBe(true);
  });
});

describe("rbac", () => {
  it("lets a viewer read but not write", async () => {
    const token = await tokenFor(app, "viewer");
    await request(app).get("/api/v1/admin/services").set(auth(token)).expect(200);

    const res = await request(app)
      .post("/api/v1/admin/services")
      .set(auth(token))
      .send({ title: "Viewer should not create this" });
    expect(res.status).toBe(403);
  });

  it("denies settings to an editor but allows leads", async () => {
    const token = await tokenFor(app, "editor");
    await request(app).get("/api/v1/admin/settings").set(auth(token)).expect(403);
    await request(app).get("/api/v1/admin/leads").set(auth(token)).expect(200);
  });

  it("allows an admin into settings", async () => {
    const token = await tokenFor(app, "admin");
    await request(app).get("/api/v1/admin/settings").set(auth(token)).expect(200);
  });
});
