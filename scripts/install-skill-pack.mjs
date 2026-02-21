#!/usr/bin/env node
// 将 skill-packs 中的细粒度 Skills 安装到 .cursor/skills/，可逆

import { readdirSync, copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, symlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACKS_DIR = join(ROOT, '.cursor', 'skill-packs');
const SKILLS_DIR = join(ROOT, '.cursor', 'skills');
const MANIFEST_PATH = join(SKILLS_DIR, '.installed-manifest.json');

function cpDir(src, dest) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = join(src, e.name);
    const destPath = join(dest, e.name);
    if (e.isDirectory()) {
      cpDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function linkDir(src, dest) {
  symlinkSync(src, dest, 'dir');
}

function printHelp() {
  console.log(`
安装 vben-components 细粒度 Skills（增强模式）

用法:
  node scripts/install-skill-pack.mjs [选项]
  node scripts/install-skill-pack.mjs --help

选项:
  --pack <name>     Pack 名称，默认 vben-components
  --mode <copy|symlink>  安装方式，默认 copy；symlink 为软链，模板变更自动生效
  --only <list>     仅安装指定 Skills，逗号分隔，如：--only vben-tablelayout-crud,vben-attachmentupload-file-upload

两种模式说明:
  精简模式（默认） 仅使用 vben-components 总入口，技能列表最短，适合日常开发
  增强模式（本脚本）安装细粒度 Skills，每个组件独立 Skill，触发更精准
  --mode copy       复制到 .cursor/skills/，项目独立副本
  --mode symlink    软链到 pack 源目录，集中维护时模板变更自动生效

卸载恢复精简:
  node scripts/uninstall-skill-pack.mjs --pack vben-components
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let pack = 'vben-components';
  let mode = 'copy';
  let only = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    }
    if (args[i] === '--pack' && args[i + 1]) pack = args[++i];
    else if (args[i] === '--mode' && args[i + 1]) mode = args[++i];
    else if (args[i] === '--only' && args[i + 1]) only = args[++i].split(',').map((s) => s.trim());
  }
  return { pack, mode, only };
}

function main() {
  const { pack, mode, only } = parseArgs();

  if (mode !== 'copy' && mode !== 'symlink') {
    console.error('--mode 仅支持 copy 或 symlink');
    process.exitCode = 1;
    return;
  }

  const packDir = join(PACKS_DIR, pack);
  if (!existsSync(packDir)) {
    console.error(`Pack 不存在: ${pack}`);
    process.exitCode = 1;
    return;
  }

  if (!existsSync(SKILLS_DIR)) {
    mkdirSync(SKILLS_DIR, { recursive: true });
  }

  const entries = readdirSync(packDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  const toInstall = only ? entries.filter((e) => only.includes(e.name)) : entries;

  let manifest = {};
  if (existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
    } catch {
      manifest = {};
    }
  }
  if (!manifest[pack]) manifest[pack] = [];

  let installedCount = 0;
  for (const e of toInstall) {
    const srcPath = join(packDir, e.name);
    const destPath = join(SKILLS_DIR, e.name);
    if (!existsSync(join(srcPath, 'SKILL.md'))) {
      console.warn(`跳过（无 SKILL.md）: ${e.name}`);
      continue;
    }
    if (existsSync(destPath)) {
      console.warn(`跳过（目标已存在）: ${e.name}`);
      continue;
    }
    if (mode === 'symlink') {
      linkDir(srcPath, destPath);
    } else {
      cpDir(srcPath, destPath);
    }
    if (!manifest[pack].includes(e.name)) manifest[pack].push(e.name);
    console.log(`已安装: ${e.name}`);
    installedCount++;
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n共安装 ${installedCount} 个 Skill，manifest 已更新`);
}

main();
