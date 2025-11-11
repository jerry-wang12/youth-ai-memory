---
description: 从交互式或提供的原则输入创建或更新 Alumni WebUI 项目宪章
---

## 用户输入

```text
$ARGUMENTS
```

## 概述

你正在更新 Alumni WebUI 项目宪章（`.specify/memory/constitution.md`）。这是一个核心文档，定义了项目的开发原则、技术约束和工作流程。你的工作是：(a) 理解现有宪章结构 (b) 根据用户输入更新内容 (c) 确保与项目其他规范文档一致

## Alumni WebUI 项目背景

**项目**：XX项目管理后台
**技术栈**：Vue 3 + TypeScript + Ant Design Vue + Vite + pnpm workspace
**架构**：Monorepo（`packages/` 共享库 + `apps/` 应用）

**核心规范文档**：
- `.specify/memory/constitution.md` - 项目宪章（8 条核心原则）
- `.cursor/rules/templates-rules.mdc` - 开发规范（强制性规则）
- `.specify/templates/project/README.md` - 模板库文档

## 执行流程

### 1. 加载并理解现有宪章

- 读取 `.specify/memory/constitution.md`
- 识别宪章结构：
  - **核心原则**（8 条）：认真查阅、明确执行、人类确认、复用现有、主动测试、遵循架构、诚实无知、谨慎重构
  - **技术约束**：技术栈、UI 组件规范、环境要求、提交规范
  - **开发工作流**：功能开发流程、质量门控、Code Review 检查点
  - **治理**：宪章权威、修订流程、合规检查
- 理解当前版本号和修订历史

### 2. 确定修改类型和版本升级规则

根据用户输入确定修改范围，并按以下规则递增版本号：

**版本号格式**：`MAJOR.MINOR.PATCH`

- **MAJOR**：向后不兼容的重大变更
  - 删除或重新定义核心原则
  - 更改技术栈（如从 Vue 2 升级到 Vue 3）
  - 重大架构调整
  
- **MINOR**：向后兼容的功能性增强
  - 添加新的核心原则
  - 新增技术约束章节（如图标规范）
  - 扩展工作流程或质量门控
  
- **PATCH**：非功能性改进
  - 措辞优化、错别字修复
  - 示例代码更新
  - 理由说明的补充

### 3. 执行内容更新

根据用户输入更新宪章内容，确保：

- **核心原则**：
  - 每条原则包含：名称、口号、要点列表、理由
  - 原则应该是可执行、可验证的
  - 避免模糊语言，使用具体的行为指导
  
- **技术约束**：
  - 保持与实际技术栈一致
  - UI 组件规范需与 `.cursor/rules/templates-rules.mdc` 对齐
  - 图标规范需明确推荐的图标库和使用方式
  
- **开发工作流**：
  - 质量门控命令需保持可执行（如 `pnpm lint`）
  - Code Review 检查点需与核心原则呼应

### 4. 一致性传播检查（Alumni WebUI 特定）

检查并确保以下文件与宪章修订保持一致：

#### 必须检查的核心文件

- **`.cursor/rules/templates-rules.mdc`**
  - 强制性规则（TableLayout、DetailModal、AttachmentUpload 等）
  - 图标规范需与宪章一致
  - 开发规范需与核心原则呼应
  
- **`.specify/templates/project/README.md`**
  - 模板库文档需符合宪章约束
  - 技术栈说明需一致
  
- **`README.md` 和 `README.zh-CN.md`**
  - 项目介绍和技术栈需与宪章对齐

#### 可选检查的文件

- `.cursor/commands/spec.product-doc.md` - 产品文档命令
- `.cursor/commands/spec.tech-doc.md` - 技术文档命令
- `docs/` 目录下的相关文档

### 5. 生成同步影响报告

在宪章文件顶部添加 HTML 注释格式的影响报告：

```html
<!--
同步影响报告：
- 版本更改：旧版本 → 新版本
- 创建日期：YYYY-MM-DD
- 最后修订：YYYY-MM-DD（今天）
- 修改的原则：列出修改的原则名称
- 添加的原则：列出新增的原则
- 删除的原则：列出删除的原则
- 技术约束变更：列出变更内容
- 需要更新的文档：
  ✅ .cursor/rules/templates-rules.mdc - 已检查/已更新
  ✅ .specify/templates/project/README.md - 已检查/已更新
  ⚠️  其他文件 - 待处理
-->
```

### 6. 最终验证

在写回文件前，验证：

- ✅ 版本号已正确递增
- ✅ 日期格式为 `YYYY-MM-DD`
- ✅ 所有原则都有明确的理由
- ✅ 技术约束准确反映当前技术栈
- ✅ 无遗留的占位符或 TODO
- ✅ 与 templates-rules.mdc 保持一致

### 7. 写回宪章文件

覆写 `.specify/memory/constitution.md`

### 8. 输出最终摘要

提供清晰的摘要：

```markdown
## 宪章更新完成

**版本**：旧版本 → 新版本
**更新日期**：YYYY-MM-DD
**升级类型**：MAJOR / MINOR / PATCH

### 主要变更
- 变更项 1
- 变更项 2

### 影响的文档
✅ 已检查/更新：
- .cursor/rules/templates-rules.mdc
- .specify/templates/project/README.md

⚠️  需要手动检查：
- 其他受影响的文件

### 建议的提交消息
`docs(constitution): [describe change] - bump version to X.X.X`
```

## 格式和样式要求

- 使用中文撰写宪章内容
- 保持 Markdown 标题层次结构（## 为一级章节，### 为二级章节）
- 代码示例使用正确的语言标记（```vue、```typescript、```bash）
- 每个原则的"理由"部分应简洁有力（1-2 句话）
- 部分之间保留一个空行
- 避免尾随空格

## 特殊注意事项

1. **图标规范**：确保推荐的图标库与项目实际配置一致（@iconify/vue + @vben/icons）
2. **强制性规则**：宪章中的技术约束应与 templates-rules.mdc 的强制性规则保持一致
3. **模板优先**：确保"复用现有"原则与模板库使用理念一致
4. **API 规范**：确保"认真查阅"原则强调使用 Swagger 文档（`docs/swagger/*.json`）

## 错误处理

- 如果无法确定某个信息（如批准日期），在影响报告中标记为待确认
- 如果用户输入不明确，先询问澄清再执行
- 部分更新时，只修改相关章节，保持其他内容不变
