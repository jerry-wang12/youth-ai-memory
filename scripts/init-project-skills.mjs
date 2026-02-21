#!/usr/bin/env node
// 初始化/校验项目 Skills：扫描 .cursor/skills 下各 Skill，校验 frontmatter，生成 docs/skills 文档

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_DIR = join(ROOT, '.cursor', 'skills');
const PACKS_DIR = join(ROOT, '.cursor', 'skill-packs');
const DOCS_SKILLS = join(ROOT, 'docs', 'skills');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yaml = match[1];
  const name = yaml.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = yaml.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  return { name, description };
}

function collectSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const skills = [];
  for (const dir of dirs) {
    const skillPath = join(SKILLS_DIR, dir, 'SKILL.md');
    if (!existsSync(skillPath)) continue;
    const content = readFileSync(skillPath, 'utf-8');
    const meta = parseFrontmatter(content);
    if (!meta) {
      console.error(`[ERR] ${dir}: 缺少有效 frontmatter (---name/description---)`);
      process.exitCode = 1;
      continue;
    }
    if (!meta.name || !meta.description) {
      console.error(`[ERR] ${dir}: frontmatter 缺少 name 或 description`);
      process.exitCode = 1;
      continue;
    }
    if (meta.name !== dir) {
      console.error(`[ERR] ${dir}: frontmatter name "${meta.name}" 与目录名不一致`);
      process.exitCode = 1;
      continue;
    }
    skills.push({
      dir,
      name: meta.name,
      description: meta.description,
    });
  }
  return skills;
}

function collectPackSkills(packName) {
  const packDir = join(PACKS_DIR, packName);
  if (!existsSync(packDir)) return [];
  return readdirSync(packDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(packDir, d.name, 'SKILL.md')))
    .map((d) => d.name)
    .sort();
}

function generateReadme(skills, packSkills) {
  const lines = [
    '# Vben 项目 Skills 索引',
    '',
    '本目录下的 Skills 与 `docs/skills/rules.vben-skills.mdc` 配合使用。',
    '将 `rules.vben-skills.mdc` 复制到目标项目的 `.cursor/rules/` 并设为 `alwaysApply: true`，可让 AI 正确使用这些 Skills。',
    '',
    '## 两种使用模式',
    '',
    '### 精简模式',
    '',
    '默认仅使用 `vben-components` 总入口 Skill，技能列表最短，AI 按组件类型查阅 references 执行。',
    '',
    '### 增强模式',
    '',
    '运行 `node scripts/install-skill-pack.mjs --pack vben-components` 可一键安装细粒度组件 Skills，获得更精准触发。',
    '运行 `node scripts/uninstall-skill-pack.mjs --pack vben-components` 可卸载恢复精简。',
    '',
    '## Skills 列表',
    '',
  ];
  for (const s of skills) {
    const trigger = s.description.includes('Use when') ? s.description.split('Use when')[1]?.trim()?.slice(0, 120) : '';
    lines.push(`### ${s.name}`);
    lines.push('');
    lines.push(`- **用途**：${s.description.split('.')[0]}.`);
    if (trigger) lines.push(`- **触发示例**：${trigger}...`);
    lines.push('');
  }
  if (packSkills.length > 0) {
    lines.push('## 可选安装（细粒度 Skills）');
    lines.push('');
    lines.push('安装 pack 后可用：`' + packSkills.join('`, `') + '`');
    lines.push('');
  }
  lines.push('## 使用方式');
  lines.push('');
  lines.push('- 对话中提及相关关键词（如 TableLayout、DetailModal、AttachmentUpload 等）时，AI 会自动加载对应 Skill。');
  lines.push('- 或显式说明：如「按照 vben-components 的 TableLayout 流程实现列表页」。');
  lines.push('');
  lines.push('## 初始化脚本');
  lines.push('');
  lines.push('```bash');
  lines.push('node scripts/init-project-skills.mjs');
  lines.push('```');
  lines.push('');
  return lines.join('\n');
}

