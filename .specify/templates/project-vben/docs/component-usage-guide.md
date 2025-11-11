# 组件使用指南

本指南详细介绍模板中所有组件的使用方法和最佳实践。

## 目录

- [图标使用指南](#图标使用指南)
- [TableLayout 组件](#tablelayout-组件)
- [DetailModal 组件](#detailmodal-组件)
- [CustomTag 组件](#customtag-组件)
- [RichEditor 组件](#richeditor-组件)
- [通用最佳实践](#通用最佳实践)

## 图标使用指南

### 概述

项目使用 Iconify 图标系统，通过 `createIconifyIcon` 创建图标组件。所有图标统一在 `src/icons/index.ts` 中管理。

### 使用图标

```vue
<script setup lang="ts">
import { MdiMagnify, MdiPlus, MdiDelete } from '#/icons';
</script>

<template>
  <Button>
    <MdiPlus />
    新增
  </Button>
  <Button>
    <MdiMagnify />
    搜索
  </Button>
  <Button danger>
    <MdiDelete />
    删除
  </Button>
</template>
```

### 添加新图标

1. **查找图标**

   访问 https://icon-sets.iconify.design/ 搜索需要的图标。

   推荐图标集：
   - `mdi`: Material Design Icons（最全面，推荐）
   - `lucide`: Lucide Icons（简洁美观）
   - `carbon`: Carbon Icons（IBM设计）
   - `heroicons`: Heroicons（Tailwind官方）

2. **在 `src/icons/index.ts` 中添加**

   ```typescript
   import { createIconifyIcon } from '@vben/icons';
   
   /** 新图标说明 */
   export const MdiIconName = createIconifyIcon('mdi:icon-name');
   ```

3. **在组件中使用**

   ```vue
   <script setup lang="ts">
   import { MdiIconName } from '#/icons';
   </script>

   <template>
     <MdiIconName />
   </template>
   ```

### 命名规范

- **格式**: `{IconSet}{IconName}`
- **风格**: PascalCase
- **示例**:
  - `MdiMagnify` - Material Design Icons 搜索图标
  - `LucideSearch` - Lucide 搜索图标
  - `CarbonView` - Carbon 查看图标

### 常用图标

```typescript
// 通用操作
import {
  MdiMagnify,      // 搜索
  MdiRefresh,      // 刷新
  MdiClose,        // 关闭
  MdiFilter,       // 筛选
} from '#/icons';

// 数据操作
import {
  MdiPlus,         // 新增
  MdiPencil,       // 编辑
  MdiDelete,       // 删除
  MdiEye,          // 查看
  MdiExport,       // 导出
  MdiImport,       // 导入
} from '#/icons';

// 状态提示
import {
  MdiCheck,        // 成功
  MdiAlert,        // 警告
  MdiInformation,  // 信息
  MdiCloseCircle,  // 错误
} from '#/icons';

// 导航
import {
  MdiHome,         // 首页
  MdiMenu,         // 菜单
  MdiArrowLeft,    // 返回
  MdiArrowRight,   // 前进
} from '#/icons';
```

### 最佳实践

1. **优先使用 outline 风格**

   ```typescript
   // ✅ 推荐
   export const MdiAccount = createIconifyIcon('mdi:account-outline');
   
   // ❌ 避免
   export const MdiAccount = createIconifyIcon('mdi:account');
   ```

2. **添加 JSDoc 注释**

   ```typescript
   /** 搜索图标 */
   export const MdiMagnify = createIconifyIcon('mdi:magnify');
   
   /** 用户账户 */
   export const MdiAccount = createIconifyIcon('mdi:account-outline');
   ```

3. **按功能分组**

   ```typescript
   // ==================== 通用图标 ====================
   export const MdiMagnify = createIconifyIcon('mdi:magnify');
   
   // ==================== 操作图标 ====================
   export const MdiPlus = createIconifyIcon('mdi:plus');
   ```

4. **统一导入路径**

   ```typescript
   // ✅ 正确
   import { MdiMagnify } from '#/icons';
   
   // ❌ 错误
   import { MdiMagnify } from '@vben/icons';
   import MdiMagnify from '~icons/mdi/magnify';
   ```

### 图标大小和颜色

图标组件会继承父元素的字体大小和颜色：

```vue
<template>
  <!-- 通过 class 控制大小和颜色 -->
  <MdiMagnify class="text-lg text-blue-500" />
  
  <!-- 通过 style 控制 -->
  <MdiMagnify style="font-size: 20px; color: hsl(var(--primary))" />
  
  <!-- 继承父元素样式 -->
  <div class="text-2xl text-red-500">
    <MdiDelete />
  </div>
</template>
```

### ActionButton 中使用图标

在 TableLayout 的 actionButtons 中使用：

```typescript
import { MdiPlus } from '#/icons';

const actionButtons: ActionButton[] = [
  {
    text: '新增',
    icon: MdiPlus,
    type: 'primary',
    onClick: () => handleCreate(),
  },
];
```

### 详情样式

使用 DetailModal 时，需要在页面组件中添加详情字段的样式。

**完整样式代码请查看**: `.specify/templates/project/docs/detail-modal-guide.md` 中的"完整样式代码"章节

基本使用：

```vue
<template>
  <DetailModal v-model:visible="visible" :header="detailHeader">
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
</template>

<style scoped>
/* 复制完整样式代码到这里 */
/* 详见：.specify/templates/project/docs/detail-modal-guide.md */
</style>
```

## TableLayout 组件

TableLayout 是一个完整的表格布局组件，集成了搜索、筛选、表格展示和分页功能。

### 基本用法

```vue
<script setup lang="ts">
import { TableLayout } from '@/components/TableLayout';
import type {
  ActionButton,
  FilterField,
} from '@/components/TableLayout/TableHeader';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '名称', dataIndex: 'name', key: 'name' },
];

const dataSource = ref([]);
const total = ref(0);
const searchForm = reactive({
  keyword: '',
  page: 1,
  size: 10,
});
</script>

<template>
  <div class="page-container">
    <TableLayout
      :columns="columns"
      :data-source="dataSource"
      :total="total"
      :current="searchForm.page"
      :page-size="searchForm.size"
      title="数据列表"
    />
  </div>
</template>
```

### 完整配置示例

```vue
<script setup lang="ts">
// 筛选字段配置
const filterFields: FilterField[] = [
  {
    key: 'status',
    type: 'select',
    label: '状态',
    placeholder: '选择状态',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
  {
    key: 'dateRange',
    type: 'rangePicker',
    label: '创建时间',
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
  },
];

// 操作按钮配置
const actionButtons: ActionButton[] = [
  {
    text: '新增',
    icon: MdiPlus,
    type: 'primary',
    onClick: () => console.log('新增'),
  },
  {
    text: '导出',
    icon: MdiDownload,
    onClick: () => console.log('导出'),
  },
];

// 快速筛选配置
const quickFilters = [
  {
    key: 'all',
    label: '全部',
    count: 100,
  },
  {
    key: 'active',
    label: '启用',
    count: 80,
  },
];
</script>

<template>
  <div class="page-container">
    <TableLayout
      :columns="columns"
      :data-source="dataSource"
      :filter-fields="filterFields"
      :action-buttons="actionButtons"
      :quick-filters="quickFilters"
      :active-quick-filter="activeFilter"
      :total="total"
      title="完整示例"
      @search="handleSearch"
      @filter="handleFilter"
      @quick-filter="handleQuickFilter"
      @page-change="handlePageChange"
    />
  </div>
</template>
```

### Props 详解

| Prop                | 类型               | 默认值      | 说明           |
| ------------------- | ------------------ | ----------- | -------------- |
| `title`             | `string`           | -           | 页面标题       |
| `columns`           | `TableColumnsType` | -           | 表格列配置     |
| `dataSource`        | `any[]`            | -           | 表格数据       |
| `loading`           | `boolean`          | `false`     | 加载状态       |
| `showSearch`        | `boolean`          | `true`      | 是否显示搜索框 |
| `searchPlaceholder` | `string`           | `'搜索...'` | 搜索框占位符   |
| `filterFields`      | `FilterField[]`    | `[]`        | 筛选字段配置   |
| `actionButtons`     | `ActionButton[]`   | `[]`        | 操作按钮配置   |
| `quickFilters`      | `QuickFilter[]`    | `[]`        | 快速筛选配置   |
| `total`             | `number`           | `0`         | 总数据量       |
| `current`           | `number`           | `1`         | 当前页码       |
| `pageSize`          | `number`           | `10`        | 每页条数       |

### Events 详解

| Event           | 参数                               | 说明         |
| --------------- | ---------------------------------- | ------------ |
| `@search`       | `(keyword: string)`                | 搜索事件     |
| `@filter`       | `(values: Record<string, any>)`    | 筛选事件     |
| `@quick-filter` | `(key: string)`                    | 快速筛选事件 |
| `@refresh`      | `()`                               | 刷新事件     |
| `@reset`        | `()`                               | 重置事件     |
| `@page-change`  | `(page: number, pageSize: number)` | 分页变更     |

### 自定义列内容

使用 `bodyCell` 插槽自定义列内容：

```vue
<template>
  <TableLayout :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, record, index }">
      <!-- 状态列 -->
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'active' ? 'green' : 'red'">
          {{ record.status }}
        </a-tag>
      </template>

      <!-- 操作列 -->
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button size="small" @click="handleEdit(record)">编辑</a-button>
          <a-button size="small" danger @click="handleDelete(record.id)">
            删除
          </a-button>
        </a-space>
      </template>
    </template>
  </TableLayout>
</template>
```

### 快速筛选

快速筛选支持两种样式：小卡片和大卡片。

**小卡片样式（默认）：**

```typescript
const quickFilterConfig = {
  showCount: true,
  size: 'small',
  showTitle: true,
};
```

**大卡片样式（数据统计）：**

```typescript
const quickFilterConfig = {
  showCount: true,
  size: 'large',
  showTitle: false,
};

const quickFilters = [
  {
    key: 'all',
    label: '全部',
    count: 1000,
    color: 'default',
  },
  {
    key: 'urgent',
    label: '紧急',
    count: 50,
    color: 'red',
  },
];
```

## DetailModal 组件

DetailModal 是一个通用的详情展示弹窗组件，支持平铺和标签页两种布局。

### 基本用法

```vue
<script setup lang="ts">
import { DetailModal } from '@/components/DetailModal';
import type { DetailHeader } from '@/components/DetailModal';

const visible = ref(false);
const header: DetailHeader = {
  title: '用户详情',
  subtitle: '查看用户的详细信息',
  createdAt: '2024-01-01 10:00:00',
  updatedAt: '2024-01-01 12:00:00',
};
</script>

<template>
  <DetailModal
    v-model:visible="visible"
    :header="header"
    layout="flat"
    width="900px"
  >
    <template #content>
      <div class="detail-form-container">
        <div class="detail-field-group">
          <div class="detail-field">
            <label class="detail-field-label">姓名</label>
            <div class="detail-field-value">张三</div>
          </div>
          <div class="detail-field">
            <label class="detail-field-label">性别</label>
            <div class="detail-field-value">男</div>
          </div>
        </div>
      </div>
    </template>
  </DetailModal>
</template>
```

### Tabs 布局

```vue
<script setup>
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'detail', label: '详细信息' },
];
</script>

<template>
  <DetailModal
    v-model:visible="visible"
    :header="header"
    :tabs="tabs"
    layout="tabs"
  >
    <template #tab-basic>
      <!-- 基本信息内容 -->
    </template>
    <template #tab-detail>
      <!-- 详细信息内容 -->
    </template>
  </DetailModal>
</template>
```

### Footer 操作区

DetailModal 支持 footer 插槽，用于放置固定在底部的操作按钮：

```vue
<script setup>
const formRef = ref();

const handleSubmit = async () => {
  if (formRef.value) {
    await formRef.value.onFinish();
  }
};
</script>

<template>
  <DetailModal v-model:visible="visible" :header="header">
    <template #content>
      <FormComponent ref="formRef" @success="handleSuccess" />
    </template>
    <template #footer>
      <div class="flex justify-end gap-3">
        <a-button @click="visible = false">取消</a-button>
        <a-button
          :loading="formRef?.loading"
          type="primary"
          @click="handleSubmit"
        >
          提交
        </a-button>
      </div>
    </template>
  </DetailModal>
</template>
```

### 样式类说明

**容器类：**

- `.detail-form-container`: 主容器，32px 内边距
- `.detail-field-group`: 字段组，3列网格布局

**字段类：**

- `.detail-field`: 单个字段容器
- `.detail-field-full`: 占满整行的字段
- `.detail-field-label`: 字段标签
- `.detail-field-value`: 字段值
- `.detail-field-text`: 长文本样式

**特殊元素：**

- `.detail-tag`: 胶囊标签
- `.detail-attachment-image`: 图片样式

### 响应式布局

DetailModal 自动适配不同屏幕尺寸：

- **桌面端（> 768px）**：3列网格
- **平板端（≤ 768px）**：单列布局
- **移动端（≤ 480px）**：优化间距

## CustomTag 组件

CustomTag 是一个自定义标签组件，支持图标、颜色和删除功能。

### 基本用法

```vue
<script setup>
import { CustomTag } from '@/components/CustomTag';
import MdiFlag from '~icons/mdi/flag';
</script>

<template>
  <CustomTag
    id="tag-1"
    name="重要"
    type="CUSTOM"
    color="#FF0000"
    :icon-component="MdiFlag"
  />
</template>
```

### 可删除标签

```vue
<script setup>
const handleClose = (id: string) => {
  console.log('删除标签:', id);
  // 删除逻辑
};
</script>

<template>
  <CustomTag id="tag-1" name="临时标签" :closable="true" @close="handleClose" />
</template>
```

### 系统标签

系统标签不可删除：

```vue
<template>
  <CustomTag id="sys-1" name="系统标签" type="SYS" :closable="false" />
</template>
```

### Props 详解

| Prop            | 类型                | 默认值      | 说明       |
| --------------- | ------------------- | ----------- | ---------- |
| `id`            | `string \| number`  | -           | 标签 ID    |
| `name`          | `string`            | -           | 标签名称   |
| `type`          | `'CUSTOM' \| 'SYS'` | `'CUSTOM'`  | 标签类型   |
| `color`         | `string`            | `'#0066FF'` | 标签颜色   |
| `iconComponent` | `Component`         | -           | 图标组件   |
| `closable`      | `boolean`           | `false`     | 是否可删除 |
| `disabled`      | `boolean`           | `false`     | 是否禁用   |

### Events 详解

| Event    | 参数                      | 说明     |
| -------- | ------------------------- | -------- |
| `@close` | `(id?: string \| number)` | 删除事件 |
| `@click` | `(id?: string \| number)` | 点击事件 |

## RichEditor 组件

RichEditor 是一个基于 Quill 的富文本编辑器组件，提供完整的富文本编辑功能。

### 前置准备

#### 1. 安装依赖

```bash
# 安装 Quill
pnpm add quill

# 安装类型定义（可选）
pnpm add -D @types/quill
```

#### 2. 配置 Vite

在 `vite.config.ts` 中添加以下配置：

```typescript
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Fix quill ESM interop: 确保 imports 解析到完整构建版本
      quill$: 'quill/dist/quill.js',
    },
  },
  optimizeDeps: {
    include: ['quill'],
  },
});
```

**详细配置说明：** 查看 [`../config/vite-quill-config.md`](../config/vite-quill-config.md)

#### 3. 准备 Quill 文件

确保 `public/plugins/quill/` 目录下包含以下文件：

```
public/
└── plugins/
    └── quill/
        ├── quill.js
        ├── quill.snow.css
        ├── quill.bubble.css
        └── quill.core.css
```

### 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RichEditor } from '@/components/RichEditor';

const content = ref('');
</script>

<template>
  <div>
    <RichEditor v-model="content" placeholder="请输入内容..." />
  </div>
</template>
```

### 完整示例

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { RichEditor } from '@/components/RichEditor';

const content = ref('<p>这是初始内容</p>');

// 保存内容
const handleSave = () => {
  if (!content.value || content.value === '<p><br></p>') {
    message.warning('请输入内容');
    return;
  }
  console.log('保存内容:', content.value);
  message.success('保存成功');
};

// 重置内容
const handleReset = () => {
  content.value = '';
};

// 获取纯文本（去除 HTML 标签）
const getPlainText = () => {
  const div = document.createElement('div');
  div.innerHTML = content.value;
  return div.textContent || div.innerText || '';
};
</script>

<template>
  <div class="editor-container">
    <h3>文章编辑</h3>
    <RichEditor
      v-model="content"
      placeholder="请输入文章内容..."
    />
    <div class="actions">
      <a-button @click="handleReset">重置</a-button>
      <a-button type="primary" @click="handleSave">保存</a-button>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  padding: 20px;
}

.actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
```

### 在表单中使用

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { Form } from 'ant-design-vue';
import { RichEditor } from '@/components/RichEditor';

const formState = reactive({
  title: '',
  content: '',
  category: '',
});

const rules = {
  title: [{ required: true, message: '请输入标题' }],
  content: [{ required: true, message: '请输入内容' }],
  category: [{ required: true, message: '请选择分类' }],
};

const handleSubmit = () => {
  console.log('表单数据:', formState);
};
</script>

<template>
  <a-form
    :model="formState"
    :rules="rules"
    layout="vertical"
    @finish="handleSubmit"
  >
    <a-form-item label="标题" name="title">
      <a-input v-model:value="formState.title" placeholder="请输入标题" />
    </a-form-item>

    <a-form-item label="分类" name="category">
      <a-select v-model:value="formState.category" placeholder="请选择分类">
        <a-select-option value="tech">技术</a-select-option>
        <a-select-option value="life">生活</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="内容" name="content">
      <RichEditor
        v-model="formState.content"
        placeholder="请输入文章内容..."
      />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>
```

### Props 详解

| Prop         | 类型     | 默认值       | 说明                   |
| ------------ | -------- | ------------ | ---------------------- |
| `modelValue` | `string` | `''`         | 编辑器内容（HTML 格式）|
| `placeholder`| `string` | `'请输入内容…'` | 占位符文本           |

### Events 详解

| Event              | 参数           | 说明                           |
| ------------------ | -------------- | ------------------------------ |
| `@update:modelValue` | `(value: string)` | 内容更新时触发，返回 HTML 字符串 |

### 最佳实践

#### 1. 内容验证

空内容时 Quill 会返回 `<p><br></p>`，需要特殊处理：

```typescript
// 检查内容是否为空
const isEmpty = (html: string) => {
  return !html || html === '<p><br></p>' || html.trim() === '';
};

// 使用示例
if (isEmpty(content.value)) {
  message.warning('请输入内容');
  return;
}
```

#### 2. 内容清理

提交前清理无用的 HTML 标签：

```typescript
// 清理空段落
const cleanContent = (html: string) => {
  return html
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .trim();
};
```

#### 3. 字符统计

统计纯文本字符数：

```typescript
const getTextLength = (html: string) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.length;
};

// 使用示例
const contentLength = computed(() => getTextLength(content.value));
```

#### 4. 内容预览

在详情页展示富文本内容：

```vue
<template>
  <div class="rich-content" v-html="content"></div>
</template>

<style scoped>
.rich-content {
  /* 继承 Quill 样式 */
  line-height: 1.6;
}

.rich-content :deep(h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.rich-content :deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

.rich-content :deep(ul),
.rich-content :deep(ol) {
  padding-left: 1.5em;
}
</style>
```

### 常见问题

#### Q1: 编辑器样式显示异常

**原因：** Quill 样式未正确加载。

**解决方案：**
1. 确保组件中导入了样式：`import 'quill/dist/quill.snow.css'`
2. 检查 Vite 配置是否正确
3. 清除缓存重新启动：`pnpm dev --force`

#### Q2: 无法输入中文

**原因：** Quill 版本或配置问题。

**解决方案：**
1. 使用 Quill 1.3.7 或更高版本
2. 检查是否有其他输入法相关的全局配置冲突

#### Q3: 内容过长导致性能问题

**原因：** 大量 HTML 内容导致渲染卡顿。

**解决方案：**
1. 限制编辑器内容长度
2. 使用防抖处理内容更新
3. 考虑分页或分段编辑

```typescript
import { useDebounceFn } from '@vueuse/core';

const debouncedUpdate = useDebounceFn((value: string) => {
  // 处理内容更新
  console.log('内容已更新:', value);
}, 500);
```

### 自定义工具栏

组件默认提供完整的工具栏，如需自定义，可以修改组件源码中的 `toolbar` 配置：

```typescript
modules: {
  toolbar: [
    [{ header: [1, 2, 3, false] }],         // 标题
    ['bold', 'italic', 'underline', 'strike'], // 文本样式
    [{ color: [] }, { background: [] }],     // 颜色
    [{ list: 'ordered' }, { list: 'bullet' }], // 列表
    ['blockquote', 'code-block'],            // 引用和代码
    ['link', 'image'],                       // 链接和图片
    ['clean'],                               // 清除格式
  ],
}
```

更多工具栏配置请参考 [Quill 官方文档](https://quilljs.com/docs/modules/toolbar/)。

## 通用最佳实践

### 1. 根容器

所有使用 TableLayout 的页面都必须有根容器：

```vue
<template>
  <!-- ✅ 正确 -->
  <div class="page-container">
    <TableLayout />
  </div>

  <!-- ❌ 错误 -->
  <TableLayout />
</template>
```

### 2. 响应式数据

使用 `ref` 或 `reactive` 包裹响应式数据：

```typescript
// ✅ 正确
const dataSource = ref<User[]>([]);
const searchForm = reactive({
  keyword: '',
  page: 1,
});

// ❌ 错误
let dataSource = [];
let keyword = '';
```

### 3. 类型定义

为所有数据定义类型：

```typescript
// ✅ 正确
interface User {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const users = ref<User[]>([]);

// ❌ 错误
const users = ref([]);
```

### 4. 错误处理

所有异步操作都应该有错误处理：

```typescript
// ✅ 正确
const fetchData = async () => {
  loading.value = true;
  try {
    const result = await getData();
    dataSource.value = result;
  } catch (error) {
    message.error('获取数据失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// ❌ 错误
const fetchData = async () => {
  const result = await getData();
  dataSource.value = result;
};
```

### 5. 加载状态

显示加载状态提升用户体验：

```typescript
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    // 请求数据
  } finally {
    loading.value = false; // 确保在 finally 中关闭
  }
};
```

### 6. 分页同步

搜索和筛选时重置页码：

```typescript
const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword;
  searchForm.page = 1; // ← 重要：重置页码
  fetchData();
};
```

### 7. 组件清理

组件卸载时清理资源：

```typescript
import { onUnmounted } from 'vue';

const timer = ref<number>();

onMounted(() => {
  timer.value = setInterval(() => {
    // 定时任务
  }, 1000);
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
```

### 8. 性能优化

使用 `computed` 缓存计算结果：

```typescript
// ✅ 推荐
const filteredData = computed(() => {
  return dataSource.value.filter((item) => item.active);
});

// ❌ 不推荐：在模板中直接计算
// <div v-for="item in dataSource.filter(item => item.active)">
```

## 常见问题

### Q: 表格列不显示？

A: 检查 `columns` 配置和 `dataSource` 数据格式是否匹配。

### Q: 分页不正确？

A: 确保前后端页码起始值一致，必要时进行转换。

### Q: 样式不生效？

A: 检查是否导入了 Tailwind CSS 和必要的样式文件。

### Q: 图标不显示？

A: 确保正确配置了 `unplugin-icons` 并导入了图标。

### Q: TypeScript 报错？

A: 检查类型定义和导入是否正确。

## 相关文档

- [表格生成指南](./table-generation-guide.md)
- [详情弹窗指南](./detail-modal-guide.md)
- [开发规范](./development-guide.md)
- [迁移指南](./migration-guide.md)
