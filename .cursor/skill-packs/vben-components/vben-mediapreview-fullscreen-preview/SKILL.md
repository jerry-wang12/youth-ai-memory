---
name: vben-mediapreview-fullscreen-preview
description: Implements fullscreen media preview for images, video, and audio with zoom, keyboard shortcuts, and download. Use when building media preview, image gallery, or media viewer in Vue Vben / Ant Design Vue projects.
---

# MediaPreview 媒体全屏预览

图片/视频/音频全屏预览，支持缩放、键盘快捷键、下载。

## 使用示例

```vue
<MediaPreview
  v-model:visible="visible"
  :items="mediaItems"
  :current="0"
/>
```

## 数据结构

```typescript
{ url: string; name: string; type: 'image' | 'video' | 'audio' }
```

## 特性

- 图片缩放（滚轮、按钮）
- 方向键切换、Esc 关闭
- 下载功能

## 参考

- [reference.md](reference.md)
