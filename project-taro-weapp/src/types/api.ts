/**
 * API 相关类型定义
 */

/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = any> {
  /** 状态码 */
  code: number
  /** 提示信息 */
  message: string
  /** 响应数据 */
  data: T
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 当前页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 分页响应数据
 */
export interface PaginationData<T> {
  /** 数据列表 */
  list: T[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/**
 * 上传响应
 */
export interface UploadResponse {
  /** 文件 URL */
  url: string
  /** 文件名 */
  filename?: string
  /** 文件大小 */
  size?: number
}

