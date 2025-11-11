<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

import { Table } from 'ant-design-vue';

export interface TableContentProps {
  columns: TableColumnsType;
  dataSource: any[];
  loading?: boolean;
  rowClassName?: (record: any, index: number) => string;
  rowKey?: string;
  rowSelection?: any;
  scroll?: { x?: number | string; y?: number | string };
  showPagination?: boolean;
  size?: 'large' | 'middle' | 'small';
}

interface TableContentEmits {
  (e: 'rowClick', record: any, index: number): void;
  (e: 'selectionChange', selectedRowKeys: any[], selectedRows: any[]): void;
}

withDefaults(defineProps<TableContentProps>(), {
  loading: false,
  rowKey: 'id',
  size: 'small',
  showPagination: false,
  scroll: () => ({}),
  rowSelection: undefined,
  rowClassName: undefined,
});

const emit = defineEmits<TableContentEmits>();

// 处理行点击
const handleRowClick = (record: any, index: number) => {
  emit('rowClick', record, index);
};
</script>

<template>
  <div class="px-4">
    <Table
      :columns="columns"
      :custom-row="
        (record: any, index?: number) => ({
          onClick: () => handleRowClick(record, index ?? 0),
        })
      "
      :data-source="dataSource"
      :loading="loading"
      :pagination="showPagination ? undefined : false"
      :row-class-name="rowClassName"
      :row-key="rowKey"
      :row-selection="rowSelection"
      :scroll="scroll"
      :size="size"
      class="min-h-table w-full"
    >
      <!-- 通过插槽透传所有自定义内容 -->
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Table>
  </div>
</template>

<style scoped>
/* 表格最小高度 - 设置为屏幕高度的50% */
.min-h-table {
  min-height: 160px;
}

/* 表格样式优化 */
:deep(.ant-table-thead > tr > th) {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f9fafb;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f8fafc;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f1f5f9;
}

:deep(.ant-table) {
  background: white;
  border-radius: 0.5rem;
}

:deep(.ant-table-container) {
  border-radius: 0.5rem;
}
</style>
