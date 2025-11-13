import express from "express";
import passport from "passport";

const router = express.Router();

// Step 1: redirect to Google - sends them to Google’s OAuth 2.0 consent screen
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"]}));

// Step 2: handle Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // User authenticated
        res.redirect("/dashboard"); // or issue a JWT
    }
);

export default router;