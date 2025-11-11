# 图标配置指南

## 概述

本模板推荐使用 `unplugin-icons` 插件来管理图标。该插件支持按需导入、自动优化，并且可以使用 Iconify 提供的数万个图标。

## 推荐方案：unplugin-icons

### 1. 安装依赖

```bash
# 使用 pnpm
pnpm add -D unplugin-icons @iconify/json

# 使用 npm
npm install -D unplugin-icons @iconify/json

# 使用 yarn
yarn add -D unplugin-icons @iconify/json
```

### 2. 配置 Vite

在 `vite.config.ts` 中添加配置：

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    vue(),
    Icons({
      // 自动安装图标
      autoInstall: true,
      // 编译器
      compiler: 'vue3',
    }),
  ],
  resolve: {
    alias: {
      '~icons': 'unplugin-icons',
    },
  },
});
```

### 3. 使用图标

#### 方式一：直接导入（推荐）

```vue
<script setup lang="ts">
// 从 Material Design Icons 导入
import MdiMagnify from '~icons/mdi/magnify';
import MdiRefresh from '~icons/mdi/refresh';
import MdiFilter from '~icons/mdi/filter';
import MdiChevronDown from '~icons/mdi/chevron-down';
import MdiChevronUp from '~icons/mdi/chevron-up';
import MdiClose from '~icons/mdi/close';
import MdiPlus from '~icons/mdi/plus';
</script>

<template>
  <div>
    <MdiMagnify class="icon" />
    <MdiRefresh class="icon" />
  </div>
</template>

<style scoped>
.icon {
  width: 20px;
  height: 20px;
}
</style>
```

#### 方式二：集中导出

创建 `src/icons/index.ts` 文件：

```typescript
// src/icons/index.ts
export { default as MdiMagnify } from '~icons/mdi/magnify';
export { default as MdiRefresh } from '~icons/mdi/refresh';
export { default as MdiFilter } from '~icons/mdi/filter';
export { default as MdiChevronDown } from '~icons/mdi/chevron-down';
export { default as MdiChevronUp } from '~icons/mdi/chevron-up';
export { default as MdiKeyboardReturn } from '~icons/mdi/keyboard-return';
export { default as MdiClose } from '~icons/mdi/close';
export { default as MdiPlus } from '~icons/mdi/plus';
export { default as MdiBell } from '~icons/mdi/bell';
export { default as MdiCheckCircle } from '~icons/mdi/check-circle';
export { default as MdiFlag } from '~icons/mdi/flag';
export { default as MdiHome } from '~icons/mdi/home';
export { default as MdiInformation } from '~icons/mdi/information';
export { default as MdiRobot } from '~icons/mdi/robot';
export { default as MdiStudent } from '~icons/mdi/school';
export { default as MdiUser } from '~icons/mdi/account';
```

然后在组件中使用：

```vue
<script setup lang="ts">
import { MdiMagnify, MdiRefresh } from '@/icons';
</script>

<template>
  <MdiMagnify class="icon" />
  <MdiRefresh class="icon" />
</template>
```

### 4. TypeScript 支持

创建 `env.d.ts` 文件：

```typescript
/// <reference types="vite/client" />

declare module '~icons/*' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
```

## 替代方案

### 方案一：@ant-design/icons-vue

```bash
pnpm add @ant-design/icons-vue
```

```vue
<script setup lang="ts">
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from '@ant-design/icons-vue';
</script>

<template>
  <SearchOutlined />
  <ReloadOutlined />
  <FilterOutlined />
</template>
```

**注意**：Ant Design Icons 体积较大，不推荐全量导入。

### 方案二：@iconify/vue

```bash
pnpm add @iconify/vue
```

```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue';
</script>

<template>
  <Icon icon="mdi:magnify" />
  <Icon icon="mdi:refresh" />
  <Icon icon="mdi:filter" />
