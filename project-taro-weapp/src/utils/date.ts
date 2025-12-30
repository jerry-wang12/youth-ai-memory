/**
 * 日期时间工具函数
 */

import { useLocaleStore } from '@/stores/locale'

/**
 * 格式化日期
 * @param dateStr 日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''

  const localeStore = useLocaleStore()
  const date = new Date(dateStr)

  if (isNaN(date.getTime())) return dateStr

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  if (localeStore.isZh) {
    return `${year}年${month}月${day}日`
  } else {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getMonth()]} ${day}, ${year}`
  }
}

/**
 * 格式化日期时间
 * @param dateStr 日期时间字符串
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return ''

  const localeStore = useLocaleStore()
  const date = new Date(dateStr)

  if (isNaN(date.getTime())) return dateStr

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')

  if (localeStore.isZh) {
    return `${year}年${month}月${day}日 ${hours}:${minutes}`
  } else {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const hour12 = hours % 12 || 12
    const ampm = hours < 12 ? 'AM' : 'PM'
    return `${monthNames[date.getMonth()]} ${day}, ${year} ${hour12}:${minutes} ${ampm}`
  }
}

/**
 * 格式化时间范围
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 格式化后的时间范围字符串
 */
export function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return ''

  const localeStore = useLocaleStore()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return `${startDate} - ${endDate}`
  }

  const startMonth = start.getMonth() + 1
  const startDay = start.getDate()
  const endMonth = end.getMonth() + 1
  const endDay = end.getDate()

  if (localeStore.isZh) {
    return `${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`
  } else {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[start.getMonth()]} ${startDay} - ${monthNames[end.getMonth()]} ${endDay}`
  }
}

/**
 * 获取相对时间描述
 * @param dateStr 日期字符串
 * @returns 相对时间描述
 */
export function getRelativeTime(dateStr: string): string {
  if (!dateStr) return ''

  const localeStore = useLocaleStore()
  const date = new Date(dateStr)
  const now = new Date()

  if (isNaN(date.getTime())) return dateStr

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) {
    return localeStore.isZh ? '刚刚' : 'Just now'
  }

  if (diffMinutes < 60) {
    return localeStore.isZh ? `${diffMinutes}分钟前` : `${diffMinutes} min ago`
  }

  if (diffHours < 24) {
    return localeStore.isZh ? `${diffHours}小时前` : `${diffHours} hr ago`
  }

  if (diffDays < 7) {
    return localeStore.isZh ? `${diffDays}天前` : `${diffDays} days ago`
  }

  return formatDate(dateStr)
}

