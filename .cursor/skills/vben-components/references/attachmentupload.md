# AttachmentUpload / UniversalUpload 参考

## AttachmentUpload

### UploadResponse

```typescript
interface UploadResponse {
  filename: string;
  path: string;
  url: string;
  type: string;
  size: number | null;
}
```

### Props

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| modelValue | UploadResponse[] | [] | v-model |
| accept | string | - | image/*, .pdf 等 |
| maxSize | number | 10 | MB |
| maxCount | number | - | 最大文件数 |
| uploadMode | dragger/button | dragger | 上传模式 |
| listType | text/picture-card | text | 列表展示 |
| multiple | boolean | true | 多文件 |

## UniversalUpload（弹窗式）

Props: visible, uploadApi(file=>Promise), templateApi?()=>Promise<Blob>, accept, maxSize, maxCount, title, width

Events: success, error, change

无业务 API 依赖，通过 props 注入上传/模板下载方法。

## 所需图标（AttachmentUpload 需加入 src/icons）

MdiFile, MdiFileDocument, MdiFilePdf, MdiImage, MdiUpload, MdiCloudUpload, MdiEye, MdiDownload, MdiDelete, MdiClose

## 上传 API 注意

请求需使用 FormData，且 `headers: { 'Content-Type': undefined }`，由浏览器自动设置 boundary。
