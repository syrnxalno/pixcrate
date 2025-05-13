import session from 'express-session';
import dotenv from 'dotenv'
dotenv.config()

export default function setupSession(app) {
    app.use(session({
      secret: process.env.SESSION_SECRET || 'syrnxalno',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false } 
    }));
  }