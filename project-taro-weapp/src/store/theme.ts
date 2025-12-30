import { reactive, readonly, watch } from 'vue'
import Taro from '@tarojs/taro'

/**
 * 主题色配置
 */
export const THEME_COLORS = {
  blue: {
    primary: '#326292',
    light: 'rgba(50, 98, 146, 0.1)',
    lighter: 'rgba(50, 98, 146, 0.08)',
    lightest: 'rgba(50, 98, 146, 0.03)'
  },
  red: {
    primary: '#A6413A',
    light: 'rgba(166, 65, 58, 0.1)',
    lighter: 'rgba(166, 65, 58, 0.08)',
    lightest: 'rgba(166, 65, 58, 0.03)'
  }
} as const

export type ThemeType = keyof typeof THEME_COLORS

/**
 * 主题状态接口
 */
interface ThemeState {
  currentTheme: ThemeType
  currentColor: string
}

/**
 * 主题全局状态
 */
const state = reactive<ThemeState>({
  currentTheme: 'blue',
  currentColor: THEME_COLORS.blue.primary
})

// 从本地存储加载主题设置
const loadTheme = () => {
  try {
    const savedTheme = Taro.getStorageSync('theme') as ThemeType
    if (savedTheme && THEME_COLORS[savedTheme]) {
      state.currentTheme = savedTheme
      state.currentColor = THEME_COLORS[savedTheme].primary
    }
  } catch (error) {
    console.error('加载主题设置失败:', error)
  }
}

// 初始化时加载主题
loadTheme()

/**
 * 更新页面主题
 */
const updatePageTheme = (theme: ThemeType) => {
  try {
    const colors = THEME_COLORS[theme]

    // Web 环境
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--color-primary', colors.primary)
      document.documentElement.style.setProperty('--color-primary-light', colors.light)
      document.documentElement.style.setProperty('--color-primary-lighter', colors.lighter)
      document.documentElement.style.setProperty('--color-primary-lightest', colors.lightest)
    }
    // 小程序环境
    else {
      const pages = Taro.getCurrentPages()
      if (pages.length > 0) {
        pages.forEach((page: any) => {
          if (page.$vm && page.$vm.$forceUpdate) {
            page.$vm.$forceUpdate()
          }
        })
      }
    }
  } catch (error) {
    console.error('更新主题失败:', error)
  }
}

// 监听主题变化，自动保存到本地存储并更新 CSS 变量
watch(
  () => state.currentTheme,
  (newTheme) => {
    try {
      Taro.setStorageSync('theme', newTheme)
      state.currentColor = THEME_COLORS[newTheme].primary
      updatePageTheme(newTheme)
    } catch (error) {
      console.error('保存主题设置失败:', error)
    }
  }
)

/**
 * 切换主题
 */
export const toggleTheme = () => {
  state.currentTheme = state.currentTheme === 'blue' ? 'red' : 'blue'
}

/**
 * 设置主题
 */
export const setTheme = (theme: ThemeType) => {
  if (THEME_COLORS[theme]) {
    state.currentTheme = theme
  }
}

/**
 * 导出只读状态
 */
export const themeState = readonly(state)

/**
 * 导出可修改的状态（用于组件内部）
 */
export const useThemeState = () => state

