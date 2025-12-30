/**
 * TabBar 配置项接口
 */
export interface TabBarItem {
  /** 唯一标识 */
  key: string
  /** 显示文本 */
  text: string
  /** 页面路径 */
  pagePath: string
  /** 默认图标路径 */
  iconPath: string
  /** 选中时图标路径 */
  selectedIconPath: string
  /** 角标数字（0 或不传则不显示） */
  badge?: number
  /** 是否显示红点 */
  dot?: boolean
}

/**
 * CustomTabBar 组件 Props
 */
export interface CustomTabBarProps {
  /** 当前选中的 tab 索引 */
  current: number
  /** TabBar 配置列表（可选，默认使用预设配置） */
  tabItems?: TabBarItem[]
}

