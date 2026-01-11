import express from "express";
import passport from "passport";
import {
  getAuthStatus,
  getCurrentUser,
  logoutUser,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.get("/google", (req, res, next) => {
  // Check if Google OAuth credentials are configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Google OAuth credentials missing:", {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    });
    return res.status(500).json({
      error: "Google OAuth not configured",
      message: "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET",
    });
  }

  // Check if redirect URI is configured
  if (!process.env.GOOGLE_REDIRECT_URI) {
    console.error("Google OAuth redirect URI missing");
    return res.status(500).json({
      error: "Google OAuth not configured",
      message: "Missing GOOGLE_REDIRECT_URI",
    });
  }

  // Check if the Google strategy is registered
  const googleStrategy = passport._strategies?.google;
  if (!googleStrategy) {
    console.error("Google OAuth strategy not registered");
    return res.status(500).json({
      error: "Google OAuth not configured",
      message: "Google OAuth strategy is not available. Please check server configuration.",
    });
  }

  // Use passport.authenticate - it will redirect to Google
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    accessType: 'offline',
    prompt: 'consent', // Force consent screen to get refresh token
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}?auth_error=google`,
    session: true,
  }),
  (req, res) => {
    res.redirect(`${CLIENT_URL}/auth/callback`);
  }
);

router.get("/me", isAuthenticated, getCurrentUser);
router.get("/status", getAuthStatus);
router.post("/logout", isAuthenticated, logoutUser);

export default router;