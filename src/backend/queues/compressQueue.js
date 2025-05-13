import { Queue } from "bullmq";
import redisConnect from '../config/redisConfig.js'


const compressQueue = new Queue('compressQueue',{
    connection : redisConnect
})

export default compressQueue;