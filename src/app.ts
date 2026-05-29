import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { apiLimiter } from "./app/middleware/rateLimiter";

const app: Application = express();

app.set("trust proxy", 1);

// CORS — allow local dev + any configured origins (comma-separated env var)
const envAllowed = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = new Set<string>([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...envAllowed,
]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without origin (server-to-server, curl, mobile webviews)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      try {
        const hostname = new URL(origin).hostname;
        // Allow any localhost / loopback origin on any port (dev convenience)
        if (
          hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          hostname === "[::1]" ||
          hostname === "::1"
        ) {
          return callback(null, true);
        }
        // Allow any *.vercel.app preview/prod by default
        if (/\.vercel\.app$/i.test(hostname)) return callback(null, true);
      } catch {
        /* malformed origin → fall through and reject */
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Backend is running successfully 🏃🏻‍♂️‍➡️",
  });
});

app.use("/api/v1", apiLimiter, router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
