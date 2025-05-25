import express from 'express';
import dotenv from 'dotenv';
import sessionMiddleware from './middlewares/sessionMiddleware.js';
import passport from 'passport';
import './config/passportConfig.js';
import cors from 'cors';

import imageRoutes from './routes/imageRoutes.js';
import authRoutes from './routes/oauthRoutes.js';
import bullboardRoutes from './routes/bullboardRoutes.js';

import { resizeWorker } from './workers/resizeWorker.js';
import { compressWorker } from './workers/compressWorker.js';
import { watermarkWorker } from './workers/watermarkWorker.js';
import { saveImageWorker } from './workers/saveimageWorker.js';
import { markWorkersAsReady, initializeFlowProducer } from './controllers/imageController.js';
import setupSession from './middlewares/sessionMiddleware.js';

dotenv.config();

const app = express();
await setupSession(app);
const PORT = process.env.PORT || 8080
app.use(passport.initialize());
sessionMiddleware(app);
app.use(passport.session());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes (attached later)
app.use('/', imageRoutes);
app.use('/', authRoutes);
app.use('/', bullboardRoutes);


const startServer = async () => {
  try {
    await Promise.all([
      resizeWorker.waitUntilReady(),
      compressWorker.waitUntilReady(),
      watermarkWorker.waitUntilReady(),
      saveImageWorker.waitUntilReady()
    ]);

    console.log('All workers are ready.');

    initializeFlowProducer();
    markWorkersAsReady();
    app.listen(PORT, () => {
      console.log(
        `App is running on http://localhost:${PORT} in ${app.get('env')} mode.`
      );
      console.log('Press CTRL-C to stop.');

    });
  } catch (err) {
    console.error('Worker initialization failed:', err);
    process.exit(1); // Fail fast
  }
};

startServer();
