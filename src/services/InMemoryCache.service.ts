import { injectable } from "tsyringe";

interface CacheItem<T> {
  value: T;
  expirationTime: number;
}

@injectable()
export class InMemoryCacheService<T = string> {
  private cache: Map<string, CacheItem<T>> = new Map();

  // Set a value in the cache with an optional expiration time (in milliseconds)
  set(key: string, value: T, expirationTime: number = Infinity): void {
    if (expirationTime <= 0) {
      throw new Error("Expiration time must be greater than zero.");
    }

    const expirationTimestamp = Date.now() + expirationTime;
    this.cache.set(key, { value, expirationTime: expirationTimestamp });
  }

  // Get a value from the cache. Returns undefined if key not found or expired.
  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (item && item.expirationTime > Date.now()) {
      return item.value;
    }

    // Remove expired item from cache
    this.cache.delete(key);
    return undefined;
  }

  // Clear the entire cache or a specific key
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Check if a key exists in the cache and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key);
    return !!item && item.expirationTime > Date.now();
  }
}
