import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject("CACHE_MANAGER") private readonly cacheManager: Cache) {}

  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }
}
