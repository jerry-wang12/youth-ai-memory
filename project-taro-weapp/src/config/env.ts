/**
 * 环境配置
 * 根据不同环境配置不同的 API 地址和其他参数
 */

/**
 * 环境类型
 */
export type EnvType = 'development' | 'test' | 'production'

/**
 * 环境配置接口
 */
interface EnvConfig {
  /** API 基础地址 */
  apiBaseUrl: string
  /** 是否开启调试模式 */
  debug: boolean
  /** 是否开启 mock 数据 */
  mock: boolean
  /** 超时时间（毫秒） */
  timeout: number
}

/**
 * 各环境配置
 * TODO: 请根据实际项目修改以下配置
 */
const envConfigs: Record<EnvType, EnvConfig> = {
  // 开发环境
  development: {
    apiBaseUrl: 'http://localhost:8080/api',
    debug: true,
    mock: false,
    timeout: 30000
  },

  // 测试环境
  test: {
    apiBaseUrl: 'https://test-api.example.com/api',
    debug: true,
    mock: false,
    timeout: 30000
  },

  // 生产环境
  production: {
    apiBaseUrl: 'https://api.example.com/api',
    debug: false,
    mock: false,
    timeout: 20000
  }
}

/**
 * 获取当前环境
 */
const getCurrentEnv = (): EnvType => {
  const nodeEnv = process.env.NODE_ENV

  // 如果设置了自定义环境变量 TARO_APP_ENV
  const customEnv = process.env.TARO_APP_ENV as EnvType
  if (customEnv && envConfigs[customEnv]) {
    return customEnv
  }

  // 根据 NODE_ENV 判断
  if (nodeEnv === 'production') {
    return 'production'
  }

  // 默认开发环境
  return 'development'
}

/**
 * 当前环境
 */
export const currentEnv = getCurrentEnv()

/**
 * 当前环境配置
 */
export const config = envConfigs[currentEnv]

/**
 * 打印环境信息
 */
if (config.debug) {
  console.log('='.repeat(50))
  console.log(`[Env Config] 当前环境: ${currentEnv}`)
  console.log(`[Env Config] API 地址: ${config.apiBaseUrl}`)
  console.log(`[Env Config] 调试模式: ${config.debug}`)
  console.log(`[Env Config] Mock 模式: ${config.mock}`)
  console.log('='.repeat(50))
}

/**
 * 导出配置（方便其他模块使用）
 */
export default config

