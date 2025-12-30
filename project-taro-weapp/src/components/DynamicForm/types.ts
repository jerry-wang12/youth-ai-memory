/**
 * 动态表单字段配置
 */
export interface FormField {
  /** 字段唯一标识 */
  key: string
  /** 字段显示标签 */
  label: string
  /** 字段类型 */
  type: 'TEXT' | 'SELECT' | 'BOOLEAN'
  /** 是否必填 */
  required: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 选项列表（仅 SELECT 类型使用） */
  options?: string[]
}

