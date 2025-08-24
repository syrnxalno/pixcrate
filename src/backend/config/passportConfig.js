import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      return done(null,profile);
    } catch (err) {
      return done(err);
    }
  }
));

//Serialize / Deserialize user (for later)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    done(null, id);
  } catch (err) {
    done(err, null);
  }
});
// todo : create models for entities and centralize using index files
