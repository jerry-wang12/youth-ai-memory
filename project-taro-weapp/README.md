# Taro Vue3 微信小程序模板

基于 Taro 4.x + Vue 3 + TypeScript 的微信小程序开发模板，开箱即用。

## 技术栈

- **框架**: Taro 4.1.7 + Vue 3
- **语言**: TypeScript
- **状态管理**: Pinia
- **UI 组件**: taro-ui-vue3
- **样式**: SCSS + CSS Variables
- **代码规范**: ESLint + Stylelint + Commitlint

## 特性

- 🚀 基于 Taro 4.x，支持多端开发
- 📦 Vue 3 Composition API
- 🎨 主题切换（CSS Variables）
- 🌐 多语言支持
- 📱 自定义 TabBar
- 🧩 通用组件库
- 🔧 完善的开发配置

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 微信小程序
pnpm dev:weapp

# H5
pnpm dev:h5
```

### 构建

```bash
# 微信小程序
pnpm build:weapp

# H5
pnpm build:h5
```

## 项目结构

```
├── config/               # 构建配置
│   ├── dev.ts           # 开发环境配置
│   ├── prod.ts          # 生产环境配置
│   └── index.ts         # 主配置文件
├── src/
│   ├── app.ts           # 应用入口
│   ├── app.config.ts    # 应用配置
│   ├── app.scss         # 全局样式
│   ├── components/      # 通用组件
│   │   ├── BottomSheet/ # 底部弹窗
│   │   ├── CustomTabBar/# 自定义 TabBar
│   │   ├── DynamicForm/ # 动态表单
│   │   ├── ImageLoader/ # 图片加载
│   │   ├── ImageUploader/# 图片上传
│   │   ├── MarkdownView/# Markdown 渲染
│   │   └── PageBackground/ # 页面背景
│   ├── config/          # 配置
│   │   └── env.ts       # 环境配置
│   ├── pages/           # 页面
│   │   ├── home/        # 首页
│   │   ├── docs/        # 文档
│   │   └── profile/     # 个人中心
│   ├── store/           # 全局状态（非 Pinia）
│   │   ├── theme.ts     # 主题状态
│   │   └── tabbar.ts    # TabBar 状态
│   ├── stores/          # Pinia stores
│   │   └── locale.ts    # 语言设置
│   └── utils/           # 工具函数
│       ├── date.ts      # 日期处理
│       └── request.ts   # 网络请求
├── types/               # 类型声明
├── package.json
├── tsconfig.json
└── project.config.json  # 小程序配置
```

## 组件说明

### ImageLoader
图片加载组件，支持加载状态、错误处理。

```vue
<ImageLoader src="https://example.com/image.jpg" mode="aspectFill" />
```

### ImageUploader
图片上传组件，支持注入上传函数。

```vue
<ImageUploader v-model="imageUrl" :upload-fn="customUploadFn" />
```

### BottomSheet
底部弹窗组件，基于 AtFloatLayout 优化。

```vue
<BottomSheet v-model:visible="visible" title="标题">
  <view>内容</view>
  <template #footer>
    <button>确定</button>
  </template>
</BottomSheet>
```

### CustomTabBar
自定义 TabBar 组件，支持角标和红点。

```vue
<CustomTabBar :current="0" :tab-items="tabItems" />
```

### DynamicForm
动态表单组件，根据配置渲染表单。

```vue
<DynamicForm :config="formConfig" @submit="handleSubmit" />
```

### MarkdownView
Markdown 渲染组件，支持 Markdown 和 HTML。

```vue
<MarkdownView :content="markdownContent" />
```

## 主题配置

在 `src/app.scss` 中定义 CSS 变量：

```scss
:root {
  --color-primary: #326292;
  --color-primary-light: rgba(50, 98, 146, 0.1);
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  // ...
}
```

使用 `src/store/theme.ts` 切换主题：

```typescript
import { toggleTheme, setTheme } from '@/store/theme'

// 切换主题
toggleTheme()

// 设置指定主题
setTheme('red')
```

## 配置项

### 环境配置

在 `src/config/env.ts` 中配置：

```typescript
export const API_BASE_URL = 'https://api.example.com'
export const IS_DEBUG = process.env.NODE_ENV !== 'production'
```

### 小程序配置

修改 `project.config.json` 中的：

- `appid`: 小程序 AppID
- `projectname`: 项目名称

## 开发规范

### 命名规范

- 文件名：kebab-case（如 `user-profile.vue`）
- 组件名：PascalCase（如 `UserProfile`）
- 变量名：camelCase（如 `userName`）

### 生命周期

使用 Taro 提供的 `use` 开头的钩子：

```typescript
import { useDidShow, useLoad } from '@tarojs/taro'

setup() {
  useLoad((options) => {
    console.log('页面加载', options)
  })

  useDidShow(() => {
    console.log('页面显示')
  })
}
```

## License

MIT

