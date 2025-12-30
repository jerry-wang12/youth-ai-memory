/**
 * 全局组件导出
 */

// 底部弹窗
export { default as BottomSheet } from './BottomSheet/index.vue'

// 自定义 TabBar
export { default as CustomTabBar } from './CustomTabBar/index.vue'

// 图片加载器
export { default as ImageLoader } from './ImageLoader/index.vue'

// 图片上传器
export { default as ImageUploader } from './ImageUploader/index.vue'

// 背景图
export { default as BackgroundImage } from './BackgroundImage/index.vue'

// 页面渐变背景
export { default as PageBackground } from './PageBackground/index.vue'

// Markdown 渲染组件
export { default as MarkdownView } from './MarkdownView/index.vue'

// 动态表单组件
export { default as DynamicForm } from './DynamicForm/index.vue'

// 类型导出
export type { TabBarItem, CustomTabBarProps } from './CustomTabBar/types'
export type { ImageMode, ImageLoaderProps } from './ImageLoader/types'
export type { FormField } from './DynamicForm/types'

