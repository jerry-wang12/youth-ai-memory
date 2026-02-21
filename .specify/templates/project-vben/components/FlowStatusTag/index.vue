<script lang="ts" setup>
import type { FlowDefinitionLike, FlowInstanceLike, NodeInstanceLike } from './types';

import { computed } from 'vue';

import { Popover, Tag, Timeline } from 'ant-design-vue';

interface FlowStatusTagProps {
  /** 流程实例数据（满足 FlowInstanceLike 即可，可来自任意 API） */
  flowInstance?: FlowInstanceLike | null;
  /** 加载中 */
  loading?: boolean;
  /** 错误信息 */
  error?: null | string;
  /** 可选：自定义节点名称解析，若不传则从 flowDefinition.nodeDefinitions 解析 */
  nodeNameResolver?: (node: NodeInstanceLike, flowInstance: FlowInstanceLike) => string;
}

const props = withDefaults(defineProps<FlowStatusTagProps>(), {
  flowInstance: null,
  loading: false,
  error: null,
  nodeNameResolver: undefined,
});

type FlowStatus = FlowInstanceLike['status'];
type NodeStatus = NodeInstanceLike['status'];

const getFlowStatusText = (status: FlowStatus) => {
  const map: Record<FlowStatus, string> = {
    INITIALIZED: '待审核',
    RUNNING: '审核中',
    COMPLETED: '审核通过',
    FAILED: '审核不通过',
  };
  return map[status] ?? status;
};

const getTagClass = (status?: FlowStatus) => {
  if (!status) return 'flow-status-tag flow-status-error';
  const classMap: Record<FlowStatus, string> = {
    INITIALIZED: 'flow-status-default',
    RUNNING: 'flow-status-processing',
    COMPLETED: 'flow-status-success',
    FAILED: 'flow-status-error',
  };
  return `flow-status-tag ${classMap[status] ?? 'flow-status-default'}`;
};

const getNodeStatusColor = (status: NodeStatus) => {
  const colorMap: Record<NodeStatus, string> = {
    COMPLETED: 'green',
    RUNNING: 'blue',
    WAITING: 'gray',
    FAILED: 'red',
    REJECTED: 'orange',
  };
  return colorMap[status] ?? 'gray';
};

