import Redis from "ioredis";
import { config } from "../config/env";

let redisClient: Redis | null = null;
let redisErrorLogged = false;

export function getRedisClient(): Redis | null {
  if (!redisClient) {
    try {
      // Check if Redis configuration is available
      if (!config.redis.url || !config.redis.token) {
        if (!redisErrorLogged) {
          console.log("⚠️  Redis configuration missing - running without cache");
          redisErrorLogged = true;
        }
        return null;
      }

      redisClient = new Redis(config.redis.url, {
        password: config.redis.token,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        connectTimeout: 10000,
        lazyConnect: false,
      });

      redisClient.on("connect", () => console.log("✅ Redis connected"));
      redisClient.on("error", (err) => {
        if (!redisErrorLogged) {
          console.error("❌ Redis connection failed:", err.message);
          redisErrorLogged = true;
        }
        redisClient = null; // Reset client on error
      });
    } catch (error: unknown) {
      if (!redisErrorLogged) {
        if (error instanceof Error) {
          console.error("❌ Redis initialization failed:", error.message);
        } else {
          console.error("❌ Redis initialization failed with non-Error value:", error);
        }
        redisErrorLogged = true;
      }
      redisClient = null;
    }
  }

  return redisClient;
}

export default getRedisClient;