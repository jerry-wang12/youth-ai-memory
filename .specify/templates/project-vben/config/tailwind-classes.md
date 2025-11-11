# Tailwind CSS 类使用说明

## 概述

本模板大量使用 Tailwind CSS 实用类来构建UI。本文档列出了模板中使用的所有 Tailwind 类及其用途。

## 安装和配置

### 1. 安装依赖

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm exec tailwindcss init -p
```

### 2. 配置 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 自定义颜色，使用 CSS 变量
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

### 3. CSS 入口文件

在 `src/styles/main.css` 中添加：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS 变量定义 */
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

## 模板中使用的类分类

### 布局类

#### Flexbox

```html
<!-- 水平居中 -->
<div class="flex items-center justify-center">
  <!-- 垂直布局 -->
  <div class="flex flex-col">
    <!-- 水平间距 -->
    <div class="flex gap-2">
      <div class="flex gap-4">
        <div class="flex gap-6">
          <!-- 自适应 -->
          <div class="flex flex-1">
            <div class="flex-shrink-0">
              <div class="flex-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Grid

```html
<!-- 响应式网格 -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
  <!-- 大卡片网格 -->
  <div
    class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
  ></div>
</div>
```

#### Spacing (间距)

```html
<!-- Margin -->
<div class="m-2">
  <!-- margin: 0.5rem (8px) -->
  <div class="mt-4">
    <!-- margin-top: 1rem (16px) -->
    <div class="mb-6">
      <!-- margin-bottom: 1.5rem (24px) -->
      <div class="mx-auto">
        <!-- margin-left: auto; margin-right: auto -->

        <!-- Padding -->
        <div class="p-4">
          <!-- padding: 1rem (16px) -->
          <div class="px-6">
            <!-- padding-left/right: 1.5rem (24px) -->
            <div class="py-4"><!-- padding-top/bottom: 1rem (16px) --></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 尺寸类

```html
<!-- Width -->
<div class="w-full">
  <!-- width: 100% -->
  <div class="w-20">
    <!-- width: 5rem (80px) -->
    <div class="w-6">
      <!-- width: 1.5rem (24px) -->
      <div class="max-w-md">
        <!-- max-width: 28rem (448px) -->

        <!-- Height -->
        <div class="h-8">
          <!-- height: 2rem (32px) -->
          <div class="h-6">
            <!-- height: 1.5rem (24px) -->
            <div class="min-h-table"><!-- 自定义最小高度 --></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 文本类

```html
<!-- Size -->
<span class="text-sm">
  <!-- font-size: 0.875rem (14px) -->
  <span class="text-base">
    <!-- font-size: 1rem (16px) -->
    <span class="text-2xl">
      <!-- font-size: 1.5rem (24px) -->
      <span class="text-xs">
        <!-- font-size: 0.75rem (12px) -->

        <!-- Weight -->
        <span class="font-medium">
          <!-- font-weight: 500 -->
          <span class="font-semibold"
            ><!-- font-weight: 600 -->
            <span class="font-bold">
              <!-- font-weight: 700 -->

              <!-- Color -->
              <span class="text-gray-900">
                <!-- 深灰色 -->
                <span class="text-gray-600">
                  <!-- 中灰色 -->
                  <span class="text-gray-400">
                    <!-- 浅灰色 -->
                    <span class="text-red-600">
                      <!-- 红色 -->
                      <span class="text-[hsl(var(--primary))]">
                        <!-- 主题色 -->

                        <!-- Alignment -->
                        <div class="text-center">
                          <!-- text-align: center -->
                          <div class="text-left">
                            <!-- text-align: left -->
                            <div class="text-right">
                              <!-- text-align: right -->

                              <!-- Other -->
                              <div class="whitespace-nowrap">
                                <!-- white-space: nowrap -->
                                <div class="text-uppercase">
                                  <!-- text-transform: uppercase -->
                                  <div class="letter-spacing">
                                    <!-- letter-spacing: 0.05em -->
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div></span
                      ></span
                    ></span
                  ></span
                ></span
              ></span
            ></span
          ></span
        ></span
      ></span
    ></span
  ></span
>
```

### 背景和边框类

```html
<!-- Background -->
<div class="bg-white">
  <!-- 白色背景 -->
  <div class="bg-gray-50">
    <!-- 浅灰色背景 -->
    <div class="bg-gray-100">
      <!-- 灰色背景 -->
      <div class="bg-[hsl(var(--primary))]">
        <!-- 主题色背景 -->

        <!-- Border -->
        <div class="border">
          <!-- border: 1px solid -->
          <div class="border-t">
            <!-- border-top: 1px solid -->
            <div class="border-gray-200">
              <!-- 边框颜色 -->
              <div class="border-gray-300">
                <div class="rounded-lg">
                  <!-- border-radius: 0.5rem (8px) -->
                  <div class="rounded-xl">
                    <!-- border-radius: 0.75rem (12px) -->
                    <div class="rounded-full">
                      <!-- border-radius: 9999px -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 阴影和效果类

```html
<!-- Shadow -->
<div class="shadow-sm">
  <!-- 小阴影 -->
  <div class="shadow-md">
    <!-- 中等阴影 -->
    <div class="shadow-lg">
      <!-- 大阴影 -->

      <!-- Opacity -->
      <div class="opacity-0">
        <!-- opacity: 0 -->
        <div class="opacity-50">
          <!-- opacity: 0.5 -->
          <div class="opacity-100">
            <!-- opacity: 1 -->

            <!-- Overflow -->
            <div class="overflow-hidden">
              <!-- overflow: hidden -->
              <div class="overflow-auto">
                <!-- overflow: auto -->
                <div class="overflow-x-auto"><!-- overflow-x: auto --></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 交互类

