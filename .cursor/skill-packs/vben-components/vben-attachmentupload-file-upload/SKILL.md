---
name: vben-attachmentupload-file-upload
description: Implements file upload using AttachmentUpload with drag-drop, FormData, preview, and edit-mode echo. Use when adding file upload, AttachmentUpload, a-upload, FormData, Content-Type undefined, upload hook, or file preview/echo in Vue Vben / Ant Design Vue projects.
---

# AttachmentUpload 文件上传

在 Vue Vben 项目中，使用 AttachmentUpload 做文件上传。**禁止**直接用 `<a-upload>` 或 `<input type="file">`。

## 安装（首次接入）

1. 复制组件：`AttachmentUpload/`、`hooks/useUpload.ts`、`api/core/upload.ts`（或等价实现）
2. 在 `api/core/index.ts` 导出：`export * from './upload'`
3. 在 `src/icons/index.ts` 添加：MdiFile、MdiFileDocument、MdiFilePdf、MdiImage、MdiUpload、MdiCloudUpload、MdiEye、MdiDownload、MdiDelete、MdiClose（见 [reference.md](reference.md)）

## 基本用法

```vue
<script setup lang="ts">
import type { UploadResponse } from '#/api/core/upload';
import { AttachmentUpload } from '#/components/AttachmentUpload';
const fileList = ref<UploadResponse[]>([]);
</script>

<template>
  <AttachmentUpload v-model="fileList" accept="image/*,.pdf" :max-size="10" :max-count="5" />
</template>
```

## 关键 Props

- `accept`: 如 `image/*`、`.pdf`、`image/*,.pdf`
- `max-size`: MB，默认 10
- `max-count`: 最多文件数
- `upload-mode`: `dragger` | `button`
- `list-type`: `text` | `picture-card`

## 编辑回显

从接口拿到的附件直接赋给 `fileList`：`fileList.value = data.attachments`，格式需符合 `UploadResponse`（filename、path、url、type、size）。

## FormData 注意

上传接口需使用 FormData，请求头 `Content-Type: undefined`，让浏览器自动设置，否则可能报 `'application/json' is not supported`。

## 参考

- [reference.md](reference.md) - 完整 Props/Events、UploadResponse 结构、图标清单
- [examples.md](examples.md) - 图片卡片、单文件、表单内使用
