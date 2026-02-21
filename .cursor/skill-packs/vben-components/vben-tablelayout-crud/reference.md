# TableLayout 参考

## Props 速查

| 分类 | Prop | 类型 | 说明 |
|------|------|------|------|
| Header | title | string | 页面标题 |
| Header | filterFields | FilterField[] | 筛选字段配置 |
| Header | actionButtons | ActionButton[] | 操作按钮 |
| Header | quickFilters | QuickFilter[] | 快速筛选（可选） |
| Table | columns | TableColumnsType | 表格列 |
| Table | dataSource | any[] | 数据源 |
| Table | rowKey | string | 行键 |
| Pagination | current | number | 当前页码 |
| Pagination | pageSize | number | 每页条数 |
| Pagination | total | number | 总条数 |

## Events 速查

- `@search` (keyword: string)
- `@filter` (values: Record<string, any>)
- `@page-change` (page: number, pageSize: number)
- `@refresh` `@reset` `@quick-filter`

## FilterField 类型

- `input` `select` `dateRange` `rangePicker` `switch` `input-number`

## 操作列规范

- 使用 `Button type="link" size="small"`
- 主要操作：`text-[hsl(var(--primary))]` 或主题色
- 危险操作：`danger` + `text-red-600`
- 不写图标

## 状态标签 Morandi 色

```typescript
{ Pending: '#D4A574', Approved: '#9DBEBB', Rejected: '#C9A4A1', Unverified: '#B8B8B8' }
```

## QuickFilter 配置

```typescript
{ key, label, count?, color?: 'gold'|'orange'|'red'|'purple'|'green'|'blue' }
QuickFilterConfig: { showCount?, size?: 'small'|'large', showTitle? }
```
