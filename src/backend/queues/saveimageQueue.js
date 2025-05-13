import { Queue } from "bullmq";
import redisConnect from "../config/redisConfig.js";

const saveImageQueue = new Queue("saveImageQueue", {
    connection: redisConnect,
});

export default saveImageQueue;