const getNodeStatusText = (status: NodeStatus) => {
  const map: Record<NodeStatus, string> = {
    COMPLETED: '已完成',
    RUNNING: '进行中',
    WAITING: '待处理',
    FAILED: '失败',
    REJECTED: '已驳回',
  };
  return map[status] ?? status;
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

const flowNodes = computed(() => {
  if (!props.flowInstance) return [];
  const { nodeInstances, flowDefinition } = props.flowInstance;
  return nodeInstances.map((nodeInstance) => {
    const nodeName = props.nodeNameResolver
      ? props.nodeNameResolver(nodeInstance, props.flowInstance!)
      : (flowDefinition?.nodeDefinitions?.find((nd) => nd.id === nodeInstance.nodeDefinitionId)?.name ?? '未知节点');
    const nodeDef = flowDefinition?.nodeDefinitions?.find((nd) => nd.id === nodeInstance.nodeDefinitionId);
    return {
      ...nodeInstance,
      nodeName,
      nodeDescription: nodeDef?.description ?? '',
    };
  });
});

const currentNodeName = computed(() => {
  if (flowNodes.value.length === 0) return '';
  const running = flowNodes.value.find((n) => n.status === 'RUNNING');
  if (running) return running.nodeName;
  const status = props.flowInstance?.status;
  if (status === 'COMPLETED') return '已结束';
  if (status === 'FAILED') return '已终止';
  return '';
});

const shouldShowTag = computed(() => props.flowInstance || props.error || props.loading);
</script>

<template>
  <Popover
    v-if="shouldShowTag"
    overlay-class-name="flow-status-popover"
    placement="bottomLeft"
    trigger="hover"
  >
    <template #content>
      <div class="min-w-[280px] max-w-[360px]">
        <template v-if="props.flowInstance">
          <div class="mb-3 border-b pb-2">
            <div class="flex items-center justify-between">
              <div class="font-medium text-gray-800">
                {{ props.flowInstance.flowDefinition?.name ?? props.flowInstance.name }}
              </div>
            </div>
            <div v-if="currentNodeName" class="mt-1 text-xs text-gray-500">
              当前节点：<span class="text-primary">{{ currentNodeName }}</span>
            </div>
          </div>

          <Timeline class="!mb-0 ml-1 mt-6">
            <Timeline.Item
              v-for="(node, index) in flowNodes"
              :key="node.id"
              :class="{
                'flow-node-current': node.status === 'RUNNING',
                '!pb-6': index !== flowNodes.length - 1,
                '!pb-0': index === flowNodes.length - 1,
              }"
              :color="getNodeStatusColor(node.status)"
            >
              <div class="flow-node-content -mt-1.5">
                <div class="flex items-center justify-between">
                  <span
                    :class="{
                      'text-primary': node.status === 'RUNNING',
                      'text-gray-700': node.status !== 'RUNNING',
                    }"
                    class="text-sm font-medium"
                  >
                    {{ node.nodeName }}
                  </span>
                  <Tag
                    v-if="node.status !== 'WAITING'"
                    :color="getNodeStatusColor(node.status)"
                    class="!mr-0 ml-2 scale-90"
                    size="small"
                  >
                    {{ getNodeStatusText(node.status) }}
                  </Tag>
                </div>
                <div v-if="node.startAt || node.endAt" class="mt-1 text-xs text-gray-400">
                  <span v-if="node.endAt">{{ formatDateTime(node.endAt) }} 完成</span>
                  <span v-else-if="node.startAt">{{ formatDateTime(node.startAt) }} 开始</span>
                </div>
                <div
                  v-if="node.context?.opinion"
                  class="mt-2 rounded bg-gray-50 px-2 py-1.5 text-xs"
                >
                  <div class="flex items-start gap-1.5">
                    <span class="shrink-0 text-gray-500">意见:</span>
                    <span class="text-gray-700">{{ node.context.opinion }}</span>
                  </div>
                </div>
              </div>
            </Timeline.Item>
          </Timeline>
        </template>

        <template v-else-if="props.error">
          <div class="text-sm text-red-500">{{ props.error }}</div>
        </template>
      </div>
    </template>

    <span
      v-if="props.loading && !props.flowInstance"
      class="flow-status-tag flow-status-loading"
    >
      加载中...
    </span>
    <span
      v-else-if="props.flowInstance"
      :class="getTagClass(props.flowInstance.status)"
    >
      {{ getFlowStatusText(props.flowInstance.status) }}
    </span>
    <span v-else-if="props.error" :class="getTagClass()" class="cursor-pointer">
      状态异常
    </span>
  </Popover>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgb(var(--primary-color) / 40%); }
  70% { box-shadow: 0 0 0 6px rgb(var(--primary-color) / 0%); }
}

.flow-status-tag {
  @apply inline-flex h-7 cursor-pointer items-center justify-center rounded px-3 text-sm font-medium transition-colors;
}

.flow-status-default {
  @apply bg-gray-100 text-gray-600 hover:bg-gray-200;
}

.flow-status-processing {
  @apply bg-primary/10 text-primary hover:bg-primary/20;
}

.flow-status-success {
  @apply bg-green-50 text-green-600 hover:bg-green-100;
}

.flow-status-error {
  @apply bg-red-50 text-red-600 hover:bg-red-100;
}

.flow-status-loading {
  @apply bg-gray-100 text-gray-400;
}

.flow-node-current :deep(.ant-timeline-item-head) {
  @apply border-primary bg-primary text-primary;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
