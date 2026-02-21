# Vben 项目 Skills 索引

本目录下的 Skills 与 `docs/skills/rules.vben-skills.mdc` 配合使用。
将 `rules.vben-skills.mdc` 复制到目标项目的 `.cursor/rules/` 并设为 `alwaysApply: true`，可让 AI 正确使用这些 Skills。

## 两种使用模式

### 精简模式

默认仅使用 `vben-components` 总入口 Skill，技能列表最短，AI 按组件类型查阅 references 执行。

### 增强模式

运行以下命令可一键安装细粒度组件 Skills，获得更精准触发：

- **复制模式**（默认）：`node scripts/install-skill-pack.mjs --pack vben-components`
- **软链模式**：`node scripts/install-skill-pack.mjs --pack vben-components --mode symlink`  
  软链后模板仓库变更会同步生效，适合集中维护多项目。

卸载恢复精简：`node scripts/uninstall-skill-pack.mjs --pack vben-components`  
（会根据目标类型安全卸载：软链只移除链接，目录则递归删除，不会删除 `.cursor/skill-packs/` 源文件。）

**已用复制模式安装的项目改为软链**：在项目根目录执行  
`node scripts/migrate-skill-pack-to-symlink.mjs --pack vben-components`  
（需已存在 install/uninstall 脚本及 `.cursor/skill-packs/vben-components`。）

## Skills 列表

### vben-components

- **用途**：Implements Vue Vben / Ant Design Vue UI components per project templates.
- **触发示例**：building list pages (TableLayout), detail modals (DetailModal, DetailDrawer), file upload (AttachmentUpload, UniversalUp...

## 可选安装（细粒度 Skills）

安装 pack 后可用：`vben-attachmentpreview-attachments-list`, `vben-attachmentupload-file-upload`, `vben-auditlayout-flow-toolkit`, `vben-customtag-labels`, `vben-detaildrawer-detail-view`, `vben-detailmodal-detail-view`, `vben-emptystate-ux`, `vben-filterform-search`, `vben-icons-management`, `vben-mediapreview-fullscreen-preview`, `vben-richeditor-quill`, `vben-tablelayout-crud`, `vben-timeline-records`

## 使用方式

- 对话中提及相关关键词（如 TableLayout、DetailModal、AttachmentUpload 等）时，AI 会自动加载对应 Skill。
- 或显式说明：如「按照 vben-components 的 TableLayout 流程实现列表页」。

## 初始化脚本

```bash
node scripts/init-project-skills.mjs
```
