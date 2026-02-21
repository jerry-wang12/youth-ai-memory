# AttachmentPreview 参考

展示已上传的附件列表，支持图片缩略图、多种文件类型图标、图片点击全屏预览、非图片点击下载。

## 使用示例

```vue
<AttachmentPreview :attachments="attachments" :max-display="4" />
```

## 附件结构

```typescript
{ filename: string; url: string; type: string; size?: number }
```

## Props

- `attachments`: 附件数组
- `max-display`: 最大展示数量（默认全部）
