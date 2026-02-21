# UniversalUpload 通用上传

弹窗式文件上传，完全通过 props 注入 `uploadApi` / `templateApi`，无业务 API 依赖。

## Props

- `visible` / `update:visible`：弹窗显隐
- `uploadApi?: (file: File) => Promise<any>`：上传方法，由调用方注入
- `templateApi?: () => Promise<Blob>`：模板下载方法（可选）
- `accept`、`maxSize`、`maxCount`、`multiple`、`title`、`width`、`buttonText`、`templateName` 等

## Events

- `success`、`error`、`change`

## 使用示例

```vue
<UniversalUpload
  v-model:visible="uploadVisible"
  title="上传文件"
  :upload-api="uploadFile"
  :template-api="downloadTemplate"
  :max-size="10 * 1024 * 1024"
  @success="onUploadSuccess"
/>
```

类型见 `./types.ts`。完整 UI 实现可由项目按需基于 Ant Design Vue Upload + Modal 封装。
