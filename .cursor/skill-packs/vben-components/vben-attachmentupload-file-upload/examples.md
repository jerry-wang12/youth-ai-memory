# AttachmentUpload 示例

## 图片卡片模式

```vue
<AttachmentUpload
  v-model="images"
  accept="image/*"
  :max-size="5"
  :max-count="6"
  list-type="picture-card"
/>
```

## 单文件按钮模式

```vue
<AttachmentUpload
  v-model="file"
  upload-mode="button"
  :multiple="false"
  :max-count="1"
  accept=".xlsx,.xls"
  :max-size="20"
/>
```

## 表单内使用

```vue
<a-form-item label="附件">
  <AttachmentUpload
    v-model="formData.attachments"
    accept="image/*,.pdf"
    :max-size="10"
    :max-count="5"
  />
</a-form-item>
```

## 编辑回显

```typescript
onMounted(async () => {
  const data = await fetchDetail(id);
  fileList.value = data.attachments ?? [];
});
```
