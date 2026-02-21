<script setup lang="ts">
/**
 * AuditLayout 独立 Demo：仅本页渲染，避免与其它 fixed 组件遮挡。
 * 使用默认插槽提供左侧主内容；传入 nodeInstanceId、rejectableTargets 使按钮可用。
 */
import { ref } from 'vue';

import { message } from 'ant-design-vue';

import { AuditLayout } from '#/components/AuditLayout';
import type { AuditResult, RejectActionData, RejectTarget } from '#/components/AuditLayout';

const auditResult = ref<AuditResult | null>({
  recommendation: 'PASS',
  confidence: 0.92,
  summary: '示例：材料齐全，建议通过。',
  checklist: [
    { item: '材料完整', status: 'pass', description: '已核对' },
    { item: '格式正确', status: 'pass', description: '符合要求' },
  ],
});
const auditLoading = ref(false);

const nodeInstanceId = ref('demo-node-1');
const rejectableTargets = ref<RejectTarget[]>([
  { id: 'n1', name: '待定名单', description: '加入待定' },
  { id: 'n2', name: '转交老师', description: '转交处理' },
]);

const handleAnalyze = () => {
  auditLoading.value = true;
  setTimeout(() => {
    auditLoading.value = false;
    message.info('已触发分析（Demo）');
  }, 500);
};

const handleApprove = () => {
  message.success('审核通过（Demo）');
};

const handleReject = (data: RejectActionData) => {
  message.warning(`驳回/待定/转交（Demo）：${data.type}，原因：${data.reason || '-'}`);
};
</script>

<template>
  <div class="page-container audit-layout-page">
    <AuditLayout
      :audit-result="auditResult"
      :loading="auditLoading"
      :node-instance-id="nodeInstanceId"
      :rejectable-targets="rejectableTargets"
      title="审核助手 Demo"
      @analyze="handleAnalyze"
      @approve="handleApprove"
      @reject="handleReject"
    >
      <div class="min-h-[200px] rounded bg-gray-50 p-4">
        <h2 class="mb-2 text-lg font-semibold">主内容区（默认插槽）</h2>
        <p class="text-gray-600">
          左侧为主内容区，右侧为助手面板（可折叠），底部为审核操作条。传入 nodeInstanceId 后「审核通过」「驳回修改」可点击。
        </p>
      </div>
    </AuditLayout>
  </div>
</template>

<style scoped>
.page-container.audit-layout-page {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
