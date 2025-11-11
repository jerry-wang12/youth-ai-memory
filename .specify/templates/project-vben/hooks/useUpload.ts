/**
 * 文件上传 Hooks
 * 提供文件上传、验证、进度追踪等功能
 */

import type { UploadResponse } from '#/api/core/upload';

import { ref } from 'vue';

import { message } from 'ant-design-vue';

import { uploadFile as uploadFileApi } from '#/api/core/upload';

/**
 * 文件验证选项
 */
export interface FileValidationOptions {
  /** 允许的文件类型（如 'image/*,.pdf' 或 ['image/png', 'application/pdf']） */
  accept?: string | string[];
  /** 最大文件大小（MB） */
  maxSize?: number;
}

/**
 * 文件上传 Hook 返回值
 */
export interface UseUploadReturn {
  /** 是否正在上传 */
  uploading: ReturnType<typeof ref<boolean>>;
  /** 上传进度（0-100） */
  uploadProgress: ReturnType<typeof ref<number>>;
  /** 上传单个文件 */
  uploadFile: (file: File) => Promise<UploadResponse>;
  /** 批量上传文件 */
  uploadFiles: (files: File[]) => Promise<UploadResponse[]>;
  /** 验证文件 */
  validateFile: (file: File, options?: FileValidationOptions) => boolean;
}

/**
 * 文件上传 Hook
 */
export function useUpload(): UseUploadReturn {
  const uploading = ref(false);
  const uploadProgress = ref(0);

  /**
   * 验证文件类型
   */
  function validateFileType(file: File, accept?: string | string[]): boolean {
    if (!accept) return true;

    const acceptTypes = Array.isArray(accept) ? accept : accept.split(',');

    return acceptTypes.some((type) => {
      const trimmedType = type.trim();

      // 处理通配符类型 (如 'image/*')
      if (trimmedType.includes('*')) {
        const [mainType] = trimmedType.split('/');
        return file.type.startsWith(`${mainType}/`);
      }

      // 处理扩展名匹配 (如 '.pdf')
      if (trimmedType.startsWith('.')) {
        return file.name.toLowerCase().endsWith(trimmedType.toLowerCase());
      }

      // 精确匹配 MIME 类型
      return file.type === trimmedType;
    });
  }

  /**
   * 验证文件大小
   */
  function validateFileSize(file: File, maxSize?: number): boolean {
    if (!maxSize) return true;
    const maxSizeBytes = maxSize * 1024 * 1024; // 转换为字节
    return file.size <= maxSizeBytes;
  }

  /**
   * 验证文件
   */
  function validateFile(
    file: File,
    options: FileValidationOptions = {},
  ): boolean {
    const { accept, maxSize } = options;

    // 验证文件类型
    if (accept && !validateFileType(file, accept)) {
      message.error(`文件类型不符合要求，仅支持：${accept}`);
      return false;
    }

    // 验证文件大小
    if (maxSize && !validateFileSize(file, maxSize)) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }

    return true;
  }

  /**
   * 上传单个文件
   */
  async function uploadFile(file: File): Promise<UploadResponse> {
    uploading.value = true;
    uploadProgress.value = 0;

    try {
      // 模拟上传进度（实际项目中可以通过 axios 的 onUploadProgress 实现）
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10;
        }
      }, 100);

      const result = await uploadFileApi(file);

      clearInterval(progressInterval);
      uploadProgress.value = 100;

      message.success(`文件 ${file.name} 上传成功`);
      return result;
    } catch (error) {
      uploadProgress.value = 0;
      message.error(`文件 ${file.name} 上传失败`);
      throw error;
    } finally {
      uploading.value = false;
      // 延迟重置进度条
      setTimeout(() => {
        uploadProgress.value = 0;
      }, 1000);
    }
  }

  /**
   * 批量上传文件
   */
  async function uploadFiles(files: File[]): Promise<UploadResponse[]> {
    uploading.value = true;
    const results: UploadResponse[] = [];

    try {
      for (const file of files) {
        const result = await uploadFile(file);
        results.push(result);
      }
      return results;
    } catch (error) {
      message.error('批量上传失败');
      throw error;
    } finally {
      uploading.value = false;
    }
  }

  return {
    uploading,
    uploadProgress,
    uploadFile,
    uploadFiles,
    validateFile,
  };
}

