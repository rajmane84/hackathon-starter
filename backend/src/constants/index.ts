import type { CookieOptions } from "express";
import { env } from "../config/env";
import type { CorsOptions } from "cors";

export const baseCookieOptions: CookieOptions = {
  httpOnly: true, // prevents JS access (XSS protection)
  secure: env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax", // protects against CSRF (adjust if needed)
  path: "/", // available across entire app
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // ✅ Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = env.CORS_ORIGIN;

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200, // for legacy browsers
};

export const MAX_SESSIONS = 5; // Maximum concurrent device sessions