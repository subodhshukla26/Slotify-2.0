import dotenv from "dotenv";
dotenv.config({ path: '.env' });

import connectDB from "./src/config/db.js";
import express from "express";
import session from "express-session";
import passport from "./src/config/passport.js"
import authRoutes from "./src/routes/authRoutes.js";
import { isAuthenticated } from "./src/middlewares/authMiddleware.js";

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());

// Configure session (needed for Passport sessions)
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Public route
app.get("/", (req, res) => res.send("Booking system backend running"));

// Protected route
app.use("/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

