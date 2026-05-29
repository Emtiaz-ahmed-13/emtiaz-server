import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("app", () => {
  it("returns a health message from the root route", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body.Message).toContain("Backend is running");
  });

  it("returns structured JSON for unknown routes", async () => {
    const res = await request(app).get("/missing-route");

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      success: false,
      message: "API NOT FOUND!",
      error: {
        path: "/missing-route",
        message: "Your requested path is not found!",
      },
    });
  });
});
