# 项目开发模板库

<div align="center">

**开箱即用的 Vue 3 + Ant Design Vue + TypeScript 项目模板**

包含完整的 CRUD 页面示例、可复用组件库和详细的使用文档

</div>

## 📚 概述

本模板库是从实际项目中提取的高质量代码模板和使用指南，旨在加速项目开发，确保代码质量和一致性。所有模板都基于 Vue 3 + TypeScript + Ant Design Vue 技术栈，并与 Speckit 开发工作流无缝集成。

## ✨ 主要特性

- 🚀 **Vue 3 + TypeScript** - 使用最新的 Vue 3 Composition API 和 TypeScript
- 🎨 **Ant Design Vue** - 企业级 UI 组件库
- 🎯 **Tailwind CSS** - 实用优先的 CSS 框架
- 📦 **开箱即用** - 包含完整的 CRUD 示例和最佳实践
- 🔧 **可定制** - 灵活的配置选项，易于扩展
- 📚 **文档完善** - 详细的组件使用指南和 API 文档
- 🎭 **类型安全** - 完整的类型定义和类型安全
- 🔄 **Speckit 集成** - 与 Speckit 工作流无缝配合

## 📂 模板库结构

```
.specify/templates/project/
├── README.md                   # 本文件 - 模板库总览
├── INTEGRATION.md              # Speckit 集成指南
├── components/                 # Vue 组件模板
│   ├── README.md              # 组件使用总览
│   ├── TableLayout/           # 完整的表格布局组件
│   ├── DetailModal/           # 详情弹窗组件
│   └── CustomTag/             # 自定义标签组件
├── api/                       # API 层模板
│   ├── README.md              # API 使用指南
│   └── tags.ts                # 标签管理 API 示例
├── pages/                     # 页面模板
│   ├── README.md              # 页面模板说明
│   └── tag-management/        # 标签管理页面（完整 CRUD 示例）
├── docs/                      # 详细使用指南
│   ├── table-generation-guide.md      # 表格生成指南
│   ├── detail-modal-guide.md          # 详情弹窗指南
│   ├── component-usage-guide.md       # 组件使用指南
│   ├── development-guide.md           # 开发规范
│   └── migration-guide.md             # 迁移指南
├── config/                    # 配置文档
│   ├── dependencies.json      # 依赖清单
│   ├── icons-config.md        # 图标配置
│   └── tailwind-classes.md    # Tailwind 说明
└── icons/                     # 图标占位符
    └── placeholder.ts
```

## 🎯 快速导航

### 组件模板

- **[TableLayout](./components/README.md)** - 完整的表格布局组件
  - 集成搜索、筛选、分页功能
  - 支持快速筛选和高级筛选
  - 可自定义操作按钮
  - [详细指南](./docs/table-generation-guide.md)

