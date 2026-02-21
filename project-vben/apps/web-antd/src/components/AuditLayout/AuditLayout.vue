<script lang="ts" setup>
/**
 * AuditLayout - 通用审核布局组件（无业务 API 依赖）
 * 左侧内容插槽 + 右侧助手面板（可折叠）+ 固定底部操作条
 */
import type {
  AuditLayoutEmits,
  AuditLayoutProps,
  RejectActionType,
} from './types';

import { computed, reactive, ref } from 'vue';

import { Button, Card, Input, Modal, Popover, Select } from 'ant-design-vue';

import {
  LetsIconsCheckFill,
  LetsIconsCloseRoundFill,
  MdiAlertCircleOutline,
  MdiCheck,
  MdiChevronRight,
  MdiClock,
  MdiClose,
  MdiCopy,
  MdiHelpCircleOutline,
  MdiRefresh,
  MingcuteBulb2AiLine,
  MingcuteTransfer3Fill,
} from '#/icons';

const props = withDefaults(defineProps<AuditLayoutProps>(), {
  auditResult: null,
  loading: false,
  error: null,
  nodeInstanceId: undefined,
  rejectableTargets: () => [],
  actionLoading: false,
  title: '审核助手',
  topOffset: 145,
  assistantWidth: 400,
  collapsedWidth: 48,
  bottomBarHeight: 80,
});

const emit = defineEmits<AuditLayoutEmits>();

const copySuccess = ref(false);
const isCollapsed = ref(false);
const rejectModalState = reactive({
  visible: false,
  type: 'reject' as RejectActionType,
  reason: '',
  targetNodeDefId: undefined as string | undefined,
});

const handleAnalyze = () => emit('analyze');
const handleApprove = () => emit('approve');

const openRejectModal = (type: RejectActionType) => {
  rejectModalState.type = type;
  rejectModalState.visible = true;
  rejectModalState.reason = '';
  if (props.auditResult) {
    if (type === 'reject' && props.auditResult.rejectReason)
      rejectModalState.reason = props.auditResult.rejectReason;
    else if (type === 'pending' && props.auditResult.pendingReason)
      rejectModalState.reason = props.auditResult.pendingReason;
    else if (type === 'escalate' && props.auditResult.escalateReason)
      rejectModalState.reason = props.auditResult.escalateReason;
  }
  if (props.rejectableTargets?.length) {
    const defaultTarget = props.rejectableTargets.find((t) => {
      if (type === 'pending') return t.name.includes('待定');
      if (type === 'escalate') return t.name.includes('老师') || t.name.includes('转交');
      return true;
    });
    rejectModalState.targetNodeDefId = defaultTarget?.id ?? props.rejectableTargets[0]?.id;
  }
};

const handleConfirmReject = () => {
  if (!rejectModalState.reason.trim()) return;
  emit('reject', {
    type: rejectModalState.type,
    reason: rejectModalState.reason,
    targetNodeDefId: rejectModalState.targetNodeDefId,
  });
  rejectModalState.visible = false;
};

const handleCopySummary = async () => {
  if (!props.auditResult?.summary) return;
  try {
    await navigator.clipboard.writeText(props.auditResult.summary);
    copySuccess.value = true;
    setTimeout(() => { copySuccess.value = false; }, 2000);
  } catch (e) {
    console.error('复制失败:', e);
  }
};

const toggleCollapse = () => { isCollapsed.value = !isCollapsed.value; };

const getRecommendationText = (r: string) =>
  ({ PASS: '建议通过', REJECT: '建议驳回', PENDING: '建议待定', ESCALATE: '转交老师' }[r] ?? r);

const getCheckStatusIcon = (status: string) => {
  const map: Record<string, { color: string; icon: any }> = {
    pass: { icon: LetsIconsCheckFill, color: 'text-green-500' },
    fail: { icon: LetsIconsCloseRoundFill, color: 'text-red-500' },
    warning: { icon: MdiAlertCircleOutline, color: 'text-orange-500' },
    unknown: { icon: MdiHelpCircleOutline, color: 'text-gray-400' },
  };
  return map[status] ?? map.unknown!;
};

