# FlowStatusTag 流程状态标签

用于列表或详情中展示流程实例状态，悬停显示节点时间线。无业务 API 依赖，仅依赖组件内定义的 `FlowInstanceLike` 等类型，调用方传入满足该结构的数据即可。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| flowInstance | FlowInstanceLike \| null | null | 流程实例（需含 status、flowDefinition.nodeDefinitions、nodeInstances） |
| loading | boolean | false | 加载中 |
| error | string \| null | null | 错误时展示「状态异常」 |
| nodeNameResolver | (node, flowInstance) => string | - | 可选，自定义节点名称；不传则从 flowDefinition.nodeDefinitions 按 nodeDefinitionId 解析 |

## 类型说明

- `FlowInstanceLike`：含 `id`、`name?`、`status`、`flowDefinition`、`nodeInstances`
- `FlowDefinitionLike`：含 `name?`、`nodeDefinitions`（数组元素含 `id`、`name?`、`description?`）
- `NodeInstanceLike`：含 `id`、`nodeDefinitionId`、`status`、`startAt?`、`endAt?`、`context?.opinion`

后端 DTO 若字段一致可直接传入；否则在页面层做一次映射即可。

## 使用示例

```vue
<FlowStatusTag
  :flow-instance="flowInstance"
  :loading="loading"
  :error="error"
/>
```

在表格列中：

```vue
customRender: ({ record }) => h(FlowStatusTag, {
  flowInstance: record.flowInstance ?? null,
  loading: record.flowLoading ?? false,
  error: record.flowError ?? null,
})
```
