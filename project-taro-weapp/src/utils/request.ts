/**
 * HTTP 请求封装
 * 统一处理请求拦截、响应拦截和错误处理
 */

import Taro from '@tarojs/taro'
import envConfig from '@/config/env'
import type { LocaleType } from '@/stores/locale'

/**
 * API 基础地址（从环境配置中获取）
 */
const API_BASE_URL = envConfig.apiBaseUrl

/**
 * 请求超时时间（从环境配置中获取）
 */
const REQUEST_TIMEOUT = envConfig.timeout

/**
 * 语言存储 Key（与 locale store 保持一致）
 */
const LOCALE_STORAGE_KEY = 'app_locale'

/**
 * 获取当前语言设置
 * 直接从 storage 读取，确保与 locale store 保持同步
 */
export function getCurrentLocale(): LocaleType {
  try {
    const locale = Taro.getStorageSync(LOCALE_STORAGE_KEY) as LocaleType
    // 验证 locale 是否有效
    if (locale === 'zh-CN' || locale === 'en-US') {
      return locale
    }
    return 'zh-CN'
  } catch (error) {
    console.error('获取语言设置失败:', error)
    return 'zh-CN'
  }
}

/**
 * 请求配置接口
 */
interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
  header?: Record<string, string>
  needAuth?: boolean  // 是否需要认证
}

/**
 * 获取存储的 Token
 */
function getToken(): string {
  try {
    return Taro.getStorageSync('token') || ''
  } catch (error) {
    console.error('获取 Token 失败:', error)
    return ''
  }
}

/**
 * Token 是否过期
 */
function isTokenExpired(): boolean {
  try {
    const expiredIn = Taro.getStorageSync('token_expired_in')
    if (!expiredIn) return true

    const now = Math.floor(Date.now() / 1000)
    return now >= expiredIn
  } catch (error) {
    return true
  }
}

/**
 * 封装的请求方法
 */
export async function request<T = any>(config: RequestConfig): Promise<T> {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    needAuth = true
  } = config

  // 构造完整 URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  // 请求头
  const requestHeader: Record<string, string> = {
    'Content-Type': 'application/json',
    'Locale': getCurrentLocale(), // 添加语言设置
    ...header
  }

  // 添加认证 Token
  if (needAuth) {
    const token = getToken()

    // 检查 Token 是否过期
    if (isTokenExpired()) {
      Taro.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none',
        duration: 2000
      })

      throw new Error('Token 已过期')
    }

    if (token) {
      requestHeader['Authorization'] = `Bearer ${token}`
    }
  }

  try {
    const response = await Taro.request({
      url: fullUrl,
      method,
      data,
      header: requestHeader,
      timeout: REQUEST_TIMEOUT
    })

    // 检查 HTTP 状态码
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data as T
    }

    // 尝试从响应中提取错误信息
    const responseData = response.data as any
    const errorMessage = responseData?.message || responseData?.error || responseData?.msg || ''

    // 处理特殊状态码
    if (response.statusCode === 401) {
      // Token 无效或过期
      Taro.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none',
        duration: 2000
      })

      throw new Error('未授权访问')
    }

    if (response.statusCode === 403) {
      Taro.showToast({
        title: '没有访问权限',
        icon: 'none'
      })
      throw new Error('没有访问权限')
    }

    if (response.statusCode === 404) {
      Taro.showToast({
        title: '请求的资源不存在',
        icon: 'none'
      })
      throw new Error('资源不存在')
    }

    // 业务错误（400 系列和 500 系列）
    if (response.statusCode >= 400) {
      const msg = errorMessage || (response.statusCode >= 500 ? '服务器错误，请稍后重试' : '请求失败')
      throw new Error(msg)
    }

    // 其他错误
    throw new Error(errorMessage || `请求失败: ${response.statusCode}`)

  } catch (error: any) {
    console.error('请求失败:', error)

    // 网络错误
    if (error.errMsg && error.errMsg.includes('request:fail')) {
      Taro.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
      throw new Error('网络连接失败')
    }

    // 抛出错误
    throw error
  }
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'GET', needAuth })
}

/**
 * POST 请求
 */
export function post<T = any>(
  url: string,
  data?: any,
  needAuth = true
): Promise<T> {
  return request<T>({ url, method: 'POST', data, needAuth })
}

/**
 * PUT 请求
 */
export function put<T = any>(
  url: string,
  data?: any,
  needAuth = true
): Promise<T> {
  return request<T>({ url, method: 'PUT', data, needAuth })
}

/**
 * PATCH 请求
 */
export function patch<T = any>(
  url: string,
  data?: any,
  needAuth = true
): Promise<T> {
  return request<T>({ url, method: 'PATCH', data, needAuth })
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, needAuth = true): Promise<T> {
  return request<T>({ url, method: 'DELETE', needAuth })
}

