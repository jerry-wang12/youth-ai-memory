# DetailModal 示例

## 纯详情展示

```vue
<DetailModal v-model:visible="visible" :header="header" width="900px">
  <template #content>
    <div class="detail-form-container">
      <div class="detail-field-group">
        <div class="detail-field">
          <label class="detail-field-label">姓名</label>
          <div class="detail-field-value">{{ detail.name }}</div>
        </div>
        <div class="detail-field">
          <label class="detail-field-label">状态</label>
          <div class="detail-field-value">
            <span class="detail-tag">{{ detail.statusName }}</span>
          </div>
        </div>
      </div>
      <div class="detail-field-group">
        <div class="detail-field detail-field-full">
          <label class="detail-field-label">描述</label>
          <div class="detail-field-value detail-field-text">{{ detail.description }}</div>
        </div>
      </div>
    </div>
  </template>
</DetailModal>
```

## 带 Footer 的表单提交

```vue
<DetailModal v-model:visible="visible" :header="header">
  <template #content>
    <FormComponent ref="formRef" @success="handleSuccess" />
  </template>
  <template #footer>
    <div class="flex justify-end gap-3">
      <a-button @click="visible = false">取消</a-button>
      <a-button :loading="formRef?.loading" type="primary" @click="handleSubmit">提交</a-button>
    </div>
  </template>
</DetailModal>
```

```typescript
const handleSubmit = async () => {
  if (formRef.value) await formRef.value.onFinish();
};
```

FormComponent 内部需：`defineExpose({ onFinish, loading });`
