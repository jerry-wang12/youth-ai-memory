---
name: vben-timeline-records
description: Implements timeline with auto date grouping, node colors, attachments, and item click. Use when building timelines, activity logs, or chronological records in Vue Vben / Ant Design Vue projects.
---

# Timeline 时间轴

按年/月/日自动分组展示记录，支持节点颜色、附件、自定义操作。

## 使用示例

```vue
<Timeline :items="items" @item-click="handleItemClick" />
```

## TimelineItem 结构

```typescript
{
  id: number | string;
  title: string;
  content: string;
  time: string;
  type?: string;
}
```

## Events

- `@item-click`: 点击项时触发

## 参考

- [reference.md](reference.md)
