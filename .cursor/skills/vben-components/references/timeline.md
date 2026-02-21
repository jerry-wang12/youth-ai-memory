# Timeline 参考

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
  type?: string;  // 不同节点颜色
}
```

## Events

- `@item-click`: 点击项时触发
