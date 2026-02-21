# 审批/流程 示例

## FlowStatusTag 表格列

```typescript
customRender: ({ record }) => h(FlowStatusTag, {
  flowInstance: record.flowInstance ?? null,
  loading: record.flowLoading ?? false,
  error: record.flowError ?? null,
})
```

## UniversalUpload 注入上传

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post('/upload', formData, { headers: { 'Content-Type': undefined } });
  return res;
};
const downloadTemplate = () => fetch('/api/template.xlsx').then(r => r.blob());
```
