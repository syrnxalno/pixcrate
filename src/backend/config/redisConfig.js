import redis from 'ioredis'

const redisConfig = {
    port : 6379,
    host : "127.0.0.1",
    maxRetriesPerRequest : null,
    enableReadyCheck : null
}

const redisConnect = new redis(redisConfig);
export default redisConnect;