function generateRulesTemplate(skills) {
  const skillList = skills.map((s) => `- \`${s.name}\``).join('\n');
  const lines = [
    '---',
    'alwaysApply: true',
    '---',
    '',
    '# 配合 Skills 使用的 Vben 开发规范',
    '',
    '本 rules 与 `.cursor/skills/` 中的 Skills 配合使用：**组件实现**按 Skill 的 `SKILL.md` 及 reference/examples 执行；默认使用 `vben-components` 总入口，安装 pack 后可按细粒度 Skill 执行。',
    '',
    '## 约束（必须遵守）',
    '',
    '- **列表页**：必须使用 `TableLayout`，禁止直接用 `<a-table>`',
    '- **详情展示**：必须使用 `DetailModal` / `DetailDrawer`，禁止用裸 `<a-modal>` 展示详情',
    '- **文件上传**：必须使用 `AttachmentUpload` / `UniversalUpload`，禁止 `<a-upload>` 或 `<input type="file">`',
    '- **图标**：必须从 `#/icons` 导入，禁止使用 emoji 作图标',
    '- **页面根容器**：使用 `TableLayout` 的页面必须有根容器 `<div class="page-container">`；所有页面组件必须有根容器元素，避免 Vue Transition 警告。',
    '',
    '## 组件与适用场景（与 vben-components 一致）',
    '',
    '以下组件必须使用模板库实现，具体用法见 `.cursor/skills/vben-components/references/` 或对应 Skill：',
    '',
    '| 场景 | 组件 |',
    '|------|------|',
    '| 列表页 CRUD | TableLayout |',
    '| 详情弹窗 | DetailModal |',
    '| 详情抽屉 | DetailDrawer |',
    '| 文件上传 | AttachmentUpload / UniversalUpload |',
    '| 附件展示 | AttachmentPreview |',
    '| 媒体全屏预览 | MediaPreview |',
    '| 时间轴 | Timeline |',
    '| 独立筛选表单 | FilterForm |',
    '| 空状态 | EmptyState |',
    '| 标签 | CustomTag |',
    '| 富文本 | RichEditor |',
    '| 审批/流程布局 | AuditLayout, FlowStatusTag, FixedFooter |',
    '| 图标 | 从 `#/icons` 导入 |',
    '',
    '## 样式规范',
    '',
    '- **主题色**：使用主题色变量 `hsl(var(--primary))`，方便主题切换，**禁止**硬编码颜色。',
    '- **色系**：优先使用 Morandi 柔和色系；避免亮红色、亮橙色等过于鲜艳的颜色。',
    '',
    '```css',
    '/* ✅ 推荐 */',
    'background-color: hsl(var(--primary));',
    '',
    '/* ❌ 避免 */',
    'background-color: #FF0000;',
    '```',
    '',
    '## 图标规范',
    '',
    '- **必须**从 `#/icons` 导入图标组件，统一管理。',
    '- **禁止**在代码中使用 emoji 作为图标（如 🔍、🔄、📄 等）或创建返回 emoji 的占位符组件。',
    '',
    '## 类型安全',
    '',
    '- **必须**：所有组件 props 必须有 TypeScript 类型定义；所有 API 请求和响应必须有类型定义。',
    '- **推荐**：使用 `import type` 导入类型。',
    '',
    '```typescript',
    'import type { TableLayoutProps } from \'#/components/TableLayout\';',
    'import type { ActionButton, FilterField } from \'#/components/TableLayout/TableHeader\';',
    '```',
    '',
    '## 对应 Skills（组件具体做法）',
    '',
    '当需要实现列表页、详情弹窗、文件上传、审批流程、图标等场景时，按对应 Skill 的 `SKILL.md` 及 reference/examples 执行：',
    '',
    skillList,
    '',
    '## 使用说明',
    '',
    '1. 将本文件复制到目标项目的 `.cursor/rules/`（如 `rules.vben-skills.mdc`）',
    '2. 确保 `.cursor/skills/` 中存在上述 Skill 目录',
    '3. 将 rules 的 `alwaysApply` 设为 `true` 或在 globs 中限定到管理端代码目录',
    '4. 可选：`node scripts/install-skill-pack.mjs --pack vben-components` 安装细粒度组件 Skills；`node scripts/uninstall-skill-pack.mjs --pack vben-components` 卸载恢复精简。',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const skills = collectSkills();
  const packSkills = collectPackSkills('vben-components');

  if (skills.length === 0) {
    console.log('未发现 Skills，跳过生成');
    return;
  }

  if (!existsSync(DOCS_SKILLS)) {
    mkdirSync(DOCS_SKILLS, { recursive: true });
  }

  writeFileSync(join(DOCS_SKILLS, 'README.md'), generateReadme(skills, packSkills), 'utf-8');
  writeFileSync(join(DOCS_SKILLS, 'rules.vben-skills.mdc'), generateRulesTemplate(skills), 'utf-8');

  console.log(`已生成 docs/skills/README.md、docs/skills/rules.vben-skills.mdc（Skills: ${skills.length}，pack 内细粒度: ${packSkills.length}）`);
}

main();
