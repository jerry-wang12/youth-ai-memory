# DetailModal 组件使用指南

## 概述

DetailModal 是一个通用的详情展示弹窗组件，采用现代化的表单式布局设计，具有高信息密度和优雅的视觉效果。

## 设计原则

### 1. 表单式布局

- 参考现代化表单设计，采用标签-值对的结构
- 使用网格布局提高空间利用率
- 支持字段分组，逻辑清晰

### 2. 高信息密度

- 桌面端使用3列网格布局
- 移动端自适应为单列布局
- 合理的间距设计，避免视觉拥挤

### 3. 视觉层次

- 标签：13px，中等权重，灰色 (`--muted-foreground`)
- 值：15px，常规权重，前景色 (`--foreground`)
- 特殊标签：胶囊形状，主题色背景

## 组件结构

### 基本用法

```vue
<DetailModal
  v-model:visible="detailModalVisible"
  :header="detailHeader"
  :loading="detailLoading"
  layout="flat"
  width="900px"
>
  <template #content>
    <div class="detail-form-container">
      <!-- 内容区域 -->
    </div>
  </template>
</DetailModal>
```

### Header 配置

```typescript
const detailHeader = computed<DetailHeader>(() => ({
  title: '主标题',
  subtitle: '副标题 · 额外信息',
  createdAt: '2024-01-01 10:00:00',
  updatedAt: '2024-01-01 12:00:00',
}));
```

## 内容布局模式

### 1. 基本信息字段（3列网格）

```vue
<div class="detail-field-group">
  <div class="detail-field">
    <label class="detail-field-label">字段标签</label>
    <div class="detail-field-value">字段值</div>
  </div>
  <!-- 更多字段... -->
</div>
```

### 2. 长文本字段（全宽）

```vue
<div class="detail-field-group">
  <div class="detail-field detail-field-full">
    <label class="detail-field-label">详细描述</label>
    <div class="detail-field-value detail-field-text">
      {{ longTextContent }}
    </div>
  </div>
</div>
```

### 3. 标签样式字段

```vue
<div class="detail-field">
  <label class="detail-field-label">类型</label>
  <div class="detail-field-value">
    <span class="detail-tag">标签内容</span>
  </div>
</div>
```

### 4. 图片附件

```vue
<div class="detail-field-group">
  <div class="detail-field detail-field-full">
    <label class="detail-field-label">附件图片</label>
    <div class="detail-field-value">
      <img
        :src="imageUrl"
        alt="图片描述"
        class="detail-attachment-image"
      />
    </div>
  </div>
</div>
```

## 样式类说明

### 容器类

- `.detail-form-container`: 主容器，白色背景，24px内边距
- `.detail-field-group`: 字段组，网格布局，24px间距，底部边框分隔

### 字段类

- `.detail-field`: 单个字段容器，纵向布局，8px间距
- `.detail-field-full`: 占满整行的字段（grid-column: 1 / -1）
- `.detail-field-label`: 字段标签样式（13px，大写，灰色）
- `.detail-field-value`: 字段值容器（15px，前景色）
- `.detail-field-text`: 长文本样式（行高1.8）

### 特殊元素

- `.detail-tag`: 胶囊标签，主题色背景（4px 12px padding，圆角6px）
- `.detail-attachment-image`: 图片样式，悬停放大效果

## 完整样式代码

### 详情页面必需的样式

在使用 DetailModal 的页面中，需要添加以下样式：

```vue
<style scoped>
/* 详情表单容器 */
.detail-form-container {
  padding: 24px;
}

/* 字段组 */
.detail-field-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid hsl(var(--border));
}

.detail-field-group:last-child {
  border-bottom: none;
}

/* 字段项 */
.detail-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-field-full {
  grid-column: 1 / -1;
}

/* 字段标签 */
.detail-field-label {
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 字段值 */
.detail-field-value {
  font-size: 15px;
  line-height: 1.6;
  color: hsl(var(--foreground));
}

.detail-field-text {
  line-height: 1.8;
}

/* 标签样式 */
.detail-tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 13px;
  color: hsl(var(--primary));
  background: hsl(var(--primary) / 10%);
  border-radius: 6px;
}
</style>
```

