---
name: vben-auditlayout-flow-toolkit
description: Implements audit/approval pages using AuditLayout, FlowStatusTag, FixedFooter, UniversalUpload. Use when building approval flow, workflow status tag, fixed bottom bar, or modal file upload with injected uploadApi in Vue Vben projects.
---

# 审批/流程/底部操作条

在 Vue Vben 审批、工单、流程类页面中，使用 AuditLayout、FlowStatusTag、FixedFooter、UniversalUpload。无业务 API 依赖，数据与事件由调用方传入。

## AuditLayout

左侧主内容 + 右侧审核助手面板（可折叠）+ 固定底部操作条。

```vue
<AuditLayout
  :audit-result="auditResult"
  :loading="loading"
  :node-instance-id="nodeInstanceId"
  :rejectable-targets="rejectableTargets"
  :action-loading="actionLoading"
  @analyze="runAnalyze"
  @approve="handleApprove"
  @reject="handleReject"
>
  <Card title="申请详情">主内容</Card>
</AuditLayout>
```

关键 Props：`auditResult`、`nodeInstanceId`、`rejectableTargets`；Events：`analyze`、`approve`、`reject`。

## FlowStatusTag

在列表或详情中展示流程状态，悬停显示节点时间线。

```vue
<FlowStatusTag :flow-instance="flowInstance" :loading="loading" :error="error" />
```

最小数据结构：`FlowInstanceLike`（id、status、flowDefinition、nodeInstances），`FlowDefinitionLike`（nodeDefinitions），`NodeInstanceLike`（id、nodeDefinitionId、status、startAt、endAt、context.opinion）。后端 DTO 若字段一致可直接传入，否则做一次映射。

## FixedFooter

固定在底部的操作栏，可传 `left-offset` 避开侧边栏。

```vue
<FixedFooter :left-offset="'var(--vben-sidebar-width)'">
  <a-button @click="cancel">取消</a-button>
  <a-button type="primary" @click="submit">提交</a-button>
</FixedFooter>
```

## UniversalUpload

弹窗式上传，通过 props 注入 `uploadApi`、`templateApi`，无业务 API 依赖。

```vue
<UniversalUpload
  v-model:visible="uploadVisible"
  title="上传文件"
  :upload-api="uploadFile"
  :template-api="downloadTemplate"
  :max-size="10 * 1024 * 1024"
  @success="onSuccess"
/>
```

## 参考

- [reference.md](reference.md) - AuditResult、RejectActionData、FlowInstanceLike 类型、各组件 Props 速查
