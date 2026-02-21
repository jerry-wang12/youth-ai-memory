---
name: vben-attachmentpreview-attachments-list
description: Displays uploaded attachment list with thumbnails, file type icons, fullscreen image preview, and download. Use when showing attachments, file lists, or attachment preview in Vue Vben / Ant Design Vue projects.
---

# AttachmentPreview 附件展示

展示已上传的附件列表，支持图片缩略图、多种文件类型图标、图片点击全屏、非图片点击下载。

## 使用示例

```vue
<AttachmentPreview :attachments="attachments" :max-display="4" />
```

## 数据结构

```typescript
{ filename: string; url: string; type: string; size?: number }
```

## Props

- `attachments`: 附件数组
- `max-display`: 最大展示数量

## 参考

- [reference.md](reference.md)
