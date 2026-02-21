---
name: vben-icons-management
description: Manages icons using createIconifyIcon and centralized #/icons export. Use when adding icons, createIconifyIcon, MdiMagnify, ActionButton icon, or when the user mentions emoji icons (must use component icons instead) in Vue Vben projects.
---

# 图标管理

在 Vue Vben 项目中，**必须**从 `#/icons` 导入图标，**禁止**使用 emoji 作为图标。

## 使用方式

```vue
<script setup lang="ts">
import { MdiMagnify, MdiPlus, MdiDelete } from '#/icons';
</script>

<template>
  <Button><MdiPlus /> 新增</Button>
  <Button><MdiMagnify /> 搜索</Button>
</template>
```

## 添加新图标

1. 在 https://icon-sets.iconify.design/ 查找图标
2. 在 `src/icons/index.ts` 中添加：

```typescript
import { createIconifyIcon } from '@vben/icons';

/** 图标说明 */
export const MdiIconName = createIconifyIcon('mdi:icon-name');
```

3. 在组件中：`import { MdiIconName } from '#/icons'`

## 命名规范

- 格式：`{IconSet}{IconName}`，PascalCase
- 示例：MdiMagnify、LucideSearch、CarbonView

## 推荐图标集

- `mdi`: Material Design Icons（推荐）
- `lucide`、`carbon`、`heroicons`

## 禁止

- 使用 emoji 作图标
- 从 `@vben/icons` 或 `~icons/*` 直接导入（应走 `#/icons` 统一入口）

## ActionButton 中使用

```typescript
const actionButtons: ActionButton[] = [
  { text: '新增', icon: MdiPlus, type: 'primary', onClick: () => {} },
];
```

## 参考

- [reference.md](reference.md) - 常用图标清单、outline 风格、JSDoc 规范
