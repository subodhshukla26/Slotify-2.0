import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import http from "http";
import initSignalingServer from "./src/services/signalingServer.js";
import connectDB from "./src/config/db.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./src/config/passport.js";
import authRoutes from "./src/routes/authRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import availabilityRoutes from "./src/routes/availabilityRoutes.js";
import { notFound, errorHandler } from "./src/middlewares/errorMiddleware.js";


const app = express();
const PORT = process.env.PORT || 8000;
const CLIENT_URLS = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());
const SESSION_SECRET = process.env.SESSION_SECRET || "slotify_dev_secret";
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.MONGO_URI) {
  throw new Error("Missing MONGO_URI environment variable");
}

// Global middleware
// Temporarily disable Helmet to debug 403 issues
// app.use(
//   helmet({
//     contentSecurityPolicy: false, // Disable CSP for OAuth redirects
//     crossOriginEmbedderPolicy: false,
//   })
// );
// CORS Configuration
const corsOptions = {
  origin: isProduction ? CLIENT_URLS : true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

// Sessions
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => res.json({ status: "ok" }));
app.get("/health", (req, res) => res.json({ status: "healthy", timestamp: new Date().toISOString() }));
app.use("/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", availabilityRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    // Create HTTP server for Socket.io
    const server = http.createServer(app);

    // Initialize Signaling Server
    initSignalingServer(server, corsOptions);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();