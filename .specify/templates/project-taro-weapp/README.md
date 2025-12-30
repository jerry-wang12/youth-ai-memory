# Taro Vue3 微信小程序模板

这是一个基于 Taro 4.x + Vue 3 + TypeScript 的微信小程序开发模板。

## 模板位置

完整模板位于 `youth-ai-memory/project-taro-weapp` 目录。

## 快速开始

参考 `.cursor/commands/init-taro-project.md` 中的初始化步骤。

## 包含内容

### 核心配置
- Taro 4.1.7 构建配置
- TypeScript 配置
- ESLint / Stylelint / Commitlint
- 微信小程序配置

### 通用组件
- BottomSheet: 底部弹窗
- CustomTabBar: 自定义 TabBar
- DynamicForm: 动态表单
- ImageLoader: 图片加载
- ImageUploader: 图片上传
- MarkdownView: Markdown 渲染
- PageBackground: 页面背景

### 状态管理
- Pinia stores（locale）
- 全局状态（theme, tabbar）

### 工具函数
- request.ts: 网络请求封装
- date.ts: 日期处理
- text-encoder-polyfill.ts: TextEncoder polyfill

### 示例页面
- home: 首页
- docs: 文档
- profile: 个人中心

## 技术规范

详见 `.cursor/rules/templates-rules-taro-weapp.mdc`

