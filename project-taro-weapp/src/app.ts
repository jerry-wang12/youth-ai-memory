import { createApp } from 'vue'
import { useThemeState, THEME_COLORS } from './store/theme'
import { pinia } from './stores'
import { useLocaleStore } from './stores/locale'
import { setupTextEncoderPolyfill } from './utils/text-encoder-polyfill'

import './app.scss'

// 为小程序环境添加 TextEncoder polyfill
setupTextEncoderPolyfill()

const App = createApp({
  onShow () {
    console.log('App onShow.')

    // 应用主题色
    const themeState = useThemeState()
    const colors = THEME_COLORS[themeState.currentTheme]

    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--color-primary', colors.primary)
      document.documentElement.style.setProperty('--color-primary-light', colors.light)
      document.documentElement.style.setProperty('--color-primary-lighter', colors.lighter)
      document.documentElement.style.setProperty('--color-primary-lightest', colors.lightest)
    }
  },
  onLaunch () {
    console.log('App onLaunch.')

    // 初始化语言设置（确保在所有页面加载前完成）
    const localeStore = useLocaleStore()
    localeStore.initLocale()
    console.log('语言设置已初始化:', localeStore.currentLocale)
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

// 使用 Pinia
App.use(pinia)

export default App

