import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config({ path: ".env" });

// Only register Google strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const primaryEmail = profile.emails?.[0]?.value;

          if (!primaryEmail) {
            return done(new Error("Google account does not have a public email"), null);
          }

          const avatar = profile.photos?.[0]?.value;
          
          // Calculate token expiry (typically 1 hour)
          const expiryDate = new Date(Date.now() + 3600 * 1000);

          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email: primaryEmail });
          }

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName || `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim(),
              email: primaryEmail,
              avatar,
              googleTokens: {
                accessToken,
                refreshToken,
                expiryDate
              }
            });
          } else {
            let shouldSave = false;
            if (!user.googleId) {
              user.googleId = profile.id;
              shouldSave = true;
            }
            if (avatar && user.avatar !== avatar) {
              user.avatar = avatar;
              shouldSave = true;
            }
            // Always update tokens
            user.googleTokens = {
              accessToken,
              refreshToken: refreshToken || user.googleTokens?.refreshToken, // Keep old refresh token if new one not provided
              expiryDate
            };
            shouldSave = true;
            
            if (shouldSave) {
              await user.save();
            }
          }

          return done(null, user);
        } catch (error) {
          console.error("Error in Google OAuth callback:", error);
          return done(error, null);
        }
      }
    )
  );
  console.log("Google OAuth strategy registered successfully");
} else {
  console.warn("Google OAuth credentials not found. Google authentication will not be available.");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

