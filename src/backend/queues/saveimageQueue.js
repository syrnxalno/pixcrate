import { Queue } from "bullmq";
import redisConnect from "../config/redisConfig.js";

const saveImageQueue = new Queue("saveImageQueue", {
    connection: redisConnect,
    defaultJobOptions : {
        removeOnComplete : { age: 2 * 24 * 60 * 60 }, 
        removeOnFail: { age: 2 * 24 * 60 * 60 } 
    }
});

export default saveImageQueue;
