import { Redis } from "@upstash/redis";

let redis;

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('UPSTASH_REDIS_REST_TOKEN not found, using mock Redis');
  redis = {
    get: async () => null,
    set: async () => null,
    incr: async () => 1,
  };
} else {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export default redis;
