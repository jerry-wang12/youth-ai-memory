/**
 * 请求缓存工具类
 * 支持 staleTime（数据新鲜度）、cacheTime（缓存保留时间）和 stale-while-revalidate 模式
 */

/**
 * 缓存条目接口
 */
interface CacheEntry<T> {
  data: T
  timestamp: number // 缓存时间戳
  staleTime: number // 数据新鲜度时间（毫秒）
  cacheTime: number // 缓存保留时间（毫秒）
  promise?: Promise<T> // 正在进行的请求 Promise（用于去重）
}

/**
 * 缓存配置接口
 */
interface CacheConfig {
  staleTime?: number // 默认 5 分钟
  cacheTime?: number // 默认 10 分钟
}

/**
 * 默认配置
 */
const DEFAULT_STALE_TIME = 5 * 60 * 1000 // 5 分钟
const DEFAULT_CACHE_TIME = 10 * 60 * 1000 // 10 分钟

/**
 * 请求缓存管理器
 */
class RequestCache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  /**
   * 生成缓存键
   * @param url URL 或标识符
   * @param params 参数对象（可选）
   * @returns 缓存键
   */
  generateKey(url: string, params?: any): string {
    if (!params) {
      return url
    }
    // 将参数序列化为字符串，确保相同参数生成相同键
    const paramStr = JSON.stringify(params, Object.keys(params).sort())
    return `${url}:${paramStr}`
  }

  /**
   * 检查缓存是否过期（超过 cacheTime）
   */
  private isExpired<T>(entry: CacheEntry<T>): boolean {
    const now = Date.now()
    return now - entry.timestamp > entry.cacheTime
  }

  /**
   * 检查数据是否已过期（超过 staleTime）
   */
  private isStale<T>(entry: CacheEntry<T>): boolean {
    const now = Date.now()
    return now - entry.timestamp > entry.staleTime
  }

  /**
   * 清理过期缓存
   */
  private cleanExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.cacheTime) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 获取缓存或发起请求
   * @param key 缓存键
   * @param fetcher 数据获取函数
   * @param config 缓存配置
   * @returns 数据 Promise
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig = {}
  ): Promise<T> {
    const staleTime = config.staleTime ?? DEFAULT_STALE_TIME
    const cacheTime = config.cacheTime ?? DEFAULT_CACHE_TIME

    // 定期清理过期缓存
    this.cleanExpired()

    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    // 如果缓存存在且未过期（在 cacheTime 内）
    if (entry && !this.isExpired(entry)) {
      // 如果数据已过期（超过 staleTime），使用 stale-while-revalidate 模式
      if (this.isStale(entry)) {
        // 立即返回缓存数据
        // 后台异步刷新数据
        this.refreshInBackground(key, fetcher, staleTime, cacheTime)
        return entry.data
      }

      // 数据仍然新鲜，直接返回
      return entry.data
    }

    // 缓存不存在或已过期，发起新请求
    return this.fetchAndCache(key, fetcher, staleTime, cacheTime)
  }

  /**
   * 后台刷新数据（stale-while-revalidate）
   */
  private async refreshInBackground<T>(
    key: string,
    fetcher: () => Promise<T>,
    staleTime: number,
    cacheTime: number
  ): Promise<void> {
    try {
      // 检查是否已有正在进行的请求
      const entry = this.cache.get(key) as CacheEntry<T> | undefined
      if (entry?.promise) {
        // 如果已有请求在进行，等待它完成
        try {
          await entry.promise
        } catch (error) {
          // 忽略后台刷新错误，不影响已返回的缓存数据
          console.warn('后台刷新缓存失败:', error)
        }
        return
      }

      // 发起新请求
      const promise = fetcher()
      
      // 临时保存 Promise 用于去重
      const tempEntry: CacheEntry<T> = {
        data: entry?.data ?? ({} as T), // 保留旧数据
        timestamp: entry?.timestamp ?? Date.now(),
        staleTime,
        cacheTime,
        promise
      }
      this.cache.set(key, tempEntry)

      const data = await promise

      // 更新缓存
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        staleTime,
        cacheTime
      })
    } catch (error) {
      // 后台刷新失败，不影响已返回的缓存数据
      console.warn('后台刷新缓存失败:', error)
      
      // 清除 Promise 标记，允许后续重试
      const entry = this.cache.get(key) as CacheEntry<T> | undefined
      if (entry) {
        delete entry.promise
      }
    }
  }

  /**
   * 发起请求并缓存结果
   */
  private async fetchAndCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    staleTime: number,
    cacheTime: number
  ): Promise<T> {
    // 检查是否已有正在进行的请求（请求去重）
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (entry?.promise) {
      return entry.promise
    }

    // 发起新请求
    const promise = fetcher()

    // 临时保存 Promise 用于去重
    const tempEntry: CacheEntry<T> = {
      data: {} as T, // 临时数据
      timestamp: Date.now(),
      staleTime,
      cacheTime,
      promise
    }
    this.cache.set(key, tempEntry)

    try {
      const data = await promise

      // 更新缓存
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        staleTime,
        cacheTime
      })

      return data
    } catch (error) {
      // 请求失败，清除缓存条目
      this.cache.delete(key)
      throw error
    }
  }

  /**
   * 手动清除指定缓存
   * @param key 缓存键
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * 按前缀清除缓存
   * @param prefix 缓存键前缀
   */
  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }
}

// 导出单例实例
export const requestCache = new RequestCache()

// 导出类型
export type { CacheConfig, CacheEntry }
