import session from 'express-session';
import dotenv from 'dotenv';
import redisConnect from '../config/redisConfig.js';

dotenv.config();

export default async function setupSession(app) {
  const { RedisStore } = await import('connect-redis');

  const store = new RedisStore({
    client: redisConnect,
  });

  app.use(session({
    store,
    secret: process.env.SESSION_SECRET || 'syrnxalno',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  }));

  app.get('/setSessionData', (req, res) => {
    const username = req.query.username;
    if (!username) {
      return res.status(400).send('Please provide a username');
    }
    req.session.username = username;
    res.send(`Username set to ${username}`);
  });

  app.get('/getSessionData', (req, res) => {
    const username = req.session.username;
    if (!username) {
      return res.send('No username set in session');
    }
    res.send('Username: ' + username);
  });
}
