import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("route validation and auth", () => {
  it("rejects invalid contact form input before hitting the database", async () => {
    const res = await request(app).post("/api/v1/contact").send({
      name: "E",
      email: "not-an-email",
      message: "short",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation Error");
    expect(res.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ["body", "email"] }),
        expect.objectContaining({ path: ["body", "message"] }),
      ])
    );
  });

  it("rejects invalid login payload before checking credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "bad-email",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: "Validation Error",
    });
  });

  it("blocks protected blog creation when no token is provided", async () => {
    const res = await request(app).post("/api/v1/blog").send({
      title: "Test post",
      excerpt: "This is a valid excerpt for the test.",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      success: false,
      message: "You are not authorized",
    });
  });

  it("rejects invalid blog list query parameters", async () => {
    const res = await request(app).get("/api/v1/blog?featured=maybe");

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: "Validation Error",
    });
  });
});
