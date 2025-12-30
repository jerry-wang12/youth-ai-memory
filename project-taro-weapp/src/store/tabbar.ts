import { reactive, readonly } from 'vue'

/**
 * TabBar 状态接口
 */
interface TabBarState {
  home: {
    badge: number
    dot: boolean
  }
  docs: {
    badge: number
    dot: boolean
  }
  profile: {
    badge: number
    dot: boolean
  }
}

/**
 * TabBar 全局状态
 */
const state = reactive<TabBarState>({
  home: {
    badge: 0,
    dot: false
  },
  docs: {
    badge: 0,
    dot: false
  },
  profile: {
    badge: 0,
    dot: false
  }
})

/**
 * 更新指定 Tab 的角标数字
 */
export const updateBadge = (tabKey: keyof TabBarState, count: number) => {
  if (state[tabKey]) {
    state[tabKey].badge = count
  }
}

/**
 * 显示指定 Tab 的红点
 */
export const showDot = (tabKey: keyof TabBarState) => {
  if (state[tabKey]) {
    state[tabKey].dot = true
  }
}

/**
 * 隐藏指定 Tab 的红点
 */
export const hideDot = (tabKey: keyof TabBarState) => {
  if (state[tabKey]) {
    state[tabKey].dot = false
  }
}

/**
 * 清空指定 Tab 的角标和红点
 */
export const clearBadge = (tabKey: keyof TabBarState) => {
  if (state[tabKey]) {
    state[tabKey].badge = 0
    state[tabKey].dot = false
  }
}

/**
 * 导出只读状态
 */
export const tabbarState = readonly(state)

/**
 * 导出可修改的状态（用于组件内部）
 */
export const useTabbarState = () => state

