import type { UserConfigExport } from "@tarojs/cli"

export default {
  // 定义环境变量（生产环境）
  defineConstants: {
    'process.env.TARO_APP_ENV': JSON.stringify('production')
  },
  mini: {},
  h5: {}
} satisfies UserConfigExport<'webpack5'>

