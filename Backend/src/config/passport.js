import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config({ path: '.env' });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        profile,
        tokens: { access_token: accessToken, refresh_token: refreshToken },
      };
      return done(null, user);
    }
  )
);
// Serialization :- Decide what piece of user data to save in session
passport.serializeUser((user, done) => done(null, user));
// Deserialization :- Use that saved ID to fetch user details later.
passport.deserializeUser((user, done) => done(null, user));

export default passport;

