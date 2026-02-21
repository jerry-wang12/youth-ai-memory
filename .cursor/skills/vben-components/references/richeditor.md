# RichEditor 参考

基于 Quill 的富文本编辑器，双向绑定 HTML 输出。

## 依赖与 Vite 配置

```bash
pnpm add quill
pnpm add -D @types/quill
```

```typescript
// vite.config.ts
resolve: {
  alias: { quill$: 'quill/dist/quill.js' }
},
optimizeDeps: { include: ['quill'] }
```

## public/plugins/quill

需包含 quill.js, quill.snow.css, quill.bubble.css, quill.core.css

## 使用示例

```vue
<RichEditor v-model="content" placeholder="请输入内容..." />
```

## 空内容检查

空时 Quill 可能返回 `<p><br></p>`，提交前需判断。
