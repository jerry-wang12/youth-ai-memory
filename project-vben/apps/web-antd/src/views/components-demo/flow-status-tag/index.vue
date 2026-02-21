<script setup lang="ts">
import { ref } from 'vue';

import { FlowStatusTag } from '#/components/FlowStatusTag';
import type { FlowInstanceLike } from '#/components/FlowStatusTag';

const flowInstance = ref<FlowInstanceLike | null>({
  id: 'demo-flow-1',
  name: '示例流程',
  status: 'RUNNING',
  flowDefinition: {
    name: '审批流程',
    nodeDefinitions: [
      { id: 'n1', name: '提交' },
      { id: 'n2', name: '初审' },
      { id: 'n3', name: '终审' },
    ],
  },
  nodeInstances: [
    { id: 'ni1', nodeDefinitionId: 'n1', status: 'COMPLETED', startAt: '2024-01-01T10:00:00', endAt: '2024-01-01T10:05:00' },
    { id: 'ni2', nodeDefinitionId: 'n2', status: 'RUNNING', startAt: '2024-01-01T11:00:00' },
    { id: 'ni3', nodeDefinitionId: 'n3', status: 'WAITING' },
  ],
});
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">FlowStatusTag 演示</h1>
      <p class="mb-6 text-gray-600">悬停标签可查看流程节点与状态时间轴。</p>
      <section class="rounded-lg border border-gray-200 bg-white p-6">
        <FlowStatusTag :flow-instance="flowInstance" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
