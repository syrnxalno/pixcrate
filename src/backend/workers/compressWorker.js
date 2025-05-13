import { Worker } from "bullmq";
import redisConnect from "../config/redisConfig.js";
import compressImg from "../utils/compressImage.js";

let compressWorker;

try {
    compressWorker = new Worker("compressQueue", async (job) => {
        console.log(`Compress worker processing job with name: ${job.name}`);
        return await compressImg(job);
    }, { connection: redisConnect });

    compressWorker.on("completed", (job) => {
        console.log(`Compress process ${job.id} has finished`);
    });

    compressWorker.on("failed", (job, err) => {
        console.log(`Compress process ${job.id} has failed with error: ` + err);
    });
} catch (e) {
    console.error("Error initializing compressWorker:", e);
    throw e;
}

export { compressWorker };
