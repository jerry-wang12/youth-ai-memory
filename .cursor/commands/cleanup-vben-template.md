# 清理 Vben 模板项目

使用此命令清理模板中的示例代码，保留核心框架文件。

## 需要清理的文件

### 1. 示例视图页面

清理 `project-vben/apps/web-antd/src/views/` 目录下的示例页面：

**建议删除的目录/文件**：

```bash
# 删除组件演示页面
rm -rf project-vben/apps/web-antd/src/views/components-demo/

# 保留以下目录：
# - _core/     核心页面（登录、404等）
# - dashboard/ 仪表盘页面（可根据需要修改）
```

### 2. 示例路由

清理 `project-vben/apps/web-antd/src/router/routes/modules/` 目录：

**建议删除的文件**：

```bash
# 删除组件演示路由
rm project-vben/apps/web-antd/src/router/routes/modules/components-demo.ts
```

**保留的文件**：

- `dashboard.ts` - 仪表盘路由（可修改）

### 3. 示例 API

检查 `project-vben/apps/web-antd/src/api/` 目录：

**保留的文件**：

- `core/` - 核心 API（认证、菜单、用户）
- `index.ts` - API 入口
- `request.ts` - 请求配置

**可删除的文件**：

根据实际业务需求，删除不需要的示例 API 文件。

---

## 必须保留的文件

以下文件是模板库的核心文件，**请勿删除**：

### 模板库

```
.specify/templates/project-vben/
├── components/          # 组件模板
│   ├── TableLayout/     # 表格布局组件
│   ├── DetailModal/     # 详情弹窗组件
│   ├── DetailDrawer/    # 详情抽屉组件
│   ├── AttachmentUpload/ # 附件上传组件
│   ├── CustomTag/       # 自定义标签组件
│   ├── RichEditor/      # 富文本编辑器
│   ├── EmptyState/      # 空状态组件
│   ├── FilterForm/      # 筛选表单组件
│   ├── MediaPreview/    # 媒体预览组件
│   ├── AttachmentPreview/ # 附件预览组件
│   ├── Timeline/        # 时间轴组件
│   └── README.md        # 组件使用文档
├── api/                 # API 模板
├── pages/               # 页面模板
├── docs/                # 使用指南
├── icons/               # 图标模板
├── hooks/               # Hooks 模板
├── config/              # 配置文档
├── public/              # 静态资源
├── styles/              # 样式模板
└── README.md            # 模板库总览
```

### 开发规范

```
.cursor/rules/templates-rules-vben.mdc  # 开发规范（必须保留）
```

### 文档（可选保留）

```
docs/
├── 样式规范.md           # 样式规范文档
└── swagger/             # Swagger API 文档（如已配置）
```

---

## 清理步骤

### 步骤 1：删除示例页面

```bash
# 删除组件演示页面
rm -rf project-vben/apps/web-antd/src/views/components-demo/
```

### 步骤 2：删除示例路由

```bash
# 删除组件演示路由
rm project-vben/apps/web-antd/src/router/routes/modules/components-demo.ts
```

### 步骤 3：清理国际化文件（可选）

如果删除了示例页面，需要同步清理国际化文件：

修改 `project-vben/apps/web-antd/src/locales/langs/zh-CN/page.json` 和 `en-US/page.json`，删除对应的翻译内容。

### 步骤 4：验证项目

```bash
cd project-vben

# 安装依赖（如果还没安装）
pnpm install

# 启动开发服务器验证
pnpm dev:antd

# 检查类型错误
pnpm check:type
```

---

## 清理后的项目结构

清理完成后，项目结构应该如下：

```
project-vben/
├── apps/
│   ├── backend-mock/           # Mock 服务
│   └── web-antd/
│       ├── src/
│       │   ├── adapter/        # 适配器
│       │   ├── api/
│       │   │   ├── core/       # 核心 API
│       │   │   ├── index.ts
│       │   │   └── request.ts
│       │   ├── components/     # 业务组件（从模板复制）
│       │   ├── icons/          # 图标（从模板复制）
│       │   ├── layouts/        # 布局
│       │   ├── locales/        # 国际化
│       │   ├── router/
│       │   │   └── routes/
│       │   │       ├── modules/
│       │   │       │   └── dashboard.ts
│       │   │       ├── core.ts
│       │   │       └── index.ts
│       │   ├── store/          # 状态管理
│       │   ├── views/
│       │   │   ├── _core/      # 核心页面
│       │   │   └── dashboard/  # 仪表盘
│       │   ├── app.vue
│       │   ├── bootstrap.ts
│       │   ├── main.ts
│       │   └── preferences.ts
│       └── ...
├── internal/                   # 内部工具
├── packages/                   # 共享包
└── ...
```

---

## 检查清单

- [ ] 删除了 `views/components-demo/` 目录
- [ ] 删除了 `router/routes/modules/components-demo.ts` 文件
- [ ] 清理了国际化文件中的示例翻译（如需要）
- [ ] 确认保留了 `.specify/templates/project-vben/` 目录
- [ ] 确认保留了 `.cursor/rules/templates-rules-vben.mdc` 文件
- [ ] 运行 `pnpm dev:antd` 验证项目正常启动
- [ ] 运行 `pnpm check:type` 检查无类型错误

---

## 注意事项

### 不要删除的文件

1. **模板库** (`.specify/templates/project-vben/`)
   - 这是组件和页面模板的源文件
   - 开发新功能时需要参考和复制

2. **开发规范** (`.cursor/rules/templates-rules-vben.mdc`)
   - 包含强制性的开发规范
   - Cursor AI 会自动读取并遵循

3. **核心页面** (`views/_core/`)
   - 包含登录、404 等核心页面
   - 删除会导致项目无法正常运行

4. **核心 API** (`api/core/`, `api/request.ts`)
   - 包含认证、用户等核心 API
   - 删除会影响登录和权限功能

### 清理后添加新功能

清理完成后，添加新功能时请参考：

1. **新建页面**：参考 `.specify/templates/project-vben/pages/tag-management/`
2. **使用组件**：查看 `.specify/templates/project-vben/components/README.md`
3. **实现 API**：参考 `.specify/templates/project-vben/api/tags.ts`

