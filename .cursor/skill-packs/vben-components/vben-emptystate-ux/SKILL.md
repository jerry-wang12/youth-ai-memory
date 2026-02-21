---
name: vben-emptystate-ux
description: Implements empty state with preset icons, custom icon, title, description, and CTA action slot. Use when showing empty lists, no search results, or empty data states in Vue Vben / Ant Design Vue projects. Must include CTA button.
---

# EmptyState 空状态

空状态展示，列表为空、搜索无结果等场景，**必须**包含 CTA 引导按钮。

## 预设图标类型

folder, document, message, notification, search, wallet（默认 folder）

## 使用示例

```vue
<EmptyState
  title="暂无数据"
  description="点击下方按钮添加新数据"
  icon-type="folder"
>
  <template #action>
    <a-button type="primary">添加数据</a-button>
  </template>
</EmptyState>
```

## Props

- `title`: 标题（默认 '暂无数据'）
- `description`: 描述
- `iconType`: 预设图标
- `icon`: 自定义图标组件（优先级高于 iconType）

## Slots

- `#action`: 操作区域（CTA 按钮）

## 参考

- [reference.md](reference.md)
