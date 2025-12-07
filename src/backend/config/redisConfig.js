import redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config();

const redisConfig = {
    port : process.env.REDIS_PORT,
    host : process.env.REDIS_HOST,
    maxRetriesPerRequest : null,
    enableReadyCheck : null
}

const redisConnect = new redis(redisConfig);
export default redisConnect;