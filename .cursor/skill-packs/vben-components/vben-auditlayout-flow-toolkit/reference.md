# 审批/流程/底部条 参考

## AuditLayout

Props: auditResult, loading, error, nodeInstanceId, rejectableTargets, actionLoading, topOffset, assistantWidth, collapsedWidth, bottomBarHeight

Events: analyze, approve, reject(RejectActionData)

AuditResult: recommendation, confidence, summary, checklist, rejectReason?, pendingReason?, escalateReason?

RejectActionData: type(escalate|pending|reject), reason, targetNodeDefId?

## FlowStatusTag

Props: flowInstance, loading, error, nodeNameResolver?

FlowInstanceLike: id, name?, status, flowDefinition, nodeInstances

FlowDefinitionLike: name?, nodeDefinitions[{ id, name?, description? }]

NodeInstanceLike: id, nodeDefinitionId, status, startAt?, endAt?, context?.opinion

## FixedFooter

Props: leftOffset(number|string), zIndex, padding, maxWidth

leftOffset 示例: 0, "var(--vben-sidebar-width)", 256

## UniversalUpload

Props: visible, uploadApi(file=>Promise), templateApi?()=>Promise<Blob>, accept, maxSize, maxCount, title, width

Events: success, error, change
