import Redis from "ioredis";

const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redisClient = redisToken
  ? new Redis(redisToken)
  : {
      // Mock implementation for build-time
      hgetall: async () => ({}),
    };
