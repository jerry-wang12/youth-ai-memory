/**
 * 文件上传相关API
 * 接口文档：docs/技术文档/API接口文档.md
 */

import { requestClient } from '../request';

/**
 * 文件上传响应类型（与后端返回格式一致）
 */
export interface UploadResponse {
  /** 原始文件名 */
  filename: string;
  /** 文件在对象存储中的完整路径（objectName） */
  path: string;
  /** 文件的访问URL */
  url: string;
  /** 文件的 MIME 类型 */
  type: string;
  /** 文件大小（字节），当前为 null */
  size: number | null;
}

/**
 * 文件信息类型（获取对象信息接口返回）
 */
export interface FileInfo {
  /** 原始文件名 */
  filename: string;
  /** 文件在对象存储中的完整路径 */
  path: string;
  /** 文件的访问URL */
  url: string;
  /** 文件的 MIME 类型 */
  type: string;
  /** 文件大小（字节） */
  size: number;
}

/**
 * 上传文件到对象存储服务（MinIO）
 *
 * 接口文档：POST /os/upload
 * - 请求头：Content-Type: multipart/form-data (浏览器自动设置)
 * - 请求头：Authorization: Bearer {token} (自动添加)
 *
 * @param file 要上传的文件
 * @returns 上传成功后的文件信息
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // 使用 requestClient 进行文件上传，避免默认的 JSON 处理
  // 不设置 Content-Type，让浏览器自动设置 multipart/form-data（包括 boundary）
  const response = await requestClient.post<UploadResponse>('/os/upload', formData, {
    headers: {
      'Content-Type': undefined, // 明确设置为 undefined，让浏览器自动处理
    },
  });

  // 确保返回的是 data 部分，而不是完整的响应对象
  return (response as any).data || response;
}

/**
 * 根据对象路径列表批量获取文件的详细信息
 * @param paths 文件在对象存储中的完整路径（objectName）数组
 * @returns 文件信息列表
 */
export async function getFileInfo(paths: string[]): Promise<FileInfo[]> {
  const response = await requestClient.post<FileInfo[]>('/os/info', paths);
  // 确保返回的是 data 部分，而不是完整的响应对象
  return (response as any).data || response;
}

