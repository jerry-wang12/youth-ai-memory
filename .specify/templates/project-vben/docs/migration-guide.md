# 迁移指南

本指南将帮助您将模板代码集成到现有项目或新项目中。

## 准备工作

### 1. 检查项目环境

确保您的项目满足以下要求：

- **Node.js**: >= 20.10
- **包管理器**: pnpm (推荐) / npm / yarn
- **构建工具**: Vite 5.0+
- **框架**: Vue 3.4+
- **UI 库**: Ant Design Vue 4.0+
- **语言**: TypeScript 5.3+

### 2. 备份现有代码

在开始迁移前，建议备份您的项目：

```bash
git add .
git commit -m "backup before migration"
# 或创建备份分支
git checkout -b backup-$(date +%Y%m%d)
```

## 迁移步骤

### 步骤 1：安装依赖

#### 1.1 安装必需依赖

```bash
# 使用 pnpm（推荐）
pnpm add vue@^3.4.0 ant-design-vue@^4.0.0
pnpm add -D typescript@^5.3.0

# 使用 npm
npm install vue@^3.4.0 ant-design-vue@^4.0.0
npm install -D typescript@^5.3.0

# 使用 yarn
yarn add vue@^3.4.0 ant-design-vue@^4.0.0
yarn add -D typescript@^5.3.0
```

#### 1.2 安装推荐依赖

```bash
# Tailwind CSS
pnpm add -D tailwindcss@^3.4.0 postcss autoprefixer

# 图标库
pnpm add -D unplugin-icons@^0.18.0 @iconify/json@^2.2.0

# 日期处理
pnpm add dayjs@^1.11.0
```

### 步骤 2：配置 TypeScript

#### 2.1 更新 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

#### 2.2 创建 env.d.ts

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '~icons/*' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 添加其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 步骤 3：配置 Vite

#### 3.1 更新 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    vue(),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '#': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

### 步骤 4：配置 Tailwind CSS

#### 4.1 初始化 Tailwind

```bash
pnpm exec tailwindcss init -p
```

#### 4.2 配置 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        foreground: 'hsl(var(--foreground))',
        background: 'hsl(var(--background))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        card: 'hsl(var(--card))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
      },
    },
  },
  plugins: [],
};
```

#### 4.3 创建 CSS 入口文件

在 `src/styles/main.css` 中：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: 217 91% 60%;
    --foreground: 222 47% 11%;
    --background: 0 0% 100%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --border: 214 32% 91%;
    --card: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
  }

  .dark {
    --primary: 217 91% 60%;
    --foreground: 213 31% 91%;
    --background: 222 47% 11%;
    --muted: 223 47% 11%;
    --muted-foreground: 215 20% 65%;
    --border: 216 34% 17%;
    --card: 224 71% 4%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 0 86% 97%;
  }
}
```

#### 4.4 在 main.ts 中导入

```typescript
import './styles/main.css';
```

### 步骤 5：复制组件

#### 5.1 复制组件文件

```bash
# 复制整个组件目录
cp -r template/components/* src/components/

# 或选择性复制
cp -r template/components/TableLayout src/components/
cp -r template/components/DetailModal src/components/
cp -r template/components/CustomTag src/components/
```

#### 5.2 修改导入路径

将组件中的相对导入路径修改为绝对路径：

```typescript
// 修改前
import TableHeader from '../TableHeader/index.vue';

// 修改后
import TableHeader from '@/components/TableLayout/TableHeader/index.vue';
```

### 步骤 6：配置图标

#### 6.1 创建图标导出文件

在 `src/icons/index.ts` 中：

```typescript
export { default as MdiMagnify } from '~icons/mdi/magnify';
export { default as MdiRefresh } from '~icons/mdi/refresh';
export { default as MdiFilter } from '~icons/mdi/filter';
export { default as MdiChevronDown } from '~icons/mdi/chevron-down';
export { default as MdiChevronUp } from '~icons/mdi/chevron-up';
export { default as MdiKeyboardReturn } from '~icons/mdi/keyboard-return';
export { default as MdiClose } from '~icons/mdi/close';
export { default as MdiPlus } from '~icons/mdi/plus';
// ... 其他图标
```

