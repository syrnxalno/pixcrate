import { Worker } from "bullmq";
import redisConnect from "../config/redisConfig.js";
import saveImage from "../utils/saveImage.js";

let saveImageWorker;

try {
    saveImageWorker = new Worker("saveImageQueue", async (job) => {
        console.log(`Save image worker processing job with name: ${job.name}`);
        return await saveImage(job);
    }, { connection: redisConnect });

    saveImageWorker.on("completed", (job) => {
        console.log(`Save image process ${job.id} has finished`);
    });

    saveImageWorker.on("failed", (job, err) => {
        console.log(`Save image process ${job.id} has failed with error: ` + err);
    });
} catch (e) {
    console.error("Error initializing saveImageWorker:", e);
    throw e;
}
export { saveImageWorker };
