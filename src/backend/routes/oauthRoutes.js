import express from 'express';
import { githubAuth, githubCallback, githubCallbackSuccess } from '../controllers/oauthController.js';

const router = express.Router();

router.get('/auth/github', githubAuth);
router.get('/auth/github/callback', githubCallback, githubCallbackSuccess);

export default router;