</template>
```

## 图标库推荐

### Material Design Icons (MDI)

- 前缀：`mdi`
- 图标数量：7000+
- 官网：https://pictogrammers.com/library/mdi/
- 特点：设计精美，覆盖面广

### Heroicons

- 前缀：`heroicons`
- 图标数量：200+
- 官网：https://heroicons.com/
- 特点：简洁现代，Tailwind CSS 官方推荐

### Lucide Icons

- 前缀：`lucide`
- 图标数量：1000+
- 官网：https://lucide.dev/
- 特点：基于 Feather Icons，设计一致

### Font Awesome

- 前缀：`fa` / `fa6-solid` / `fa6-regular`
- 图标数量：10000+
- 官网：https://fontawesome.com/
- 特点：最流行的图标库

## 图标查找

推荐使用 Icônes 网站查找图标：

🔗 https://icones.js.org/

该网站支持搜索所有 Iconify 图标集，并提供导入代码。

## 本模板使用的图标

以下是模板中使用的所有图标及其用途：

| 图标名称            | 用途   | 推荐图标库          |
| ------------------- | ------ | ------------------- |
| `MdiMagnify`        | 搜索   | mdi:magnify         |
| `MdiRefresh`        | 刷新   | mdi:refresh         |
| `MdiFilter`         | 筛选   | mdi:filter          |
| `MdiChevronDown`    | 下拉   | mdi:chevron-down    |
| `MdiChevronUp`      | 上拉   | mdi:chevron-up      |
| `MdiKeyboardReturn` | 回车   | mdi:keyboard-return |
| `MdiClose`          | 关闭   | mdi:close           |
| `MdiPlus`           | 新增   | mdi:plus            |
| `MdiBell`           | 通知   | mdi:bell            |
| `MdiCheckCircle`    | 确认   | mdi:check-circle    |
| `MdiFlag`           | 标记   | mdi:flag            |
| `MdiHome`           | 首页   | mdi:home            |
| `MdiInformation`    | 信息   | mdi:information     |
| `MdiRobot`          | 机器人 | mdi:robot           |
| `MdiStudent`        | 学生   | mdi:school          |
| `MdiUser`           | 用户   | mdi:account         |

## 性能优化建议

1. **按需导入**：只导入需要的图标，避免全量导入
2. **使用 SVG**：优先使用 SVG 图标而不是字体图标
3. **图标大小**：使用 CSS 控制图标大小，而不是多次导入不同尺寸的图标
4. **缓存优化**：利用构建工具的缓存机制

## 样式控制

### 基本样式

```vue
<template>
  <MdiMagnify class="icon-base" />
</template>

<style scoped>
.icon-base {
  width: 20px;
  height: 20px;
  color: currentColor;
}
</style>
```

### 使用 Tailwind CSS

```vue
<template>
  <MdiMagnify class="h-5 w-5 text-gray-600" />
  <MdiRefresh class="h-4 w-4 text-blue-500" />
</template>
```

### 悬停效果

```vue
<template>
  <button class="icon-button">
    <MdiMagnify class="icon" />
  </button>
</template>

<style scoped>
.icon-button {
  transition: all 0.2s;
}

.icon-button:hover .icon {
  color: #1890ff;
  transform: scale(1.1);
}
</style>
```

## 常见问题

### Q: 图标不显示？

A: 检查以下几点：

1. 是否正确安装了 `unplugin-icons` 和 `@iconify/json`
2. Vite 配置是否正确
3. 图标路径是否正确（注意大小写）
4. 是否设置了图标的宽高

### Q: 如何更改图标颜色？

A: 图标默认继承文本颜色，可以通过 `color` CSS 属性或 Tailwind 的 `text-*` 类来控制。

### Q: 图标太大或太小？

A: 使用 CSS 的 `width` 和 `height` 属性，或 Tailwind 的 `w-*` 和 `h-*` 类来控制尺寸。

### Q: 如何在 TypeScript 中使用图标？

A: 确保创建了 `env.d.ts` 文件并添加了类型声明。

## 参考资源

- [unplugin-icons 文档](https://github.com/unplugin/unplugin-icons)
- [Iconify 文档](https://docs.iconify.design/)
- [Icônes 图标搜索](https://icones.js.org/)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)
