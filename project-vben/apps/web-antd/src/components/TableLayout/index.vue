<script lang="ts" setup>
/**
 * TableLayout 组件
 *
 * 完整的表格布局组件，集成了表头、内容和分页功能
 *
 * 主要特性：
 * - 🔍 搜索功能
 * - 🎛️ 高级筛选
 * - ⚡ 快速筛选
 * - 📊 表格展示
 * - 📄 分页功能
 * - 🎨 自定义操作按钮
 */
import type { TableColumnsType } from 'ant-design-vue';

import type {
  ActionButton,
  FilterField,
  QuickFilter,
  QuickFilterConfig,
  StatisticItem,
} from './TableHeader/index.vue';

import TableContent from './TableContent/index.vue';
import TableHeader from './TableHeader/index.vue';
import TablePagination from './TablePagination/index.vue';

export interface TableLayoutProps {
  actionButtons?: ActionButton[];
  activeQuickFilter?: string;
  // Table 相关
  columns: TableColumnsType;
  current?: number;
  dataSource: any[];
  filterFields?: FilterField[];
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: string[];
  quickFilterConfig?: QuickFilterConfig;
  quickFilters?: QuickFilter[];

  rowClassName?: (record: any, index: number) => string;
  rowKey?: string;
  rowSelection?: any;
  scroll?: { x?: number | string; y?: number | string };
  searchPlaceholder?: string;
  searchValue?: string;
  // Pagination 相关
  showPagination?: boolean;

  showQuickJumper?: boolean;
  showSearch?: boolean;
  showSizeChanger?: boolean;
  showTotal?: boolean;
  size?: 'large' | 'middle' | 'small';
  statistics?: StatisticItem[];
  // Header 相关
  title: string;
  total?: number;
}

interface TableLayoutEmits {
  // Header 事件
  (e: 'search', value: string): void;
  (e: 'refresh'): void;
  (e: 'reset'): void;
  (
    e: 'filter',
    values: Record<string, any>,
    operator?: Record<string, string>,
  ): void;
  (e: 'update:searchValue', value: string): void;
  (e: 'quickFilter', key: string): void;

  // Table 事件
  (e: 'rowClick', record: any, index: number): void;
  (e: 'selectionChange', selectedRowKeys: any[], selectedRows: any[]): void;

  // Pagination 事件
  (e: 'pageChange', page: number, pageSize: number): void;
  (e: 'update:current', page: number): void;
  (e: 'update:pageSize', pageSize: number): void;
}

withDefaults(defineProps<TableLayoutProps>(), {
  loading: false,
  showSearch: true,
  searchPlaceholder: '搜索...',
  searchValue: '',
  filterFields: () => [],
  actionButtons: () => [],
  quickFilters: () => [],
  activeQuickFilter: '',
  quickFilterConfig: () => ({
    showCount: false,
    size: 'small',
    showTitle: true,
  }),
  statistics: () => [],
  rowKey: 'id',
  size: 'middle',
  scroll: () => ({}),
  rowSelection: undefined,
  rowClassName: undefined,
  showPagination: true,
  current: 1,
  pageSize: 10,
  total: 0,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: true,
  pageSizeOptions: () => ['10', '20', '50', '100'],
});

const emit = defineEmits<TableLayoutEmits>();

// Header 事件处理
const handleSearch = (value: string) => {
  emit('search', value);
};

const handleRefresh = () => {
  emit('refresh');
};

const handleReset = () => {
  emit('reset');
};

const handleFilter = (
  values: Record<string, any>,
  operator?: Record<string, string>,
) => {
  emit('filter', values, operator);
};

const handleUpdateSearchValue = (value: string) => {
  emit('update:searchValue', value);
};

const handleQuickFilter = (key: string) => {
  emit('quickFilter', key);
};

// Table 事件处理
const handleRowClick = (record: any, index: number) => {
  emit('rowClick', record, index);
};

const handleSelectionChange = (selectedRowKeys: any[], selectedRows: any[]) => {
  emit('selectionChange', selectedRowKeys, selectedRows);
};

// Pagination 事件处理
const handlePageChange = (page: number, pageSize: number) => {
  emit('pageChange', page, pageSize);
};

const handleUpdateCurrent = (page: number) => {
  emit('update:current', page);
};

const handleUpdatePageSize = (pageSize: number) => {
  emit('update:pageSize', pageSize);
};
</script>

<template>
  <div class="m-2">
    <!-- 主容器 -->
    <div class="overflow-hidden rounded-xl bg-white shadow-sm">
      <!-- Header 头部区域 -->
      <TableHeader
        :action-buttons="actionButtons"
        :active-quick-filter="activeQuickFilter"
        :filter-fields="filterFields"
        :loading="loading"
        :quick-filter-config="quickFilterConfig"
        :quick-filters="quickFilters"
        :search-placeholder="searchPlaceholder"
        :search-value="searchValue"
        :show-search="showSearch"
        :statistics="statistics"
        :title="title"
        @filter="handleFilter"
        @quick-filter="handleQuickFilter"
        @refresh="handleRefresh"
        @reset="handleReset"
        @search="handleSearch"
        @update:search-value="handleUpdateSearchValue"
      >
        <!-- 传递额外操作按钮插槽 -->
        <template #extra-actions>
          <slot name="extra-actions"></slot>
        </template>
      </TableHeader>

      <!-- 头部下方额外内容插槽 -->
      <div v-if="$slots['header-extra']" class="border-t border-gray-100">
        <slot name="header-extra"></slot>
      </div>

      <!-- Content 内容区域 -->
      <TableContent
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :row-class-name="rowClassName"
        :row-key="rowKey"
        :row-selection="rowSelection"
        :scroll="scroll"
        :show-pagination="false"
        :size="size"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <!-- 透传所有插槽 -->
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
      </TableContent>

      <!-- Pagination 分页区域 -->
      <TablePagination
        v-if="showPagination"
        :current="current"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        :show-quick-jumper="showQuickJumper"
        :show-size-changer="showSizeChanger"
        :show-total="showTotal"
        :total="total"
        @change="handlePageChange"
        @update:current="handleUpdateCurrent"
        @update:page-size="handleUpdatePageSize"
      />
    </div>
  </div>
</template>

<style scoped>
/* 可以添加布局相关的样式 */
</style>
