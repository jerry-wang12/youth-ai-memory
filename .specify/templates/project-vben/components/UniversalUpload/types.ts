export enum FileStatus {
  ERROR = 'error',
  PENDING = 'pending',
  SUCCESS = 'success',
  UPLOADING = 'uploading',
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  progress: number;
  error?: string;
  file?: File;
}

export interface UploadResult {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  file?: File;
}

export interface UniversalUploadProps {
  visible?: boolean;
  title?: string;
  width?: number | string;

  accept?: string;
  maxSize?: number;
  maxCount?: number;
  multiple?: boolean;

  /** 拖拽上传模式（true 使用 a-upload-dragger） */
  drag?: boolean;
  showPreview?: boolean;
  buttonText?: string;
  disabled?: boolean;

  /** 选择文件后是否自动上传（默认 true） */
  autoUpload?: boolean;
  showFileList?: boolean;

  templateUrl?: string;
  templateName?: string;

  /** 注入上传方法，不传则仅选择文件不请求 */
  uploadApi?: (file: File) => Promise<any>;
  /** 注入模板下载方法 */
  templateApi?: () => Promise<Blob>;
}

export interface UniversalUploadEmits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'success', data: UploadResult): void;
  (e: 'error', error: Error): void;
  (e: 'progress', progress: number): void;
  (e: 'change', files: FileItem[]): void;
  (e: 'remove', file: FileItem): void;
}