#### 6.2 替换组件中的图标导入

```typescript
// 修改前
import { MdiMagnify } from '../../../icons/placeholder';

// 修改后
import { MdiMagnify } from '@/icons';
```

### 步骤 7：配置 API 层

#### 7.1 创建请求客户端

在 `src/utils/request.ts` 中：

```typescript
import axios from 'axios';
import { message } from 'ant-design-vue';

export const requestClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
requestClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
requestClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          message.error('未授权，请重新登录');
          // 跳转到登录页
          break;
        case 403:
          message.error('权限不足');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(error.response.data?.message || '请求失败');
      }
    } else {
      message.error('网络连接失败');
    }
    return Promise.reject(error);
  },
);
```

#### 7.2 复制 API 文件

```bash
cp -r template/api/* src/api/
```

#### 7.3 修改 API 文件

在每个 API 文件中，替换请求客户端声明：

```typescript
// 删除这一行
declare const requestClient: {...};

// 添加这一行
import { requestClient } from '@/utils/request';
```

### 步骤 8：创建页面

#### 8.1 复制页面模板

```bash
# 复制整个页面
cp template/pages/tag-management/index.vue src/views/your-module/index.vue
```

#### 8.2 修改页面导入

更新页面中的所有导入路径：

```typescript
// 修改前
import { TableLayout } from '../../components/TableLayout';
import { createTag } from '../../api/tags';

// 修改后
import { TableLayout } from '@/components/TableLayout';
import { createTag } from '@/api/tags';
```

### 步骤 9：配置路由

在路由配置中添加页面：

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/tag-management',
    name: 'TagManagement',
    component: () => import('@/views/tag-management/index.vue'),
    meta: {
      title: '标签管理',
    },
  },
  // ... 其他路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

### 步骤 10：测试和调试

#### 10.1 启动开发服务器

```bash
pnpm dev
```

#### 10.2 检查清单

- [ ] 页面能正常打开
- [ ] 组件样式正确显示
- [ ] 图标正常显示
- [ ] API 请求正常
- [ ] 搜索功能正常
- [ ] 筛选功能正常
- [ ] 分页功能正常
- [ ] 新增/编辑/删除功能正常

## 常见问题

### Q: 图标不显示？

**A:** 检查以下几点：

1. 是否安装了 `unplugin-icons` 和 `@iconify/json`
2. Vite 配置是否正确
3. 图标路径是否正确

### Q: Tailwind 样式不生效？

**A:** 检查：

1. `tailwind.config.js` 的 `content` 配置是否包含所有文件
2. 是否在 `main.ts` 中导入了 CSS 文件
3. CSS 变量是否定义

### Q: API 请求失败？

**A:** 检查：

1. 请求客户端是否正确配置
2. 环境变量是否设置
3. 后端 API 是否运行
4. 请求路径是否正确

### Q: 类型错误？

**A:** 确保：

1. TypeScript 配置正确
2. 所有类型定义文件都已创建
3. 导入路径正确

### Q: 构建失败？

**A:** 检查：

1. 所有依赖是否正确安装
2. 配置文件是否正确
3. 是否有语法错误

## 回滚方案

如果迁移遇到问题，可以回滚到之前的版本：

```bash
# 如果使用了 Git 备份
git reset --hard HEAD~1

# 如果创建了备份分支
git checkout backup-20240101
```

## 后续优化

迁移完成后，建议进行以下优化：

1. **代码审查**：检查代码质量和规范
2. **性能优化**：使用 Vite 的构建分析工具
3. **错误监控**：集成 Sentry 或其他监控工具
4. **测试**：添加单元测试和 E2E 测试
5. **文档**：完善项目文档

## 技术支持

如果遇到问题，可以：

1. 查阅模板文档
2. 搜索相关技术文档
3. 在 GitHub 上提 Issue
4. 联系团队成员

## 相关文档

- [主 README](../README.md)
- [组件使用指南](../components/README.md)
- [API 使用说明](../api/README.md)
- [开发规范](./development-guide.md)
- [图标配置](../config/icons-config.md)
- [Tailwind 配置](../config/tailwind-classes.md)
