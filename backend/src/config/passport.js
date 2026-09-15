import passport from "passport";
import passportLocal from "passport-local";

import User from "../models/user.js";

const { Strategy: LocalStrategy } = passportLocal;

passport.use(new LocalStrategy({
      usernameField: "emailID"
    },
    User.authenticate()
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());