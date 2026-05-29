import { rateLimit } from "express-rate-limit";

type RateLimiterOptions = {
  windowMs: number;
  limit: number;
  message: string;
};

export const createRateLimiter = ({
  windowMs,
  limit,
  message,
}: RateLimiterOptions) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: "Too many API requests. Please try again later.",
});

export const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many contact requests. Please try again later.",
});
