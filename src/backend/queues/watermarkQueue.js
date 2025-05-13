import { Queue } from "bullmq";
import redisConnect from "../config/redisConfig.js";

const watermarkQueue = new Queue('watermarkQueue',{
    connection : redisConnect
})

export default watermarkQueue;