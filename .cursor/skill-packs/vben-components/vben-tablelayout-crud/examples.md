# TableLayout 示例

## 最小可用示例

```vue
<script setup lang="ts">
import { TableLayout } from '#/components/TableLayout';
import type { FilterField, ActionButton } from '#/components/TableLayout';

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '操作', key: 'action', width: 150 },
];
const filterFields: FilterField[] = [
  { key: 'status', type: 'select', label: '状态', options: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }] },
];
const actionButtons: ActionButton[] = [{ text: '新增', type: 'primary', onClick: () => {} }];

const dataSource = ref([]);
const total = ref(0);
const searchForm = reactive({ keyword: '', page: 1, size: 10 });
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    // const res = await getList({ ...searchForm, page: searchForm.page - 1 });
    // dataSource.value = res.content; total.value = res.total;
  } finally { loading.value = false; }
};

const handleSearch = (k: string) => { searchForm.keyword = k || undefined; searchForm.page = 1; fetchData(); };
const handleFilter = (v: any) => { Object.assign(searchForm, v); searchForm.page = 1; fetchData(); };
const handlePageChange = (p: number, s: number) => { searchForm.page = p; searchForm.size = s; fetchData(); };
</script>

<template>
  <div class="page-container">
    <TableLayout
      title="列表"
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

## 常见坑

1. **根容器**：忘记包 `<div class="page-container">` → Vue Transition 警告
2. **分页**：搜索/筛选后没 `searchForm.page = 1` → 分页错乱
3. **后端页码**：前端 1-based、后端 0-based 需转换
