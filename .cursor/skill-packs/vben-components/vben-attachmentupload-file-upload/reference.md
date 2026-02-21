# AttachmentUpload 参考

## UploadResponse

```typescript
interface UploadResponse {
  filename: string;
  path: string;
  url: string;
  type: string;
  size: number | null;
}
```

## Props

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| modelValue | UploadResponse[] | [] | v-model |
| accept | string | - | image/*, .pdf 等 |
| maxSize | number | 10 | MB |
| maxCount | number | - | 最大文件数 |
| uploadMode | dragger/button | dragger | 上传模式 |
| listType | text/picture-card | text | 列表展示 |
| multiple | boolean | true | 多文件 |

## 所需图标（加入 src/icons/index.ts）

```typescript
export const MdiFile = createIconifyIcon('mdi:file-outline');
export const MdiFileDocument = createIconifyIcon('mdi:file-document-outline');
export const MdiFilePdf = createIconifyIcon('mdi:file-pdf-box');
export const MdiImage = createIconifyIcon('mdi:image-outline');
export const MdiUpload = createIconifyIcon('mdi:upload');
export const MdiCloudUpload = createIconifyIcon('mdi:cloud-upload-outline');
export const MdiEye = createIconifyIcon('mdi:eye-outline');
export const MdiDownload = createIconifyIcon('mdi:download-outline');
export const MdiDelete = createIconifyIcon('mdi:delete-outline');
export const MdiClose = createIconifyIcon('mdi:close');
```

## 上传 API 注意

请求需使用 FormData，且 `headers: { 'Content-Type': undefined }`，由浏览器自动设置 boundary。
