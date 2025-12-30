import type { UserConfigExport } from "@tarojs/cli"

export default {
  logger: {
    quiet: false,
    stats: true
  },
  // 定义环境变量（开发环境）
  defineConstants: {
    'process.env.TARO_APP_ENV': JSON.stringify('development')
  },
  mini: {},
  h5: {}
} satisfies UserConfigExport<'webpack5'>

