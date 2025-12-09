<script setup lang="ts">
import { ref } from 'vue';

import { FilterForm } from '#/components/FilterForm';
import type { FilterField } from '#/components/FilterForm';

const loading = ref(false);

const filterFields: FilterField[] = [
  {
    key: 'keyword',
    type: 'input',
    label: '关键词',
    placeholder: '请输入关键词',
  },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
  {
    key: 'category',
    type: 'select',
    label: '分类',
    placeholder: '请选择分类',
    multiple: true,
    options: [
      { label: '分类1', value: 'cat1' },
      { label: '分类2', value: 'cat2' },
      { label: '分类3', value: 'cat3' },
    ],
  },
  {
    key: 'date',
    type: 'date',
    label: '日期',
    placeholder: '请选择日期',
  },
  {
    key: 'dateRange',
    type: 'dateRange',
    label: '日期范围',
  },
];

const handleSearch = (params: Record<string, any>) => {
  console.log('搜索参数:', params);
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const handleReset = () => {
  console.log('重置筛选');
};

const handleRefresh = () => {
  console.log('刷新数据');
};
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">FilterForm 组件演示</h1>
      <p class="mb-6 text-gray-600">
        筛选表单组件，支持多种字段类型和展开/收缩功能
      </p>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">基础用法</h2>
        <FilterForm
          :fields="filterFields"
          :loading="loading"
          :max-collapsed-items="3"
          @search="handleSearch"
          @reset="handleReset"
          @refresh="handleRefresh"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>

