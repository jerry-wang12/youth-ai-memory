# 组件库

本目录包含可复用的 Vue 组件，所有组件都使用 TypeScript 编写，提供完整的类型定义。

## 组件列表

### TableLayout

完整的表格布局组件，集成了表头、内容和分页功能。

**主要特性：**

- 🔍 搜索功能
- 🎛️ 高级筛选
- ⚡ 快速筛选
- 📊 表格展示
- 📄 分页功能
- 🎨 自定义操作按钮

**使用示例：**

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

const filterFields: FilterField[] = [
  {
    key: 'status',
    type: 'select',
    label: '状态',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
];

const actionButtons: ActionButton[] = [
  {
    text: '新增',
    type: 'primary',
    onClick: () => console.log('新增'),
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
      :total="total"
      title="数据列表"
    />
  </div>
</template>
```

**Props：**

- `title`: 页面标题
- `columns`: 表格列配置
- `dataSource`: 表格数据
- `filterFields`: 筛选字段配置
- `actionButtons`: 操作按钮配置
- `quickFilters`: 快速筛选配置
- `total`: 总数据量
- 更多 props 请查看组件源码

**Events：**

- `@search`: 搜索事件
- `@filter`: 筛选事件
- `@refresh`: 刷新事件
- `@reset`: 重置事件
- `@page-change`: 分页变更事件
- 更多事件请查看组件源码

**详细文档：** [`../docs/table-generation-guide.md`](../docs/table-generation-guide.md)

### DetailModal

通用的详情展示弹窗组件，采用现代化的表单式布局设计。

**主要特性：**

- ✨ 表单式布局，高信息密度
- 📑 支持 flat 和 tabs 两种布局模式
- 🎨 优雅的视觉设计
- 📱 响应式设计
- 🎯 自定义 Footer 支持

**使用示例：**

```vue
<script setup lang="ts">
import { DetailModal } from '@/components/DetailModal';
import type { DetailHeader } from '@/components/DetailModal';

const visible = ref(false);
const header: DetailHeader = {
  title: '详情标题',
  subtitle: '副标题信息',
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
            <label class="detail-field-label">字段名</label>
            <div class="detail-field-value">字段值</div>
          </div>
        </div>
      </div>
    </template>
  </DetailModal>
</template>
```

**Props：**

- `visible`: 是否显示弹窗
- `header`: 头部配置
- `layout`: 布局模式（'flat' | 'tabs'）
- `tabs`: Tab 配置（layout 为 'tabs' 时使用）
- `width`: 弹窗宽度
- `loading`: 加载状态

**Slots：**

- `#content`: 内容区域（flat 布局）
- `#tab-{key}`: Tab 内容（tabs 布局）
- `#footer`: 底部操作区

**详细文档：** [`../docs/detail-modal-guide.md`](../docs/detail-modal-guide.md)

### CustomTag

自定义标签组件，支持图标、颜色自定义和删除功能。

**主要特性：**

- 🎨 支持自定义颜色
- 🖼️ 支持自定义图标
- ✖️ 可选的删除功能
- 🏷️ 系统标签/自定义标签区分
- ⚡ 流畅的动画效果

**使用示例：**

```vue
<script setup lang="ts">
import { CustomTag } from '@/components/CustomTag';
import MdiFlag from '~icons/mdi/flag';

const handleClose = (id: string) => {
  console.log('删除标签:', id);
};
</script>

<template>
  <CustomTag
    id="tag-1"
    name="重要"
    type="CUSTOM"
    color="#FF0000"
    :icon-component="MdiFlag"
    :closable="true"
    @close="handleClose"
  />
</template>
```

**Props：**

- `id`: 标签 ID
- `name`: 标签名称
- `type`: 标签类型（'CUSTOM' | 'SYS'）
- `color`: 标签颜色
- `iconComponent`: 图标组件
- `closable`: 是否可删除
- `disabled`: 是否禁用

**Events：**

- `@close`: 删除事件
- `@click`: 点击事件

### RichEditor

富文本编辑器组件，基于 Quill 实现，提供完整的富文本编辑功能。

**主要特性：**

- ✍️ 基于 Quill 富文本编辑器
- 📝 完整的工具栏功能（标题、加粗、列表、链接等）
- 🎨 自定义占位符
- 🔗 双向数据绑定（v-model）
- 💾 HTML 格式输出
- 🎯 类型安全的 TypeScript 支持

**依赖安装：**

```bash
# 安装 Quill
pnpm add quill

# 安装类型定义（可选）
pnpm add -D @types/quill
```

**Vite 配置要求：**

在 `vite.config.ts` 中添加以下配置：

```typescript
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

**详细配置说明：** [`../config/vite-quill-config.md`](../config/vite-quill-config.md)

**public 目录结构：**

确保项目的 `public/plugins/quill/` 目录下包含以下文件：

```
public/
└── plugins/
    └── quill/
        ├── quill.js
        ├── quill.snow.css
        ├── quill.bubble.css
        └── quill.core.css
```

**使用示例：**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RichEditor } from '@/components/RichEditor';

const content = ref('<p>初始内容</p>');

const handleSave = () => {
  console.log('保存内容:', content.value);
};
</script>

<template>
  <div>
    <RichEditor
      v-model="content"
      placeholder="请输入文章内容..."
    />
    <button @click="handleSave">保存</button>
  </div>
</template>
```

**Props：**

- `modelValue`: 内容（HTML 格式字符串）
- `placeholder`: 占位符文本（默认：'请输入内容…'）

**Events：**

- `@update:modelValue`: 内容更新事件，参数为 HTML 字符串

## 组件子组件

### TableHeader

表格头部组件，包含搜索、筛选和操作按钮。

**主要功能：**

- 搜索框
- 高级筛选
- 快速筛选
- 操作按钮
- 统计信息

### TableContent

表格内容组件，基于 Ant Design Vue Table 封装。

**主要功能：**

- 数据展示
- 自定义列
- 行点击事件
- 选择功能

### TablePagination

分页组件，提供完整的分页功能。

**主要功能：**

- 页码切换
- 每页条数切换
- 快速跳转
- 总数显示

## 使用指南

### 1. 导入组件

```typescript
// 导入单个组件
import { TableLayout } from '@/components/TableLayout';
import { DetailModal } from '@/components/DetailModal';
import { CustomTag } from '@/components/CustomTag';
import { RichEditor } from '@/components/RichEditor';

// 导入类型
import type { TableLayoutProps } from '@/components/TableLayout';
import type { DetailHeader, DetailTab } from '@/components/DetailModal';
import type { CustomTagProps } from '@/components/CustomTag';
import type { RichEditorProps } from '@/components/RichEditor';
```

### 2. 使用组件

所有组件都支持 v-bind 和 v-model：

```vue
<template>
  <TableLayout v-bind="tableConfig" @search="handleSearch" />
  <DetailModal v-model:visible="visible" :header="header" />
</template>
```

### 3. 自定义样式

使用 Tailwind CSS 或 scoped 样式：

```vue
<template>
  <TableLayout class="custom-table" />
</template>

<style scoped>
.custom-table :deep(.ant-table-thead) {
  background: #f0f0f0;
}
</style>
```

### 4. 插槽使用

大部分组件都提供插槽用于自定义内容：

```vue
<template>
  <TableLayout>
    <template #bodyCell="{ column, record }">
      <span v-if="column.key === 'custom'">
        {{ record.customField }}
      </span>
    </template>
  </TableLayout>
</template>
```

## 类型定义

所有组件都提供完整的 TypeScript 类型定义，导入方式：

```typescript
// TableLayout 类型
import type {
  TableLayoutProps,
  ActionButton,
  FilterField,
  QuickFilter,
  QuickFilterConfig,
  StatisticItem,
} from '@/components/TableLayout';

// DetailModal 类型
import type { DetailHeader, DetailTab } from '@/components/DetailModal';

// CustomTag 类型
import type { CustomTagProps } from '@/components/CustomTag';

// RichEditor 类型
import type { RichEditorProps } from '@/components/RichEditor';
```

## 注意事项

### 1. 根容器要求

使用 TableLayout 时必须添加根容器元素：

```vue
<!-- ✅ 正确 -->
<template>
  <div class="page-container">
    <TableLayout />
  </div>
</template>

<!-- ❌ 错误 -->
<template>
  <TableLayout />
</template>
```

### 2. 图标导入

模板中的图标是占位符，需要替换为实际的图标组件：

```typescript
// 替换前
import { MdiMagnify } from '../icons/placeholder';

// 替换后
import MdiMagnify from '~icons/mdi/magnify';
```

### 3. CSS 变量

组件使用了 CSS 变量，确保在全局样式中定义：

```css
:root {
  --primary: 217 91% 60%;
  --foreground: 222 47% 11%;
  --background: 0 0% 100%;
  --muted: 210 40% 96%;
  --border: 214 32% 91%;
  --card: 0 0% 100%;
  --destructive: 0 84% 60%;
}
```

## 最佳实践

1. **组件复用**：尽可能使用提供的组件，而不是从零开始
2. **类型安全**：充分利用 TypeScript 类型系统
3. **样式一致**：使用 Tailwind CSS 保持样式一致性
4. **性能优化**：合理使用 computed 和 watch
5. **文档查阅**：遇到问题先查阅详细文档

## 扩展组件

如需添加新组件，请遵循以下规范：

1. 使用 TypeScript 编写
2. 提供完整的类型定义
3. 使用 Composition API
4. 添加详细的注释
5. 遵循现有的代码风格
6. 更新本文档

## 相关文档

- [表格生成指南](../docs/table-generation-guide.md)
- [详情弹窗指南](../docs/detail-modal-guide.md)
- [开发规范](../docs/development-guide.md)
- [迁移指南](../docs/migration-guide.md)
