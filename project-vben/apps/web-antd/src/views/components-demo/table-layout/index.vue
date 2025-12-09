<script setup lang="ts">
import { ref } from 'vue';

import type { TableColumnsType } from 'ant-design-vue';

import { TableLayout } from '#/components/TableLayout';
import type { ActionButton, FilterField } from '#/components/TableLayout';

const loading = ref(false);
const dataSource = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    status: 'active',
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    status: 'inactive',
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    status: 'active',
  },
]);

const columns: TableColumnsType = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
];

const filterFields: FilterField[] = [
  {
    key: 'name',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名',
  },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
];

const actionButtons: ActionButton[] = [
  {
    text: '新增',
    type: 'primary',
    onClick: () => {
      console.log('新增');
    },
  },
  {
    text: '导出',
    onClick: () => {
      console.log('导出');
    },
  },
];

const handleSearch = (keyword: string) => {
  console.log('搜索:', keyword);
};

const handleFilter = (params: Record<string, any>) => {
  console.log('筛选:', params);
};

const handleRefresh = () => {
  console.log('刷新');
};
</script>

<template>
  <div class="page-container">
    <TableLayout
      title="用户列表"
      :columns="columns"
      :data-source="dataSource"
      :filter-fields="filterFields"
      :action-buttons="actionButtons"
      :loading="loading"
      :total="dataSource.length"
      @search="handleSearch"
      @filter="handleFilter"
      @refresh="handleRefresh"
    />
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>

