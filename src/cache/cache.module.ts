import { CacheModule as RedistCacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const redisStore = require("cache-manager-redis-store").redisStore;

@Module({
  imports: [
    RedistCacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
