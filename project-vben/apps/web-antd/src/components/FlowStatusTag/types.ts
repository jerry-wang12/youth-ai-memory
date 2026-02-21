/**
 * FlowStatusTag 组件最小类型（无业务 API 依赖）
 */

export type FlowInstanceStatus = 'COMPLETED' | 'FAILED' | 'INITIALIZED' | 'RUNNING';

export type NodeInstanceStatus = 'COMPLETED' | 'FAILED' | 'REJECTED' | 'RUNNING' | 'WAITING';

export interface FlowNodeDefinitionLike {
  id: string;
  name?: string;
  description?: string;
}

export interface FlowDefinitionLike {
  name?: string;
  nodeDefinitions: FlowNodeDefinitionLike[];
}

export interface NodeInstanceLike {
  id: string;
  nodeDefinitionId: string;
  status: NodeInstanceStatus;
  startAt?: string;
  endAt?: string;
  context?: { opinion?: string };
}

export interface FlowInstanceLike {
  id: string;
  name?: string;
  status: FlowInstanceStatus;
  flowDefinition: FlowDefinitionLike;
  nodeInstances: NodeInstanceLike[];
}
