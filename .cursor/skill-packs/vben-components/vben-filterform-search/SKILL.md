---
name: vben-filterform-search
description: Implements standalone FilterForm with input, select, dateRange, expand/collapse, search/reset/refresh. Use when building filter forms, search panels, or advanced filters in Vue Vben / Ant Design Vue projects.
---

# FilterForm 筛选表单

独立筛选表单，支持 input/select/date/dateRange 等，可展开/收缩，内置搜索、重置、刷新。

## 使用示例

```vue
<FilterForm
  :fields="filterFields"
  @search="handleSearch"
  @reset="handleReset"
/>
```

## FilterField 配置

```typescript
const filterFields: FilterField[] = [
  { key: 'keyword', type: 'input', label: '关键词' },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    options: [{ label: '启用', value: 'enabled' }, { label: '禁用', value: 'disabled' }],
  },
];
```

## 字段类型

input, select, dateRange, rangePicker, switch, input-number

## 参考

- [reference.md](reference.md)
