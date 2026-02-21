---
name: vben-tablelayout-crud
description: Implements CRUD list pages using TableLayout with search, filter, pagination, and custom columns. Use when building list pages, data tables, CRUD views, or when the user mentions TableLayout, a-table, bodyCell, FilterField, ActionButton, quickFilters, or pagination in a Vue Vben / Ant Design Vue project.
---

# TableLayout CRUD 列表页

在 Vue Vben / Ant Design Vue 项目中，使用 TableLayout 实现带搜索、筛选、分页的 CRUD 列表页。**禁止**直接用 `<a-table>` 做列表。

## 核心原则

1. **必须用根容器包裹**：`<div class="page-container">`，避免 Vue Transition 警告
2. **搜索/筛选后重置页码**：`searchForm.page = 1`
3. **操作列样式**：`type="link"` + `size="small"`，不用图标，用主题色 / Morandi 色系

## 快速流程

1. 定义 `columns`、`filterFields`、`actionButtons`
2. 用 `ref`/`reactive` 管理 `dataSource`、`total`、`searchForm`、`loading`
3. 实现 `handleSearch`、`handleFilter`、`handlePageChange`，均调用 `fetchData()`
4. 模板中用 `bodyCell` 插槽自定义操作列、状态列
5. 页面根元素为 `<div class="page-container">`，内嵌 `<TableLayout>`

## 关键代码

```vue
<template>
  <div class="page-container">
    <TableLayout
      title="数据列表"
      :columns="columns"
      :data-source="dataSource"
      :filter-fields="filterFields"
      :action-buttons="actionButtons"
      :loading="loading"
      :total="total"
      :current="searchForm.page"
      :page-size="searchForm.size"
      @search="handleSearch"
      @filter="handleFilter"
      @page-change="handlePageChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Space size="small">
            <Button size="small" type="link" @click="showDetail(record)">查看</Button>
            <Button size="small" type="link" danger @click="handleDelete(record.id)">删除</Button>
          </Space>
        </template>
      </template>
    </TableLayout>
  </div>
</template>
```

```typescript
const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword || undefined;
  searchForm.page = 1;
  fetchData();
};
const handleFilter = (values: Record<string, any>) => {
  Object.assign(searchForm, values);
  searchForm.page = 1;
  fetchData();
};
```

## 分页注意

- 前端页码从 1 开始
- 若后端从 0 开始：`params.page = (searchForm.page || 1) - 1`

## 参考

- [reference.md](reference.md) - Props/Events 完整说明、操作列样式、快速筛选
- [examples.md](examples.md) - 完整 CRUD 示例、常见坑
