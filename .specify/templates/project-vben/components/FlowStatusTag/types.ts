/**
 * FlowStatusTag 组件最小类型（无业务 API 依赖）
 * 调用方可将后端 DTO 映射为这些接口或直接满足字段即可
 */

/** 流程实例状态 */
export type FlowInstanceStatus = 'COMPLETED' | 'FAILED' | 'INITIALIZED' | 'RUNNING';

/** 节点实例状态 */
export type NodeInstanceStatus = 'COMPLETED' | 'FAILED' | 'REJECTED' | 'RUNNING' | 'WAITING';

/** 节点定义（用于解析节点名称） */
export interface FlowNodeDefinitionLike {
  id: string;
  name?: string;
  description?: string;
}

/** 流程定义 */
export interface FlowDefinitionLike {
  name?: string;
  nodeDefinitions: FlowNodeDefinitionLike[];
}

/** 节点实例 */
export interface NodeInstanceLike {
  id: string;
  nodeDefinitionId: string;
  status: NodeInstanceStatus;
  startAt?: string;
  endAt?: string;
  context?: { opinion?: string };
}

/** 流程实例 */
export interface FlowInstanceLike {
  id: string;
  name?: string;
  status: FlowInstanceStatus;
  flowDefinition: FlowDefinitionLike;
  nodeInstances: NodeInstanceLike[];
}
