import express from 'express';
import bullBoardAdapter from '../controllers/bullboardController.js';

const router = express.Router();

// Mount Bull Board router
router.use('/admin/queues', bullBoardAdapter.getRouter());

export default router;
