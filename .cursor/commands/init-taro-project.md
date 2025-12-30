# 初始化 Taro Vue3 微信小程序项目

## 概述

使用 `project-taro-weapp` 模板创建新的 Taro + Vue 3 微信小程序项目。

## 初始化步骤

### 1. 复制模板

```bash
# 复制模板到目标目录（替换 <project-name> 为项目名）
cp -r /path/to/youth-ai-memory/project-taro-weapp /path/to/<project-name>
cd /path/to/<project-name>
```

### 2. 修改项目配置

#### package.json
- 修改 `name` 为项目名
- 修改 `description` 为项目描述
- 检查依赖版本

#### project.config.json
- 修改 `appid` 为小程序 AppID（必须）
- 修改 `projectname` 为项目名称

#### src/config/env.ts
- 修改 `API_BASE_URL` 为实际 API 地址
- 配置其他环境变量

### 3. 安装依赖

```bash
pnpm install
```

### 4. 启动开发

```bash
# 微信小程序开发
pnpm dev:weapp

# 在微信开发者工具中打开 dist 目录
```

## 配置检查清单

- [ ] package.json 中的项目名已修改
- [ ] project.config.json 中的 appid 已配置
- [ ] project.config.json 中的 projectname 已修改
- [ ] src/config/env.ts 中的 API 地址已配置
- [ ] 已执行 pnpm install
- [ ] 已在微信开发者工具中打开项目

## 目录结构

```
<project-name>/
├── config/               # 构建配置
│   ├── dev.ts
│   ├── prod.ts
│   └── index.ts
├── src/
│   ├── app.ts           # 应用入口
│   ├── app.config.ts    # 应用配置
│   ├── app.scss         # 全局样式（CSS Variables）
│   ├── components/      # 通用组件
│   │   ├── BottomSheet/
│   │   ├── CustomTabBar/
│   │   ├── DynamicForm/
│   │   ├── ImageLoader/
│   │   ├── ImageUploader/
│   │   ├── MarkdownView/
│   │   └── PageBackground/
│   ├── config/
│   │   └── env.ts       # 环境配置
│   ├── pages/           # 主包页面
│   ├── store/           # 全局状态
│   ├── stores/          # Pinia stores
│   └── utils/           # 工具函数
├── types/               # 类型声明
├── package.json
└── project.config.json
```

## 添加新页面

### 1. 创建页面文件

在 `src/pages/<page-name>/` 下创建：
- `index.vue` - 页面组件
- `index.config.ts` - 页面配置
- `index.scss` - 页面样式

### 2. 注册页面路由

在 `src/app.config.ts` 中添加：

```typescript
export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/<page-name>/index', // 添加新页面
  ],
  // ...
})
```

## 添加子包（分包）

### 1. 创建子包目录

```
src/subPages/<package-name>/
└── <page-name>/
    ├── index.vue
    ├── index.config.ts
    └── index.scss
```

### 2. 配置子包

在 `src/app.config.ts` 中添加：

```typescript
export default defineAppConfig({
  pages: [...],
  subPackages: [
    {
      root: 'subPages/<package-name>',
      pages: ['<page-name>/index']
    }
  ]
})
```

## 组件使用示例

### ImageLoader

```vue
<ImageLoader 
  src="https://example.com/image.jpg" 
  mode="aspectFill" 
/>
```

### ImageUploader

```vue
<ImageUploader 
  v-model="imageUrl" 
  :upload-fn="uploadImage" 
/>
```

### BottomSheet

```vue
<BottomSheet v-model:visible="visible" title="标题">
  <view>内容区域</view>
  <template #footer>
    <button @tap="visible = false">确定</button>
  </template>
</BottomSheet>
```

### CustomTabBar

```vue
<CustomTabBar :current="0" :tab-items="tabItems" />
```

## 主题配置

### 定义主题变量

在 `src/app.scss` 中：

```scss
:root {
  --color-primary: #326292;
  --color-primary-light: rgba(50, 98, 146, 0.1);
}
```

### 切换主题

```typescript
import { toggleTheme, setTheme } from '@/store/theme'

// 切换
toggleTheme()

// 设置
setTheme('red')
```

## 常见问题

### 编译报错

确保已正确安装依赖：

```bash
rm -rf node_modules
pnpm install
```

### TabBar 不显示

检查 `app.config.ts` 中的 `tabBar.custom` 是否为 `true`，以及页面是否正确引入 `CustomTabBar` 组件。

### 生命周期不触发

确保使用 Taro 的 `use` 开头钩子（如 `useDidShow`），而非小程序原生的 `on` 开头方法。

## 相关资源

- [Taro 官方文档](https://taro-docs.jd.com/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [taro-ui-vue3](https://taro-ui-vue3.netlify.app/)

