import { Worker } from "bullmq";
import redisConnect from "../config/redisConfig.js";
import resizeImage from "../utils/resizeImage.js";

let resizeWorker;

try {
    resizeWorker = new Worker("resizeQueue", async (job) => {
        console.log(`Resize worker processing job with name: ${job.name}`);
        return await resizeImage(job);
    }, { connection: redisConnect });

    resizeWorker.on("completed", (job) => {
        console.log(`Resize process ${job.id} has finished`);
    });

    resizeWorker.on("failed", (job, err) => {
        console.log(`Resize process ${job.id} has failed with error: ` + err);
    });
} catch (e) {
    console.error("Error initializing resizeWorker:", e);
    throw e;
}

export { resizeWorker };