### 使用示例

```vue
<DetailModal v-model:visible="visible" :header="detailHeader">
  <template #content>
    <div class="detail-form-container">
      <!-- 第一组字段 -->
      <div class="detail-field-group">
        <div class="detail-field">
          <label class="detail-field-label">字段名</label>
          <div class="detail-field-value">字段值</div>
        </div>
        <div class="detail-field">
          <label class="detail-field-label">状态</label>
          <div class="detail-field-value">
            <span class="detail-tag">已发布</span>
          </div>
        </div>
      </div>

      <!-- 第二组字段（完整宽度） -->
      <div class="detail-field-group">
        <div class="detail-field detail-field-full">
          <label class="detail-field-label">详细说明</label>
          <div class="detail-field-value detail-field-text">
            这里是较长的文本内容...
          </div>
        </div>
      </div>
    </div>
  </template>
</DetailModal>
```

## 响应式设计

### 桌面端（>768px）

- 3列网格布局
- 32px容器内边距
- 24px字段间距

### 平板端（≤768px）

- 单列布局
- 20px容器内边距
- 16px字段间距

### 手机端（≤480px）

- 进一步优化间距
- 16px容器内边距
- 12px字段间距

## 设计要点

### ✅ 推荐做法

1. **合理分组**：将相关字段放在同一个 `detail-field-group` 中
2. **标签一致性**：使用简洁明确的标签名称
3. **长文本处理**：超过一行的内容使用 `detail-field-full` 和 `detail-field-text`
4. **图片优化**：大图片使用 `detail-attachment-image` 类
5. **标签使用**：状态、类型等信息使用 `detail-tag` 突出显示

### ❌ 避免做法

1. **过度装饰**：不要给长文本字段添加边框和背景
2. **信息冗余**：避免在同一组内重复显示相同类型的信息
3. **布局混乱**：保持字段在组内的对齐方式一致
4. **颜色滥用**：标签颜色应该有语义区分

## 示例实现

### 详情展示示例

参考 `apps/web-antd/src/views/work-log/index.vue` 中的工作日志详情实现，展示了完整的表单式布局应用。

### 表单提交示例

参考 `apps/web-antd/src/views/work-log/index.vue` 中的新增工作记录弹窗实现，展示了 Footer 固定操作区的完整应用：

- 使用 `#footer` 插槽放置提交和取消按钮
- 通过 `defineExpose` 暴露子组件方法和状态
- Footer 始终固定显示，提供最佳的操作体验

## 扩展功能

### Tab 布局支持

组件支持多Tab展示模式，适用于内容复杂的详情页面：

```vue
<DetailModal layout="tabs" :tabs="tabList" v-model:activeTab="currentTab">
  <template #tab-basic>基本信息内容</template>
  <template #tab-detail>详细信息内容</template>
</DetailModal>
```

### 自定义头部

可以在header中添加额外的操作按钮或信息：

```typescript
const detailHeader = computed<DetailHeader>(() => ({
  title: '详情标题',
  subtitle: '副标题',
  extra: h(Button, { type: 'primary' }, '编辑'),
}));
```

### Footer 固定操作区

DetailModal 支持 footer 插槽，用于放置固定在底部的操作按钮，特别适用于表单提交场景：

```vue
<DetailModal
  v-model:visible="modalVisible"
  :header="modalHeader"
  layout="flat"
  width="800px"
>
  <template #content>
    <FormComponent ref="formRef" @success="handleSuccess" />
  </template>
  <template #footer>
    <div class="flex justify-end gap-3">
      <a-button @click="handleCancel">取消</a-button>
      <a-button
        :loading="formRef?.loading"
        type="primary"
        @click="handleSubmit"
      >
        {{ formRef?.loading ? '提交中...' : '提交' }}
      </a-button>
    </div>
  </template>
</DetailModal>
```

**Footer 使用场景：**

- **表单提交**：新增、编辑表单的提交和取消操作
- **批量操作**：多选数据的批量处理按钮
- **流程操作**：审批、确认等流程性操作

