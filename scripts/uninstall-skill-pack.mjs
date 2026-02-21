#!/usr/bin/env node
// 卸载由 install-skill-pack 安装的 Skills，按 manifest 还原

import { readdirSync, unlinkSync, rmdirSync, existsSync, readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_DIR = join(ROOT, '.cursor', 'skills');
const MANIFEST_PATH = join(SKILLS_DIR, '.installed-manifest.json');

function rmDir(path) {
  if (!existsSync(path)) return;
  const entries = readdirSync(path, { withFileTypes: true });
  for (const e of entries) {
    const p = join(path, e.name);
    const stat = lstatSync(p);
    if (stat.isSymbolicLink()) {
      unlinkSync(p);
    } else if (stat.isDirectory()) {
      rmDir(p);
    } else {
      unlinkSync(p);
    }
  }
  rmdirSync(path);
}

function printHelp() {
  console.log(`
卸载 vben-components 细粒度 Skills，恢复精简模式

用法:
  node scripts/uninstall-skill-pack.mjs [选项]

选项:
  --pack <name>  Pack 名称，默认 vben-components

说明: 根据 manifest 卸载；若为软链则只移除链接，若为目录则递归删除，不会删除 .cursor/skill-packs/ 源文件。
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let pack = 'vben-components';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    }
    if (args[i] === '--pack' && args[i + 1]) pack = args[++i];
  }
  return { pack };
}

function main() {
  const { pack } = parseArgs();

  if (!existsSync(MANIFEST_PATH)) {
    console.log('无安装记录，跳过');
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch {
    console.error('manifest 格式错误');
    process.exitCode = 1;
    return;
  }

  const installed = manifest[pack];
  if (!installed || installed.length === 0) {
    console.log(`Pack ${pack} 无安装记录，跳过`);
    return;
  }

  for (const name of installed) {
    const destPath = join(SKILLS_DIR, name);
    if (!existsSync(destPath)) continue;
    const stat = lstatSync(destPath);
    if (stat.isSymbolicLink()) {
      unlinkSync(destPath);
    } else if (stat.isDirectory()) {
      rmDir(destPath);
    } else {
      unlinkSync(destPath);
    }
    console.log(`已卸载: ${name}`);
  }

  manifest[pack] = [];
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n共卸载 ${installed.length} 个 Skill，manifest 已更新`);
}

main();
