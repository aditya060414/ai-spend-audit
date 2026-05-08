import rateLimit from "express-rate-limit";
import { error } from "node:console";

export const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: "Too many audit requests from this IP. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many submissions from this IP. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
