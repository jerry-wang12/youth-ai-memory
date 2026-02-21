/**
 * 文件上传 Hooks
 */

import type { UploadResponse } from '#/api/core/upload';

import { ref } from 'vue';

import { message } from 'ant-design-vue';

import { uploadFile as uploadFileApi } from '#/api/core/upload';

export interface FileValidationOptions {
  accept?: string | string[];
  maxSize?: number;
}

export interface UseUploadReturn {
  uploading: ReturnType<typeof ref<boolean>>;
  uploadProgress: ReturnType<typeof ref<number>>;
  uploadFile: (file: File) => Promise<UploadResponse>;
  uploadFiles: (files: File[]) => Promise<UploadResponse[]>;
  validateFile: (file: File, options?: FileValidationOptions) => boolean;
}

export function useUpload(): UseUploadReturn {
  const uploading = ref(false);
  const uploadProgress = ref(0);

  function validateFileType(file: File, accept?: string | string[]): boolean {
    if (!accept) return true;
    const acceptTypes = Array.isArray(accept) ? accept : accept.split(',');
    return acceptTypes.some((type) => {
      const t = type.trim();
      if (t.includes('*')) {
        const [main] = t.split('/');
        return file.type.startsWith(`${main}/`);
      }
      if (t.startsWith('.'))
        return file.name.toLowerCase().endsWith(t.toLowerCase());
      return file.type === t;
    });
  }

  function validateFileSize(file: File, maxSize?: number): boolean {
    if (!maxSize) return true;
    return file.size <= maxSize * 1024 * 1024;
  }

  function validateFile(file: File, options: FileValidationOptions = {}): boolean {
    const { accept, maxSize } = options;
    if (accept && !validateFileType(file, accept)) {
      message.error(`文件类型不符合要求，仅支持：${accept}`);
      return false;
    }
    if (maxSize && !validateFileSize(file, maxSize)) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }
    return true;
  }

  async function uploadFile(file: File): Promise<UploadResponse> {
    uploading.value = true;
    uploadProgress.value = 0;
    try {
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) uploadProgress.value += 10;
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
      setTimeout(() => { uploadProgress.value = 0; }, 1000);
    }
  }

  async function uploadFiles(files: File[]): Promise<UploadResponse[]> {
    uploading.value = true;
    const results: UploadResponse[] = [];
    try {
      for (const file of files) {
        results.push(await uploadFile(file));
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
