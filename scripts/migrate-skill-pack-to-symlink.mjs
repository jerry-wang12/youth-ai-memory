#!/usr/bin/env node
// 将已安装的 skill pack 从复制模式改为软链模式：先卸载再以 symlink 重装

import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..');

function parseArgs() {
  const args = process.argv.slice(2);
  let pack = 'vben-components';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
将已安装的 skill pack 改为软链模式（先卸载再以 --mode symlink 重装）

用法:
  node scripts/migrate-skill-pack-to-symlink.mjs [选项]

选项:
  --pack <name>  Pack 名称，默认 vben-components

说明: 需在项目根目录执行，且已存在 scripts/install-skill-pack.mjs 与 uninstall-skill-pack.mjs。
`);
      process.exit(0);
    }
    if (args[i] === '--pack' && args[i + 1]) pack = args[++i];
  }
  return { pack };
}

function main() {
  const { pack } = parseArgs();
  const opts = { cwd: ROOT, stdio: 'inherit' };
  const uninstallScript = join(SCRIPT_DIR, 'uninstall-skill-pack.mjs');
  const installScript = join(SCRIPT_DIR, 'install-skill-pack.mjs');
  console.log(`正在将 ${pack} 改为软链模式：先卸载再以 symlink 重装...\n`);
  execSync(`node "${uninstallScript}" --pack ${pack}`, opts);
  execSync(`node "${installScript}" --pack ${pack} --mode symlink`, opts);
  console.log('\n已切换为软链模式。');
}

main();
