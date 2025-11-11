# XX管理后台

基于 Vue Vben Admin 5.0 开发的XX管理后台系统。

## 简介

XX管理后台是一个免费开源的中后台模板，采用最新的 Vue 3、Vite、TypeScript 等主流技术开发，提供开箱即用的中后台前端解决方案。

本项目包括：

- **Web应用**: 基于 Ant Design Vue 构建
- **Mock服务**: 内置轻量级后端 mock 服务用于开发

## 特性

- **最新技术栈**: 使用 Vue 3、Vite 等前沿技术开发
- **TypeScript**: 应用程序级 JavaScript 语言
- **主题**: 提供多套主题色彩，可配置自定义主题
- **国际化**: 内置完善的国际化方案
- **权限**: 内置完善的动态路由权限生成方案

## 安装使用

### 环境要求

- Node.js >= 20.10.0
- pnpm >= 9.12.0

### 安装步骤

1. 获取项目代码

```bash
git clone [your-repository-url]
```

2. 安装依赖

```bash
cd template-webui
npm i -g corepack
pnpm install
```

3. 运行

```bash
# 启动 web-antd 应用 (mock 服务会自动启动)
pnpm dev:antd
# 或使用通用命令
pnpm dev
```

4. 构建

```bash
# 构建 web-antd 应用
pnpm build:antd
# 或使用通用命令
pnpm build
```

## 可用脚本

- `pnpm dev:antd` - 启动 Ant Design Vue 应用
- `pnpm build:antd` - 构建 Ant Design Vue 应用
- `pnpm dev:mock` - 仅启动 mock 服务
- `pnpm preview` - 预览生产构建
- `pnpm lint` - 运行代码检查
- `pnpm format` - 格式化代码
- `pnpm clean` - 清理构建产物和依赖

## Git 提交规范

参考 [Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) 规范

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `ci` 持续集成
- `types` 类型定义文件更改

## 浏览器支持

本地开发推荐使用 `Chrome 80+` 浏览器

支持现代浏览器，不支持 IE

| Edge | Firefox | Chrome | Safari |
| :-: | :-: | :-: | :-: |
| 最新2个版本 | 最新2个版本 | 最新2个版本 | 最新2个版本 |

## 许可证

[MIT](./LICENSE)

## 致谢

本项目基于 [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin) 开发
