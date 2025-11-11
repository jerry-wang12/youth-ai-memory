# TableLayout 组件使用指南

## 概述

TableLayout 是一个集成了表格头部、内容和分页的完整表格布局组件，提供了统一的表格展示解决方案。

## 核心特性

- 🔍 **集成搜索功能** - 内置搜索框，支持关键词搜索
- ⚡ **快速筛选** - 支持快捷筛选按钮，便于快速切换数据视图
- 🎛️ **高级筛选** - 支持多种字段类型的筛选条件
- 📊 **表格展示** - 基于 Ant Design Vue Table 组件
- 📄 **分页功能** - 内置分页组件，支持自定义配置
- 🎨 **操作按钮** - 支持自定义头部操作按钮

## ⚠️ 重要使用规则

### 根元素结构要求

**必须**在页面中使用 TableLayout 时添加根容器元素，避免 Vue Transition 警告。

#### ❌ 错误用法

```vue
<template>
  <TableLayout
    :columns="columns"
    :data-source="dataSource"
    title="列表页面"
    @search="handleSearch"
  />
</template>
```

#### ✅ 正确用法

```vue
<template>
  <div class="page-container">
    <TableLayout
      :columns="columns"
      :data-source="dataSource"
      title="列表页面"
      @search="handleSearch"
    />
  </div>
</template>
```

## Props 配置

### Header 相关

- `title` - 页面标题
- `loading` - 加载状态
- `showSearch` - 是否显示搜索框
- `searchPlaceholder` - 搜索框占位符
- `searchValue` - 搜索值
- `filterFields` - 筛选字段配置
- `actionButtons` - 操作按钮配置
- `quickFilters` - 快速筛选配置
- `activeQuickFilter` - 当前激活的快速筛选
- `quickFilterConfig` - 快速筛选显示配置

### Table 相关

- `columns` - 表格列配置
- `dataSource` - 表格数据
- `rowKey` - 行键
- `size` - 表格尺寸
- `scroll` - 滚动配置

### Pagination 相关

- `showPagination` - 是否显示分页
- `current` - 当前页码
- `pageSize` - 每页条数
- `total` - 总数据量

## Events 事件

### Header 事件

- `@search` - 搜索事件
- `@refresh` - 刷新事件
- `@reset` - 重置事件
- `@filter` - 筛选事件
- `@quickFilter` - 快速筛选事件

### Table 事件

- `@rowClick` - 行点击事件
- `@selectionChange` - 选择变更事件

### Pagination 事件

- `@pageChange` - 分页变更事件

## 快速开始

```vue
<script setup lang="ts">
import { TableLayout } from '#/components/TableLayout';
import type { FilterField, ActionButton } from '#/components/TableLayout';

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 150 },
];

const filterFields: FilterField[] = [
  {
    key: 'status',
    type: 'select',
    label: '状态',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
];

const actionButtons: ActionButton[] = [
  { text: '新增', type: 'primary', onClick: () => showModal() },
];

const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword;
  fetchData();
};

const handleFilter = (values: Record<string, any>) => {
  Object.assign(searchForm, values);
  fetchData();
};
</script>

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
    />
  </div>
</template>
```

## 快速筛选功能（可选）

### 接口定义

```typescript
export interface QuickFilter {
  key: string;
  label: string;
  icon?: string;
  tooltip?: string;
  count?: number;
  color?: 'gold' | 'orange' | 'red' | 'purple' | 'green' | 'blue';
}

export interface QuickFilterConfig {
  showCount?: boolean; // 显示计数
  size?: 'small' | 'large'; // 卡片大小
  showTitle?: boolean; // 显示标题
}
```

### 配置示例

```typescript
const quickFilters: QuickFilter[] = [
  { key: 'all', label: '全部', count: 150 },
  { key: 'published', label: '已发布', count: 120 },
  { key: 'draft', label: '草稿', count: 30 },
];

const quickFilterConfig: QuickFilterConfig = {
  showCount: true,
  size: 'small',
  showTitle: true,
};

const handleQuickFilter = (filterKey: string) => {
  activeQuickFilter.value = filterKey;
  searchForm.status = filterKey === 'all' ? '' : filterKey;
  searchForm.page = 1;
  fetchData();
};
```

### 使用最佳实践

1. **筛选项数量**：3-6 个为宜，过多会影响体验
2. **提示信息**：添加 tooltip 说明筛选作用
3. **状态同步**：与高级筛选保持一致
4. **重置处理**：重置时同步更新快速筛选状态

## 操作列样式规范

### 核心原则

1. **去除图标** - 操作列仅使用文字，避免视觉干扰
2. **克制配色** - 使用主题色或 Morandi 柔和色系
3. **统一样式** - 统一使用 `type="link"` + `size="small"`

### 推荐写法

```vue
<template #bodyCell="{ column, record }">
  <!-- 操作列 -->
  <template v-if="column.key === 'action'">
    <Space size="small">
      <Button
        class="p-0 text-[hsl(var(--primary))]"
        size="small"
        type="link"
        @click="showDetail(record)"
      >
        查看
      </Button>
      <Button
        class="p-0 text-red-600"
        danger
        size="small"
        type="link"
        @click="handleDelete(record)"
      >
        删除
      </Button>
    </Space>
  </template>

  <!-- 标签列 -->
  <template v-else-if="column.key === 'status'">
    <Tag :color="getStatusColor(record.status)">
      {{ record.statusName }}
    </Tag>
  </template>
</template>
```

### 颜色速查

**操作按钮**：
- 主要操作：`text-[hsl(var(--primary))]`
- 危险操作：`text-red-600` + `danger`

**柔和色系（Morandi）**：
```typescript
// 分类标签
{ CHINESE: '#9DBEBB', FOREIGN: '#A5B8D0', SAIS: '#C9B4D4' }

// 状态标签
{ Pending: '#D4A574', Approved: '#9DBEBB', Rejected: '#C9A4A1', Unverified: '#B8B8B8' }
```

### 注意事项

- ❌ 不要使用图标
- ❌ 避免鲜艳颜色（`#FF0000`、`#FF9800`、`#4CAF50`、`#3399FF`、`#CC33CC`）
- ✅ 优先使用主题色变量
- ✅ 状态标签使用柔和色系

## 样式定制

TableLayout 使用了 Tailwind CSS 类名，你可以通过以下方式自定义样式：

1. **根容器样式**

```vue
<div class="my-page min-h-screen bg-gray-50 p-4">
  <TableLayout ... />
</div>
```

2. **深度样式覆盖**

```vue
<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: #f9fafb;
}
</style>
```

## 注意事项

1. ⚠️ **必须使用根容器** - 避免 Vue Transition 警告
2. 🎯 **合理设置 rowKey** - 确保表格渲染性能
3. 📱 **响应式适配** - 使用 scroll 属性处理移动端展示
4. 🔄 **事件处理** - 正确处理搜索、筛选、分页等事件
5. 📊 **数据格式** - 确保 dataSource 数据格式正确

## 相关组件

- [TableHeader](../TableHeader/) - 表格头部组件
- [TableContent](../TableContent/) - 表格内容组件
- [TablePagination](../TablePagination/) - 表格分页组件
