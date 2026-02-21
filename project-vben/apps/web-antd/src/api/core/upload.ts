/**
 * 文件上传 API（模板用，实际项目可替换为真实后端路径）
 */

import { requestClient } from '#/api/request';

export interface UploadResponse {
  filename: string;
  path: string;
  url: string;
  type: string;
  size: number | null;
}

export interface FileInfo {
  filename: string;
  path: string;
  url: string;
  type: string;
  size: number;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await requestClient.post<UploadResponse>('/os/upload', formData, {
    headers: { 'Content-Type': undefined },
  });
  return (response as any).data ?? response;
}

export async function getFileInfo(paths: string[]): Promise<FileInfo[]> {
  const response = await requestClient.post<FileInfo[]>('/os/info', paths);
  return (response as any).data ?? response;
}
