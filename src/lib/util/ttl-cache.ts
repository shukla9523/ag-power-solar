/**
 * Purpose: small in-process TTL cache (no Redis) shared by server code and middleware.
 *
 * Why: Vercel keeps warm function instances alive between requests, so a bounded
 * Map with per-entry expiry removes repeated Supabase round-trips (sessions, roles,
 * site settings, keyword maps) without an external cache service. Every entry
 * expires on its own TTL, the map is size-bounded (oldest entries evicted first),
 * and concurrent misses for the same key share one in-flight promise.
 */

type Entry<V> = { value: V; expiresAt: number }

export class TtlCache<V> {
  private store = new Map<string, Entry<V>>()
  private inflight = new Map<string, Promise<V>>()

  constructor(private readonly defaultTtlMs: number, private readonly maxEntries = 500) {}

  get(key: string): V | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key: string, value: V, ttlMs = this.defaultTtlMs): void {
    if (ttlMs <= 0) return
    if (this.store.has(key)) this.store.delete(key)
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs })
    this.evict()
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  /** Deletes every key that starts with the prefix (or everything when omitted). */
  clear(prefix?: string): void {
    if (!prefix) {
      this.store.clear()
      return
    }
    for (const key of Array.from(this.store.keys())) {
      if (key.startsWith(prefix)) this.store.delete(key)
    }
  }

  /** Returns the cached value or loads it once, even under concurrent calls. */
  async getOrSet(key: string, loader: () => Promise<V>, ttlMs = this.defaultTtlMs): Promise<V> {
    const hit = this.get(key)
    if (hit !== undefined) return hit

    const pending = this.inflight.get(key)
    if (pending) return pending

    const promise = loader()
      .then((value) => {
        this.set(key, value, ttlMs)
        return value
      })
      .finally(() => {
        this.inflight.delete(key)
      })

    this.inflight.set(key, promise)
    return promise
  }

  private evict(): void {
    if (this.store.size <= this.maxEntries) return
    const now = Date.now()
    for (const [key, entry] of Array.from(this.store.entries())) {
      if (entry.expiresAt <= now) this.store.delete(key)
    }
    while (this.store.size > this.maxEntries) {
      const oldest = this.store.keys().next().value
      if (oldest === undefined) break
      this.store.delete(oldest)
    }
  }
}

/**
 * Returns a process-wide cache instance by name so hot reloads and multiple
 * imports of a module share one store.
 */
export function namedCache<V>(name: string, ttlMs: number, maxEntries = 500): TtlCache<V> {
  const registry = globalThis as unknown as { __ttlCaches?: Map<string, TtlCache<unknown>> }
  if (!registry.__ttlCaches) registry.__ttlCaches = new Map()
  let cache = registry.__ttlCaches.get(name) as TtlCache<V> | undefined
  if (!cache) {
    cache = new TtlCache<V>(ttlMs, maxEntries)
    registry.__ttlCaches.set(name, cache as TtlCache<unknown>)
  }
  return cache
}
