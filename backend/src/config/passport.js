import passport from "passport";
import passportLocal from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/user.js";

const { Strategy: LocalStrategy } = passportLocal;

passport.use(new LocalStrategy({
      usernameField: "emailID"
    },
    User.authenticate()
  )
);

passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Checking if a user with this Google ID already exists
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user); // Log them in
        }

        // If not, check if this email already belongs to a local account
        const email = profile.emails[0].value;
        const existingLocalUser = await User.findOne({ emailID: email });
        
        if (existingLocalUser) {
          // Do NOT automatically link. Force them to use local login.
          return done(null, false, { message: "An account with this email already exists. Please log in with your password." });
        }

        // New Google user
        const newUser = new User({
          username: profile.displayName,
          emailID: email,
          googleId: profile.id,
          image: profile.photos[0]?.value || ""
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());