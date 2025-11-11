# Vite 配置 - Quill 富文本编辑器

本文档说明如何在 Vite 项目中配置 Quill 富文本编辑器。

## 配置要求

使用 RichEditor 组件需要在 `vite.config.ts` 或 `vite.config.mts` 中添加以下配置。

## 完整配置示例

```typescript
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Fix quill ESM interop: 确保 imports 解析到完整构建版本
      quill$: 'quill/dist/quill.js',
    },
  },
  optimizeDeps: {
    include: ['quill'],
  },
});
```

## 配置说明

### 1. resolve.alias

```typescript
resolve: {
  alias: {
    // ... 其他 alias 配置
    quill$: 'quill/dist/quill.js',
  },
}
```

**作用：** 修复 Quill 的 ESM 互操作性问题，确保 `import Quill from 'quill'` 正确解析到完整的构建文件。

**注意：** 
- `quill$` 中的 `$` 表示精确匹配，只匹配 `'quill'`，不匹配 `'quill/xxx'`
- 这样可以确保样式导入 `import 'quill/dist/quill.snow.css'` 不受影响

### 2. optimizeDeps.include

```typescript
optimizeDeps: {
  include: ['quill'],
}
```

**作用：** 强制 Vite 预构建 Quill 依赖，避免运行时的依赖发现问题，提升开发服务器启动速度。

## public 目录配置

项目的 `public/plugins/quill/` 目录下应包含以下文件：

```
public/
└── plugins/
    └── quill/
        ├── quill.js           # Quill 核心库
        ├── quill.snow.css     # Snow 主题样式
        ├── quill.bubble.css   # Bubble 主题样式（可选）
        └── quill.core.css     # 核心样式（可选）
```

**说明：** 虽然组件通过 npm 包引入 Quill，但保留 public 目录中的文件可以作为备用方案或用于其他场景。

## 依赖安装

确保已安装 Quill 依赖：

```bash
pnpm add quill
```

**推荐版本：** quill@^1.3.7 或 quill@^2.0.0

## 类型定义

如果使用 TypeScript，确保安装类型定义：

```bash
pnpm add -D @types/quill
```

或在 `tsconfig.json` 中配置类型：

```json
{
  "compilerOptions": {
    "types": ["quill"]
  }
}
```

## 常见问题

### Q1: 报错 "Cannot find module 'quill'"

**解决方案：**
1. 确保已安装 quill 依赖：`pnpm add quill`
2. 检查 vite.config 中是否配置了 alias

### Q2: 样式未生效

**解决方案：**
1. 确保组件中导入了样式：`import 'quill/dist/quill.snow.css'`
2. 检查 CSS 是否被其他样式覆盖

### Q3: 开发环境报 ESM 相关错误

**解决方案：**
1. 确保配置了 `quill$: 'quill/dist/quill.js'` alias
2. 确保 `optimizeDeps.include` 包含 `'quill'`

## 参考资源

- [Quill 官方文档](https://quilljs.com/)
- [Vite 配置文档](https://vitejs.dev/config/)
- [Vite 依赖预构建](https://vitejs.dev/guide/dep-pre-bundling.html)

