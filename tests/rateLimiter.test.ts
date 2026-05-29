import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "../src/app/middleware/rateLimiter";

describe("rate limiter", () => {
  it("blocks requests after the configured limit", async () => {
    const app = express();

    app.get(
      "/limited",
      createRateLimiter({
        windowMs: 60 * 1000,
        limit: 2,
        message: "Slow down.",
      }),
      (_req, res) => res.json({ success: true })
    );

    await request(app).get("/limited").expect(200);
    await request(app).get("/limited").expect(200);

    const limited = await request(app).get("/limited").expect(429);

    expect(limited.body).toEqual({
      success: false,
      message: "Slow down.",
    });
    expect(limited.headers.ratelimit).toBeDefined();
  });
});