**Footer 设计要点：**

- Footer 始终固定在弹窗底部，不会因内容滚动而隐藏
- 按钮通常右对齐，主要操作在右侧
- 支持 loading 状态和禁用状态
- 可以通过子组件的 `defineExpose` 暴露状态和方法给父组件使用

**完整表单示例：**

```vue
<!-- 父组件 -->
<script setup>
const formRef = ref();
const modalVisible = ref(false);

const handleSubmit = async () => {
  if (formRef.value) {
    await formRef.value.onFinish();
  }
};

const handleCancel = () => {
  modalVisible.value = false;
};
</script>

<!-- 子组件需要暴露方法 -->
<script setup>
// 在表单组件中
defineExpose({
  onFinish,
  loading,
});
</script>
```

## 滚动和背景色

### 内部滚动

DetailModal 组件内置了优雅的内部滚动功能：

- **自动滚动条**：当内容超出容器高度时自动显示滚动条
- **自定义样式**：滚动条使用主题色，宽度为6px（移动端3px）
- **平滑滚动**：支持平滑滚动效果
- **移动优化**：iOS设备上支持弹性滚动

### 背景色统一

DetailModal 使用统一的背景色方案：

- **主背景**：`hsl(var(--card))` - 确保与表单内容背景一致
- **表单容器**：`detail-form-container` 也使用相同的 `--card` 背景色
- **无缝融合**：滚动区域与内容区域背景完全一致

### 最佳实践

```vue
<!-- 正确的使用方式 -->
<DetailModal v-model:visible="visible" :header="header" width="900px">
  <template #content>
    <div class="detail-form-container">
      <!-- 表单内容，支持自动滚动 -->
      <div class="detail-field-group">
        <!-- 字段内容 -->
      </div>
    </div>
  </template>
</DetailModal>
```

```css
/* 正确的容器样式 - 不要设置 min-height: 100% */
.detail-form-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px;
  background: hsl(var(--card));
  /* 注意：不要设置 min-height: 100%，这会阻止滚动 */
}
```

**注意事项：**

- 无需手动设置容器高度或overflow属性
- DetailModal会自动处理滚动区域的高度计算
- 表单内容可以任意长度，滚动条会在需要时自动出现

## 样式模板

将以下样式复制到您的Vue组件的 `<style scoped>` 标签中：

```css
/* 响应式设计 */
@media (max-width: 768px) {
  .detail-form-container {
    gap: 24px;
    padding: 20px;
  }

  .detail-field-group {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* 详情表单容器 */
.detail-form-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px;
  background: hsl(var(--card));
}

/* 字段组容器 - 2列网格布局 */
.detail-field-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  align-items: start;
}

/* 单个字段容器 */
.detail-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 占满整行的字段 */
.detail-field-full {
  grid-column: 1 / -1;
}

/* 字段标签样式 */
.detail-field-label {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  color: hsl(var(--muted-foreground));
  letter-spacing: 0.5px;
}

/* 字段值容器 */
.detail-field-value {
  display: flex;
  align-items: center;
  min-height: 22px;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
  color: hsl(var(--foreground));
}

/* 长文本字段值 */
.detail-field-text {
  align-items: flex-start;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
```

### 可选：区块标题样式

如果需要添加醒目的区块标题（如"工作经历"），可以添加以下样式：

```css
.work-experience-title {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: linear-gradient(
    135deg,
    hsl(var(--primary) / 8%) 0%,
    hsl(var(--primary) / 4%) 100%
  );
  border-left: 4px solid hsl(var(--primary));
  border-radius: 8px;
}

.work-experience-icon {
  font-size: 20px;
  color: hsl(var(--primary));
}

.work-experience-text {
  font-size: 16px;
  font-weight: 600;
  color: hsl(var(--foreground));
  letter-spacing: 0.3px;
}
```

使用示例：

```vue
<div class="work-experience-title">
  <MdiBriefcase class="work-experience-icon" />
  <span class="work-experience-text">工作经历</span>
</div>
```

---

遵循本指南可以确保DetailModal组件的一致性使用和最佳的用户体验。