const getModalTitle = (type: RejectActionType) =>
  ({ reject: '驳回修改', pending: '加入待定名单', escalate: '转交老师处理' }[type]);

const getReasonLabel = (type: RejectActionType) =>
  ({ reject: '驳回原因', pending: '待定原因', escalate: '转交原因' }[type]);

defineExpose({
  closeRejectModal: () => { rejectModalState.visible = false; },
});

const layoutStyle = computed(() => ({ paddingBottom: `${props.bottomBarHeight}px` }));
const assistantStyle = computed(() => ({
  top: `${props.topOffset}px`,
  right: '8px',
  width: `${props.assistantWidth}px`,
}));
const assistantCollapsedStyle = computed(() => ({
  top: `${props.topOffset}px`,
  right: '8px',
  width: `${props.collapsedWidth}px`,
}));
const leftWidth = computed(() =>
  isCollapsed.value
    ? `calc(100% - ${props.collapsedWidth + 8}px)`
    : `calc(100% - ${props.assistantWidth + 8}px)`);
const cardHeight = computed(() =>
  `calc(100vh - ${props.topOffset + props.bottomBarHeight + 80}px)`);
</script>

<template>
  <div class="audit-layout flex h-full flex-col" :style="layoutStyle">
    <div class="relative flex flex-1 overflow-hidden">
      <div
        class="audit-layout__left flex flex-col gap-4 overflow-y-auto pr-2 transition-all duration-300"
        :style="{ width: leftWidth }"
      >
        <slot />
      </div>
    </div>

    <div
      :class="{ 'audit-layout__assistant--collapsed': isCollapsed }"
      class="audit-layout__assistant transition-all duration-300"
      :style="isCollapsed ? assistantCollapsedStyle : assistantStyle"
    >
      <div
        v-if="isCollapsed"
        class="flex h-full flex-col items-center gap-3 rounded-lg bg-white py-3 shadow-sm"
      >
        <button
          class="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-purple-500"
          title="展开审核助手"
          @click="toggleCollapse"
        >
          <MingcuteBulb2AiLine
            :class="loading ? 'animate-spin text-purple-500' : ''"
            class="h-5 w-5"
          />
        </button>
        <Popover
          v-if="auditResult"
          :overlay-style="{ maxWidth: '320px' }"
          placement="left"
          trigger="hover"
        >
          <template #content>
            <div class="relative">
              <div class="mb-2 flex items-center gap-2">
                <span
                  :class="{
                    'text-emerald-500': auditResult.recommendation === 'PASS',
                    'text-red-500': auditResult.recommendation === 'REJECT',
                    'text-orange-500': auditResult.recommendation === 'PENDING',
                    'text-purple-500': auditResult.recommendation === 'ESCALATE',
                  }"
                  class="text-base font-bold"
                >
                  {{ getRecommendationText(auditResult.recommendation) }}
                </span>
                <span class="text-xs text-gray-400">{{ auditResult.confidence }}%</span>
              </div>
              <p class="pr-6 text-sm leading-relaxed text-gray-600">{{ auditResult.summary }}</p>
              <button
                :class="copySuccess ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'"
                class="absolute right-0 top-0 rounded-full p-1 transition-all duration-200"
                title="复制摘要"
                @click.stop="handleCopySummary"
              >
                <MdiCheck v-if="copySuccess" class="h-4 w-4" />
                <MdiCopy v-else class="h-4 w-4" />
              </button>
            </div>
          </template>
          <div class="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100">
            <LetsIconsCheckFill
              v-if="auditResult.recommendation === 'PASS'"
              class="h-5 w-5 text-emerald-500"
            />
            <LetsIconsCloseRoundFill
              v-else-if="auditResult.recommendation === 'REJECT'"
              class="h-5 w-5 text-red-500"
            />
            <MdiClock
              v-else-if="auditResult.recommendation === 'PENDING'"
              class="h-5 w-5 text-orange-500"
            />
            <MingcuteTransfer3Fill
              v-else-if="auditResult.recommendation === 'ESCALATE'"
              class="h-5 w-5 text-purple-500"
            />
          </div>
        </Popover>
        <button
          :class="{ 'pointer-events-none opacity-50': loading }"
          :disabled="loading"
          class="mt-auto rounded-full bg-gray-100 p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-purple-500"
          title="重新分析"
          @click="handleAnalyze"
        >
          <MdiRefresh :class="{ 'animate-spin': loading }" class="h-4 w-4" />
        </button>
      </div>

      <Card v-else :bordered="false" class="audit-layout__card shadow-sm" :style="{ height: cardHeight }">
        <div class="audit-layout__content">
          <div class="audit-layout__header">
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="rounded-full bg-gray-100 p-1.5">
                  <MingcuteBulb2AiLine class="h-4 w-4 text-gray-500" />
                </div>
                <span class="font-medium text-gray-700">{{ title }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Button
                  :disabled="loading"
                  class="!flex items-center gap-1 !px-0"
                  size="small"
                  type="link"
                  @click="handleAnalyze"
                >
                  <MdiRefresh :class="{ 'animate-spin': loading }" class="h-4 w-4" />
                  <span>重新分析</span>
                </Button>
                <button
                  class="ml-2 rounded-full bg-gray-100 p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                  title="收起"
                  @click="toggleCollapse"
                >
                  <MdiChevronRight class="h-4 w-4" />
                </button>
              </div>
            </div>
            <template v-if="auditResult && !loading">
              <div class="mb-4 flex items-center gap-3 px-1">
                <span
                  :class="{
                    'text-emerald-500': auditResult.recommendation === 'PASS',
                    'text-red-500': auditResult.recommendation === 'REJECT',
                    'text-orange-500': auditResult.recommendation === 'PENDING',
                    'text-purple-500': auditResult.recommendation === 'ESCALATE',
                  }"
                  class="text-2xl font-bold"
                >
                  {{ getRecommendationText(auditResult.recommendation) }}
                </span>
                <span
                  :class="{
                    'bg-emerald-100 text-emerald-700': auditResult.recommendation === 'PASS',
                    'border border-orange-100 bg-orange-50 text-orange-600': auditResult.recommendation === 'REJECT',
                    'bg-orange-100 text-orange-700': auditResult.recommendation === 'PENDING',
                    'bg-purple-100 text-purple-700': auditResult.recommendation === 'ESCALATE',
                  }"
                  class="rounded-lg px-3 py-0.5 text-sm font-bold"
                >
                  {{ auditResult.confidence }}% 置信度
                </span>
              </div>
              <div
                :class="{
                  'border-emerald-100 bg-emerald-50': auditResult.recommendation === 'PASS',
                  'border-red-100/50 bg-red-50/50': auditResult.recommendation === 'REJECT',
                  'border-orange-100/50 bg-orange-50/50': auditResult.recommendation === 'PENDING',
                  'border-purple-100/50 bg-purple-50/50': auditResult.recommendation === 'ESCALATE',
                }"
                class="relative mb-4 rounded-xl border p-4"
              >
                <p class="pr-6 text-sm leading-relaxed text-gray-700">{{ auditResult.summary }}</p>
                <button
                  :class="copySuccess ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'"
                  class="absolute bottom-3 right-3 rounded-full p-1 transition-all duration-200"
                  title="复制摘要"
                  @click="handleCopySummary"
                >
                  <MdiCheck v-if="copySuccess" class="h-4 w-4" />
                  <MdiCopy v-else class="h-4 w-4" />
                </button>
              </div>
            </template>
          </div>

          <div v-if="auditResult && !loading" class="audit-layout__checklist">
            <h4 class="sticky top-0 z-10 mb-2 bg-white px-1 pb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              审核清单详情
            </h4>
            <div class="space-y-0">
              <div
                v-for="(item, index) in auditResult.checklist"
                :key="index"
                class="flex items-start gap-3 border-b border-gray-50 py-4 last:border-b-0"
              >
                <div class="mt-0.5 flex-shrink-0">
                  <component
                    :is="getCheckStatusIcon(item.status).icon"
                    :class="getCheckStatusIcon(item.status).color"
                    class="h-5 w-5"
                  />
                </div>
                <div class="flex-1">
                  <h5 class="mb-1 text-sm font-semibold text-gray-800">{{ item.item }}</h5>
                  <p
                    :class="{ 'text-red-500/90': item.status === 'fail', 'text-gray-500': item.status !== 'fail' }"
                    class="text-[13px] leading-normal"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="flex-1 py-8 text-center text-gray-400">
            <MingcuteBulb2AiLine class="mx-auto mb-2 h-12 w-12 animate-spin text-purple-500" />
            <p>正在分析中…</p>
          </div>
          <div v-else-if="error" class="rounded-lg bg-red-50 p-4 text-center text-red-600">
            {{ error }}
            <Button size="small" type="link" @click="handleAnalyze">重试</Button>
          </div>
          <div v-else-if="!auditResult" class="flex-1 py-8 text-center text-gray-400">
            <MingcuteBulb2AiLine class="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>等待审核分析…</p>
          </div>
        </div>
      </Card>
    </div>

    <div class="audit-layout__footer fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-8 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div class="mx-auto flex max-w-screen-xl items-center justify-center gap-4">
        <Button
          :disabled="!nodeInstanceId"
          :loading="actionLoading"
          class="audit-action-btn min-w-[120px] !border-green-500 !bg-green-500 hover:!bg-green-600"
          size="large"
          type="primary"
          @click="handleApprove"
        >
          <MdiCheck class="h-4 w-4" />
          <span>审核通过</span>
        </Button>
        <Button
          :disabled="!nodeInstanceId"
          :loading="actionLoading"
          class="audit-action-btn min-w-[120px]"
          danger
          size="large"
          type="primary"
          @click="openRejectModal('reject')"
        >
          <MdiClose class="h-4 w-4" />
          <span>驳回修改</span>
        </Button>
      </div>
    </div>

    <Modal
      v-model:open="rejectModalState.visible"
      :confirm-loading="actionLoading"
      :title="getModalTitle(rejectModalState.type)"
      @ok="handleConfirmReject"
    >
      <div class="space-y-4 py-4">
        <div v-if="rejectableTargets && rejectableTargets.length > 0">
          <label class="mb-2 block text-sm font-medium text-gray-700">流转到节点</label>
          <Select v-model:value="rejectModalState.targetNodeDefId" class="w-full" placeholder="选择目标节点">
            <Select.Option v-for="target in rejectableTargets" :key="target.id" :value="target.id">
              {{ target.name }}
              <span v-if="target.description" class="text-gray-400"> - {{ target.description }}</span>
            </Select.Option>
          </Select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">{{ getReasonLabel(rejectModalState.type) }}</label>
          <Input.TextArea v-model:value="rejectModalState.reason" :rows="4" placeholder="请输入原因..." />
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.audit-layout__assistant {
  position: fixed;
  z-index: 10;
}

.audit-layout__card :deep(.ant-card-body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 12px;
  overflow: hidden;
}

.audit-layout__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.audit-layout__header {
  flex-shrink: 0;
}

.audit-layout__checklist {
  flex: 1;
  padding-right: 4px;
  overflow-y: auto;
}

.audit-layout__checklist::-webkit-scrollbar {
  width: 3px;
}

.audit-layout__checklist::-webkit-scrollbar-track {
  background: transparent;
}

.audit-layout__checklist::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 20%);
  border-radius: 3px;
}

.audit-action-btn {
  display: inline-flex !important;
  gap: 6px !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
