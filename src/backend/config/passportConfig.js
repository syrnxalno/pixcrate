import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
//import User from '../models/User.js'; 

dotenv.config();

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // const user = await User.findOrCreate({ githubId: profile.id });
      // return done(null, user);
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
    //const user = await User.findById(id);
    done(null, id);
  } catch (err) {
    done(err, null);
  }
});