```html
<!-- Cursor -->
<div class="cursor-pointer">
  <!-- cursor: pointer -->
  <div class="cursor-not-allowed">
    <!-- cursor: not-allowed -->

    <!-- User Select -->
    <div class="select-none">
      <!-- user-select: none -->

      <!-- Hover States -->
      <div class="hover:bg-gray-50">
        <div class="hover:bg-gray-100">
          <div class="hover:text-gray-600">
            <div class="hover:border-gray-400">
              <div class="hover:shadow-lg">
                <div class="hover:-translate-y-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 过渡和动画类

```html
<!-- Transition -->
<div class="transition-all">
  <!-- transition: all -->
  <div class="transition-colors">
    <!-- transition: color, background-color, border-color -->
    <div class="duration-200">
      <!-- transition-duration: 200ms -->

      <!-- Transform -->
      <div class="transform">
        <div class="scale-105">
          <div class="translate-y-0">
            <div class="-translate-y-0.5"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 响应式类

```html
<!-- Breakpoints -->
<div class="hidden sm:block">
  <!-- 小屏幕及以上显示 -->
  <div class="grid-cols-1 md:grid-cols-4">
    <!-- 中屏幕及以上4列 -->
    <div class="text-sm lg:text-base">
      <!-- 大屏幕及以上使用基础字号 -->

      <!-- 断点定义 -->
      sm: 640px
      <!-- @media (min-width: 640px) -->
      md: 768px
      <!-- @media (min-width: 768px) -->
      lg: 1024px
      <!-- @media (min-width: 1024px) -->
      xl: 1280px
      <!-- @media (min-width: 1280px) -->
      2xl: 1536px
      <!-- @media (min-width: 1536px) -->
    </div>
  </div>
</div>
```

## 自定义类

模板中定义了一些自定义实用类：

```css
/* 表格最小高度 */
.min-h-table {
  min-height: 160px;
}

/* 输入框连接样式（与操作符选择器连接） */
.input-connected .ant-input,
.input-connected .ant-input-number,
.input-connected .ant-select-selector {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
```

## 常用组合模式

### 1. 卡片容器

```html
<div class="overflow-hidden rounded-xl bg-white shadow-sm">
  <!-- 内容 -->
</div>
```

### 2. 按钮样式

```html
<!-- 主要按钮 -->
<button
  class="flex h-8 items-center rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[hsl(var(--primary)/0.9)] hover:shadow-md"
>
  确定
</button>

<!-- 次要按钮 -->
<button
  class="flex h-8 items-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100"
>
  取消
</button>
```

### 3. 输入框

```html
<input
  class="h-8 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)]"
/>
```

### 4. 标签

```html
<span
  class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
>
  标签
</span>
```

## 与 Ant Design Vue 集成

### 覆盖 Ant Design 样式

使用 `:deep()` 选择器：

```vue
<style scoped>
:deep(.ant-table-thead > tr > th) {
  @apply bg-gray-50 text-xs font-semibold uppercase text-gray-700;
}

:deep(.ant-table-tbody > tr:hover > td) {
  @apply bg-gray-50;
}
</style>
```

### 使用 Tailwind 工具类

```vue
<template>
  <a-button class="!bg-blue-500 !text-white hover:!bg-blue-600">
    按钮
  </a-button>
</template>
```

**注意**：使用 `!` 前缀提升优先级，覆盖 Ant Design 的默认样式。

## 性能优化

### 1. 生产环境清除未使用的样式

Tailwind 会自动清除未使用的样式，确保 `content` 配置正确：

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // ...
};
```

### 2. 使用 @apply 提取常用样式

```css
@layer components {
  .btn-primary {
    @apply flex h-8 items-center rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[hsl(var(--primary)/0.9)] hover:shadow-md;
  }
}
```

## 调试技巧

### 1. 使用 Tailwind CSS IntelliSense

安装 VS Code 插件：`Tailwind CSS IntelliSense`

### 2. 使用浏览器开发工具

查看元素的计算样式，确认 Tailwind 类是否生效。

### 3. 检查样式冲突

如果样式不生效，检查是否与其他 CSS 冲突，使用 `!important` 或 `!` 前缀提升优先级。

## 参考资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Tailwind CSS 速查表](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind UI](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)
