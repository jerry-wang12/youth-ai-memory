# AuditLayout 审核布局组件

通用审核布局：左侧内容插槽 + 右侧 AI 审核助手面板（可折叠）+ 固定底部操作条。无业务 API 依赖，数据与事件由调用方传入。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| auditResult | AuditResult \| null | null | 审核结果（含 recommendation、confidence、summary、checklist 等） |
| loading | boolean | false | 分析加载中 |
| error | string \| null | null | 错误信息 |
| nodeInstanceId | string | - | 当前可操作节点 ID，控制底部按钮是否可用 |
| rejectableTargets | RejectTarget[] | [] | 可驳回目标节点列表 |
| actionLoading | boolean | false | 操作按钮加载中 |
| title | string | '审核助手' | 面板标题 |
| topOffset | number | 145 | 右侧面板距顶部偏移（px） |
| assistantWidth | number | 400 | 右侧面板展开宽度（px） |
| collapsedWidth | number | 48 | 右侧面板折叠宽度（px） |
| bottomBarHeight | number | 80 | 底部操作条高度（px），用于预留内容区 |

## Events

- `analyze`：触发重新分析
- `approve`：审核通过
- `reject`：(data: RejectActionData) 驳回/待定/转交

## Slots

- default：左侧主内容区域

## 使用示例

```vue
<AuditLayout
  :audit-result="auditResult"
  :loading="loading"
  :error="error"
  :node-instance-id="nodeInstanceId"
  :rejectable-targets="rejectableTargets"
  :action-loading="actionLoading"
  top-offset="160"
  @analyze="runAnalyze"
  @approve="handleApprove"
  @reject="handleReject"
>
  <Card title="申请详情"> ... </Card>
</AuditLayout>
```

类型定义见 `./types.ts`。
