---
name: vben-components
description: Implements Vue Vben / Ant Design Vue UI components per project templates. Use when building list pages (TableLayout), detail modals (DetailModal, DetailDrawer), file upload (AttachmentUpload, UniversalUpload), empty state (EmptyState), filters (FilterForm), tags (CustomTag), timeline (Timeline), media preview (MediaPreview, AttachmentPreview), rich editor (RichEditor), icons (#/icons), or audit/flow layout (AuditLayout, FlowStatusTag, FixedFooter). Covers all template components in .specify/templates/project-vben/components.
---

# Vben 组件库

Vue Vben 项目必须使用的模板组件及用法。具体怎么做按下方组件类型查阅对应 reference。

## 组件速查

| 场景 | 组件 | 参考 |
|------|------|------|
| 列表页 CRUD | TableLayout | [references/tablelayout.md](references/tablelayout.md) |
| 详情弹窗 | DetailModal | [references/detailmodal.md](references/detailmodal.md) |
| 详情抽屉 | DetailDrawer | [references/detaildrawer.md](references/detaildrawer.md) |
| 文件上传 | AttachmentUpload / UniversalUpload | [references/attachmentupload.md](references/attachmentupload.md) |
| 附件展示 | AttachmentPreview | [references/attachmentpreview.md](references/attachmentpreview.md) |
| 媒体全屏预览 | MediaPreview | [references/mediapreview.md](references/mediapreview.md) |
| 时间轴 | Timeline | [references/timeline.md](references/timeline.md) |
| 独立筛选表单 | FilterForm | [references/filterform.md](references/filterform.md) |
| 空状态 | EmptyState | [references/emptystate.md](references/emptystate.md) |
| 标签 | CustomTag | [references/customtag.md](references/customtag.md) |
| 富文本 | RichEditor | [references/richeditor.md](references/richeditor.md) |
| 审批/流程 | AuditLayout, FlowStatusTag, FixedFooter | [references/auditlayout_flow_toolkit.md](references/auditlayout_flow_toolkit.md) |
| 图标 | #/icons | [references/icons.md](references/icons.md) |

## 约束（必须遵守）

- 列表页：TableLayout，禁止 `<a-table>`
- 详情：DetailModal/DetailDrawer，禁止裸 `<a-modal>`
- 上传：AttachmentUpload/UniversalUpload，禁止 `<a-upload>`
- 图标：从 `#/icons` 导入，禁止 emoji
- 根容器：TableLayout 页面需 `<div class="page-container">`

## 增强模式

若已安装细粒度 Skills（`node scripts/install-skill-pack.mjs --pack vben-components`），可单独触发对应组件 Skill 获得更精准指引。
