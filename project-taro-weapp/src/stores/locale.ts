/**
 * 语言设置 Store
 * 管理全局语言状态
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

/**
 * 支持的语言
 */
export type LocaleType = 'zh-CN' | 'en-US'

/**
 * 语言选项
 */
export interface LocaleOption {
  value: LocaleType
  label: string
  labelEn: string
}

/**
 * 可用的语言选项
 */
export const LOCALE_OPTIONS: LocaleOption[] = [
  { value: 'zh-CN', label: '简体中文', labelEn: 'Chinese' },
  { value: 'en-US', label: 'English', labelEn: 'English' }
]

/**
 * 默认语言
 */
export const DEFAULT_LOCALE: LocaleType = 'zh-CN'

/**
 * 本地存储 Key
 */
const LOCALE_STORAGE_KEY = 'app_locale'

/**
 * 语言设置 Store
 */
export const useLocaleStore = defineStore('locale', () => {
  // 当前语言
  const currentLocale = ref<LocaleType>(DEFAULT_LOCALE)

  // 是否已初始化
  const initialized = ref(false)

  /**
   * 初始化语言设置（从本地存储读取）
   */
  const initLocale = () => {
    if (initialized.value) return

    try {
      const savedLocale = Taro.getStorageSync(LOCALE_STORAGE_KEY) as LocaleType
      if (savedLocale && LOCALE_OPTIONS.some(opt => opt.value === savedLocale)) {
        currentLocale.value = savedLocale
      }
    } catch (error) {
      console.error('读取语言设置失败:', error)
    }
    initialized.value = true
  }

  /**
   * 设置语言
   */
  const setLocale = (locale: LocaleType) => {
    if (!LOCALE_OPTIONS.some(opt => opt.value === locale)) {
      console.error('不支持的语言:', locale)
      return
    }

    currentLocale.value = locale

    // 保存到本地存储
    try {
      Taro.setStorageSync(LOCALE_STORAGE_KEY, locale)
    } catch (error) {
      console.error('保存语言设置失败:', error)
    }
  }

  /**
   * 当前语言是否为中文
   */
  const isZh = computed(() => currentLocale.value === 'zh-CN')

  /**
   * 当前语言是否为英文
   */
  const isEn = computed(() => currentLocale.value === 'en-US')

  /**
   * 当前语言的显示名称
   */
  const currentLocaleName = computed(() => {
    const option = LOCALE_OPTIONS.find(opt => opt.value === currentLocale.value)
    return option?.label || '简体中文'
  })

  /**
   * 获取本地化文本
   * @param zh 中文文本
   * @param en 英文文本
   */
  const t = (zh: string, en: string) => {
    return isZh.value ? zh : en
  }

  return {
    currentLocale,
    initialized,
    initLocale,
    setLocale,
    isZh,
    isEn,
    currentLocaleName,
    t
  }
})

