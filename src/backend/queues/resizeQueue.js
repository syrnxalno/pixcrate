import { Queue} from "bullmq";
import redisConnect from '../config/redisConfig.js'

const resizeQueue = new Queue('resizeQueue',{
    connection : redisConnect
})

export default resizeQueue;