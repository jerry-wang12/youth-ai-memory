---
name: vben-detailmodal-detail-view
description: Implements detail view modals using DetailModal or DetailDrawer with form-style layout, tabs, footer actions. Use when building detail dialogs, view modals, detail-form-container, DetailHeader, layout flat/tabs, or footer slot for form submit in Vue Vben / Ant Design Vue projects.
---

# DetailModal 详情展示

在 Vue Vben 项目中，使用 DetailModal / DetailDrawer 做数据详情展示。**禁止**用裸 `<a-modal>` 展示详情。

## 核心结构

1. **根内容**：`#content` 插槽内用 `detail-form-container` + `detail-field-group` + `detail-field`
2. **Header**：`DetailHeader`（title、subtitle、createdAt、updatedAt）
3. **可选**：`layout="tabs"` 做多 Tab、`#footer` 做固定底部操作

## 基本用法

```vue
<DetailModal v-model:visible="visible" :header="header" layout="flat" width="900px">
  <template #content>
    <div class="detail-form-container">
      <div class="detail-field-group">
        <div class="detail-field">
          <label class="detail-field-label">字段名</label>
          <div class="detail-field-value">字段值</div>
        </div>
      </div>
    </div>
  </template>
</DetailModal>
```

## 必需样式

页面必须包含以下样式（见 [reference.md](reference.md) 完整块）：

- `.detail-form-container`、`.detail-field-group`、`.detail-field`、`.detail-field-full`
- `.detail-field-label`、`.detail-field-value`、`.detail-field-text`
- `.detail-tag`（胶囊标签）、`.detail-attachment-image`（图片）

## Tabs 布局

```vue
<DetailModal layout="tabs" :tabs="[{ key: 'basic', label: '基本信息' }]">
  <template #tab-basic>...</template>
</DetailModal>
```

## Footer 表单提交

```vue
<template #footer>
  <div class="flex justify-end gap-3">
    <a-button @click="visible = false">取消</a-button>
    <a-button :loading="formRef?.loading" type="primary" @click="handleSubmit">提交</a-button>
  </div>
</template>
```

子表单需 `defineExpose({ onFinish, loading })`，父组件通过 `formRef.value.onFinish()` 触发提交。

## 参考

- [reference.md](reference.md) - 完整样式代码、响应式、DetailDrawer 差异
- [examples.md](examples.md) - 纯详情、带表单、Tabs 示例
