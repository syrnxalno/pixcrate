import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';

import resizeQueue from '../queues/resizeQueue.js';
import compressQueue from '../queues/compressQueue.js';
import watermarkQueue from '../queues/watermarkQueue.js';
import saveImageQueue from '../queues/saveImageQueue.js';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(resizeQueue),
    new BullMQAdapter(compressQueue),
    new BullMQAdapter(watermarkQueue),
    new BullMQAdapter(saveImageQueue),
  ],
  serverAdapter,
});

export default serverAdapter;
