import { Worker } from "bullmq";
import redisConnect from "../config/redisConfig.js";
import watermarkImage from "../utils/watermarkImage.js";

try{
const watermarkWorker = new Worker("watermarkQueue", async (job) => {
    console.log(`Watermark worker processing job with name: ${job.name}`);
    return await watermarkImage(job);
}, { connection: redisConnect });

watermarkWorker.on("completed", (job) => {
    console.log(`Watermark process ${job.id} has finished`);
}); 

watermarkWorker.on("failed", (job, err) => {
    console.log(`Watermark process ${job.id} has failed with error: ` + err);
});
}catch (e) {
    console.error("Error initializing watermarkWorker:", e);
    throw e; 
}