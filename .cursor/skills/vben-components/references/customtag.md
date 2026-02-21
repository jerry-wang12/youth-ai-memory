# CustomTag 参考

标签组件，支持自定义颜色、图标、可删除、系统/自定义类型区分。

## 使用示例

```vue
<CustomTag
  id="tag-1"
  name="重要"
  type="CUSTOM"
  color="#FF0000"
  :icon-component="MdiFlag"
  :closable="true"
  @close="handleClose"
/>
```

## Props

- `id`, `name`, `type`: 'CUSTOM' | 'SYS'
- `color`: 标签颜色（Morandi 色推荐）
- `iconComponent`: 图标组件
- `closable`: 是否可删除
- `disabled`: 是否禁用

## Events

- `@close` (id)
- `@click` (id)