- **[DetailModal](./components/README.md#detailmodal)** - 详情展示弹窗
  - 表单式布局设计
  - 支持 flat 和 tabs 两种布局
  - 响应式设计
  - [详细指南](./docs/detail-modal-guide.md)

- **[CustomTag](./components/README.md#customtag)** - 自定义标签组件
  - 支持自定义颜色和图标
  - 可选的删除功能
  - 系统标签/自定义标签区分

- **[RichEditor](./components/README.md#richeditor)** - 富文本编辑器组件
  - 基于 Quill 富文本编辑器
  - 完整的工具栏功能（标题、列表、链接等）
  - TypeScript 类型支持
  - 双向数据绑定

- **[AttachmentUpload](./components/README.md#attachmentupload)** - 附件上传组件
  - 支持拖拽、点击、粘贴上传
  - 文件类型和大小限制
  - 图片/PDF 预览功能
  - 上传进度显示
  - [详细指南](./docs/attachment-upload-guide.md)

### API 模板

- **[标签管理 API](./api/tags.ts)** - 完整的 CRUD API 示例
  - TypeScript 类型定义
  - RESTful API 设计
  - 请求/响应类型安全
  - [API 使用指南](./api/README.md)

- **[文件上传 API](./api/upload.ts)** - 文件上传 API 示例
  - FormData 文件上传
  - 与后端 MinIO 对接
  - 完整的类型定义

### Hooks 模板

- **[useUpload](./hooks/useUpload.ts)** - 文件上传 Hook
  - 文件验证（类型、大小）
  - 上传进度追踪
  - 错误处理

### 页面模板

- **[标签管理页面](./pages/tag-management/)** - 完整的 CRUD 页面示例
  - 列表展示、搜索筛选
  - 新增、编辑、删除操作
  - 状态切换、表单验证
  - [页面说明](./pages/tag-management/README.md)

### 使用指南

- **[表格生成指南](./docs/table-generation-guide.md)** - 快速创建列表页面
- **[详情弹窗指南](./docs/detail-modal-guide.md)** - 创建详情展示
- **[组件使用指南](./docs/component-usage-guide.md)** - 组件通用使用方法
- **[开发规范](./docs/development-guide.md)** - 代码规范和最佳实践
- **[迁移指南](./docs/migration-guide.md)** - 集成到现有项目

### 配置文档

- **[依赖清单](./config/dependencies.json)** - 所需依赖和版本
- **[图标配置](./config/icons-config.md)** - 图标系统配置
- **[Tailwind 说明](./config/tailwind-classes.md)** - 样式系统说明
- **[Vite Quill 配置](./config/vite-quill-config.md)** - Quill 富文本编辑器配置指南

## 🔄 与 Speckit 工作流集成

本模板库专为 Speckit 开发工作流设计，可以在以下阶段使用：

### 1. 规划阶段 (`/speckit.plan`)

在制定实施计划时，可以参考本模板库：

```markdown
## 技术栈选择

- 前端组件：使用 .specify/templates/project/components/ 中的模板
- 页面布局：参考 TableLayout 组件实现列表页
- API 设计：参考 .specify/templates/project/api/tags.ts
```

### 2. 任务生成阶段 (`/speckit.tasks`)

根据模板库生成具体任务：

```markdown
## 阶段 3：用户故事 1 - 标签管理列表页（P1）

- [ ] T010 复制 TableLayout 组件到项目
- [ ] T011 根据需求调整 TableLayout props
- [ ] T012 实现标签 API（参考 api/tags.ts）
- [ ] T013 创建标签管理页面（参考 pages/tag-management/）
```

### 3. 实施阶段 (`/speckit.implement`)

直接使用模板代码：

- 复制组件模板并根据需求调整
- 参考 API 模板实现后端接口
- 使用页面模板快速搭建界面
- 遵循文档中的最佳实践

**详细集成指南**：[INTEGRATION.md](./INTEGRATION.md)

## 🚀 快速开始

### 使用组件模板

```bash
# 1. 复制 TableLayout 组件到项目
cp -r .specify/templates/project/components/TableLayout \
      apps/web-antd/src/components/

# 2. 在页面中使用
```

```vue
<script setup lang="ts">
import { TableLayout } from '@/components/TableLayout';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '名称', dataIndex: 'name', key: 'name' },
];
</script>

<template>
  <div class="page-container">
    <TableLayout
      :columns="columns"
      :data-source="dataSource"
      :total="total"
      title="数据列表"
    />
  </div>
</template>
```

### 使用 API 模板

```bash
# 1. 复制 API 模板
cp .specify/templates/project/api/tags.ts \
   apps/web-antd/src/api/

# 2. 根据需求调整接口和类型定义
```

### 使用页面模板

```bash
# 1. 复制页面模板
cp -r .specify/templates/project/pages/tag-management \
      apps/web-antd/src/views/

# 2. 根据需求调整页面逻辑
```

## 📋 使用场景

### 场景 1：创建新的 CRUD 列表页

**推荐模板**：

- `components/TableLayout/` - 表格布局
- `pages/tag-management/` - 完整示例
- `api/tags.ts` - API 层

**参考文档**：

- [表格生成指南](./docs/table-generation-guide.md)
- [组件使用指南](./docs/component-usage-guide.md)

### 场景 2：添加详情展示功能

**推荐模板**：

- `components/DetailModal/` - 详情弹窗

**参考文档**：

- [详情弹窗指南](./docs/detail-modal-guide.md)

### 场景 3：实现标签系统

**推荐模板**：

- `components/CustomTag/` - 标签组件
- `pages/tag-management/` - 标签管理页面
- `api/tags.ts` - 标签 API

### 场景 4：项目初始化

**推荐操作**：

1. 查阅 [依赖清单](./config/dependencies.json) 安装必需依赖
2. 参考 [图标配置](./config/icons-config.md) 配置图标系统
3. 参考 [Tailwind 说明](./config/tailwind-classes.md) 配置样式系统
4. 复制需要的组件到项目中

## ⚙️ 技术栈要求

### 必需依赖

- **Vue**: ^3.4.0
- **Ant Design Vue**: ^4.0.0
- **TypeScript**: ^5.3.0

### 推荐依赖

- **Tailwind CSS**: ^3.4.0
- **unplugin-icons**: ^0.18.0
- **@iconify/json**: ^2.2.0

详细依赖说明请查看 [dependencies.json](./config/dependencies.json)

## 💡 使用建议

### 1. 组件定制

所有组件都支持通过 props 和插槽进行定制：

```vue
<TableLayout :columns="columns" :data-source="dataSource">
  <template #bodyCell="{ column, record }">
    <!-- 自定义单元格内容 -->
  </template>
</TableLayout>
```

### 2. 样式定制

使用 Tailwind CSS 或 scoped 样式：

```vue
<style scoped>
.custom-table :deep(.ant-table-thead) {
  background: #f0f0f0;
}
</style>
```

### 3. 类型安全

充分利用 TypeScript 类型系统：

```typescript
import type { TableLayoutProps } from '@/components/TableLayout';
import type {
  ActionButton,
  FilterField,
} from '@/components/TableLayout/TableHeader';
```

### 4. 性能优化

- 使用 `defineAsyncComponent` 懒加载大型组件
- 合理使用 `computed` 和 `watch`
- 避免不必要的响应式数据

## 📝 开发规范

使用本模板库时，请遵循以下规范：

1. **保持类型安全**：所有 API 调用和组件使用都应有类型定义
2. **遵循命名规范**：组件、变量、函数命名遵循项目约定
3. **代码复用**：优先使用模板库中的组件，避免重复造轮子
4. **文档先行**：使用新模板前先阅读相关文档
5. **渐进式增强**：先使用基础功能，再根据需求扩展

详细开发规范请查看 [开发规范](./docs/development-guide.md)

## 🔧 常见问题

### Q: 如何在现有项目中使用这些模板？

A: 查阅 [迁移指南](./docs/migration-guide.md)，按照步骤将模板集成到现有项目。

### Q: 组件使用时出现类型错误？

A: 确保已安装所有必需依赖，并检查 TypeScript 配置。参考 [组件使用指南](./docs/component-usage-guide.md)。

### Q: 如何自定义组件样式？

A: 组件支持通过 Tailwind CSS 类名或 `:deep()` 选择器自定义样式。参考各组件的详细文档。

### Q: 可以在 Speckit 命令中直接引用这些模板吗？

A: 可以！在 `/speckit.plan` 和 `/speckit.implement` 阶段，可以直接引用模板路径。查看 [INTEGRATION.md](./INTEGRATION.md) 了解详情。

## 📚 相关文档

### Speckit 工作流

- [Speckit 完整开发流程指南](../../开发流程指南.md)
- [Speckit 快速参考](../../快速参考.md)
- [模板集成指南](./INTEGRATION.md)

### 外部文档

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Ant Design Vue 官方文档](https://antdv.com/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [unplugin-icons 文档](https://github.com/unplugin/unplugin-icons)

## 🤝 贡献

如果你发现模板中的问题或有改进建议，欢迎：

1. 更新模板代码和文档
2. 添加新的使用场景和示例
3. 完善最佳实践说明

## 📄 许可证

MIT License

---

**记住**：这些模板是起点而非终点。根据项目实际需求灵活调整和扩展！🚀

如有问题，请查阅相关文档或联系项目团队。
