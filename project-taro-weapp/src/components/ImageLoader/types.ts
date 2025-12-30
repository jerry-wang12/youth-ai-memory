/**
 * ImageLoader 组件类型定义
 */

/**
 * 图片裁剪模式
 */
export type ImageMode =
  | 'aspectFill'   // 保持纵横比缩放，短边完全显示
  | 'aspectFit'    // 保持纵横比缩放，长边完全显示
  | 'widthFix'     // 宽度不变，高度自动变化
  | 'heightFix'    // 高度不变，宽度自动变化
  | 'scaleToFill'  // 不保持纵横比缩放，拉伸填充

/**
 * ImageLoader 组件 Props
 */
export interface ImageLoaderProps {
  /** 图片地址 */
  src: string
  /** 图片裁剪模式，默认 aspectFill */
  mode?: ImageMode
  /** 是否懒加载，默认 true */
  lazyLoad?: boolean
  /** 自定义类名 */
  customClass?: string
}

