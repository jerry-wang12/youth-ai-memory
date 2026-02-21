/**
 * AuditLayout 组件类型定义（通用，无业务 API 依赖）
 */

/** 审核建议类型 */
export type AuditRecommendation = 'ESCALATE' | 'PASS' | 'PENDING' | 'REJECT';

/** 检查项状态 */
export type ChecklistStatus = 'fail' | 'pass' | 'unknown' | 'warning';

/** 检查清单项 */
export interface AuditChecklistItem {
  item: string;
  status: ChecklistStatus;
  description: string;
}

/** AI 审核结果 */
export interface AuditResult {
  recommendation: AuditRecommendation;
  confidence: number;
  summary: string;
  checklist: AuditChecklistItem[];
  rejectReason?: string;
  pendingReason?: string;
  escalateReason?: string;
}

/** 可驳回的目标节点 */
export interface RejectTarget {
  id: string;
  name: string;
  description?: string;
}

/** 驳回/待定/转交操作类型 */
export type RejectActionType = 'escalate' | 'pending' | 'reject';

/** 驳回/待定/转交操作数据 */
export interface RejectActionData {
  type: RejectActionType;
  reason: string;
  targetNodeDefId?: string;
}

/** AuditLayout 组件 Props */
export interface AuditLayoutProps {
  auditResult?: AuditResult | null;
  loading?: boolean;
  error?: null | string;
  nodeInstanceId?: string;
  rejectableTargets?: RejectTarget[];
  actionLoading?: boolean;
  title?: string;
  /** 右侧助手面板距顶部偏移（px），默认 145 */
  topOffset?: number;
  /** 右侧助手面板展开宽度（px），默认 400 */
  assistantWidth?: number;
  /** 右侧助手面板折叠宽度（px），默认 48 */
  collapsedWidth?: number;
  /** 底部操作条高度（px），用于预留内容区 padding-bottom，默认 80 */
  bottomBarHeight?: number;
}

/** AuditLayout 组件 Emits */
export interface AuditLayoutEmits {
  (e: 'analyze' | 'approve'): void;
  (e: 'reject', data: RejectActionData): void;
}
