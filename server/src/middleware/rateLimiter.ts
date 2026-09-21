import rateLimit from "express-rate-limit"

/**
 * Dedicated rate limiter for login endpoint to prevent brute-force attacks.
 * Limits to 5 attempts per 15-minute window per IP.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "test" ? 100 : 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many login attempts from this IP, please try again after 15 minutes.",
    },
  },
  skip: () => process.env.SKIP_RATE_LIMIT === "true",
})

/**
 * Limiter for OAuth flows and token exchange.
 */
export const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "test" ? 200 : 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many authentication requests, please try again later.",
    },
  },
  skip: () => process.env.SKIP_RATE_LIMIT === "true",
})
