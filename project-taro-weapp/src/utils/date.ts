/**
 * 日期时间工具函数
 */

import { useLocaleStore } from '@/stores/locale'

/**
 * 格式化日期
 * @param dateStr yyyy-MM-dd 格式的日期字符串
 * @returns 格式化后的日期，中文：2025年3月15日，英文：Mar 15, 2025
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  
  try {
    const localeStore = useLocaleStore()
    // 避免时区偏移：手动解析 yyyy-MM-dd
    const [y, m, d] = dateStr.split('-').map(Number)
    if (!y || !m || !d) return dateStr
    const year = y
    const month = m
    const day = d
    
    if (localeStore.isZh) {
      return `${year}年${month}月${day}日`
    } else {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${monthNames[month - 1]} ${day}, ${year}`
    }
  } catch (error) {
    console.error('日期格式化失败:', error)
    return dateStr
  }
}

/**
 * 格式化时间
 * @param timeStr HH:mm:ss 格式的时间字符串
 * @returns 格式化后的时间，如：14:00
 */
export function formatTime(timeStr?: string): string {
  if (!timeStr) return ''
  
  try {
    const parts = timeStr.split(':')
    if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
    return timeStr
  } catch (error) {
    console.error('时间格式化失败:', error)
    return timeStr
  }
}

/**
 * 格式化活动时间范围
 * @param date yyyy-MM-dd 格式的日期字符串
 * @param startTime HH:mm:ss 格式的开始时间
 * @param endTime HH:mm:ss 格式的结束时间
 * @returns 格式化后的时间范围，如：2025年3月15日 14:00 ~ 16:00
 */
export function formatActivityTime(
  date?: string,
  startTime?: string,
  endTime?: string
): string {
  const formattedDate = formatDate(date)
  const formattedStartTime = formatTime(startTime)
  const formattedEndTime = formatTime(endTime)
  
  if (!formattedDate) return ''
  
  if (formattedStartTime && formattedEndTime) {
    return `${formattedDate} ${formattedStartTime} ~ ${formattedEndTime}`
  } else if (formattedStartTime) {
    return `${formattedDate} ${formattedStartTime}`
  } else {
    return formattedDate
  }
}

/**
 * 格式化日期时间
 * @param dateStr 日期时间字符串（ISO 格式或其他可解析格式）
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
