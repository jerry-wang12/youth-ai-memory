# 初始化 Vben 新项目

使用此模板启动新项目时，请按照以下步骤进行配置。

## 第一步：基础信息配置

### 1.1 修改根 package.json

修改 `project-vben/package.json`：

```json
{
  "name": "your-project-name",  // 修改为你的项目名称
  "version": "1.0.0",
  "homepage": "https://your-repo-url",  // 项目主页
  "bugs": "https://your-repo-url/issues",  // Issue 地址
  "repository": {
    "type": "git",
    "url": "git@your-repo-url.git"  // Git 仓库地址
  }
}
```

### 1.2 修改应用 package.json

修改 `project-vben/apps/web-antd/package.json`：

```json
{
  "name": "@your-scope/web-app",  // 修改应用名称
  "version": "1.0.0",
  "homepage": "https://your-repo-url",
  "bugs": "https://your-repo-url/issues",
  "repository": {
    "type": "git",
    "url": "git@your-repo-url.git",
    "directory": "apps/web-antd"
  }
}
```

### 1.3 修改 index.html

修改 `project-vben/apps/web-antd/index.html`：

```html
<meta name="description" content="你的项目描述" />
<meta name="keywords" content="你的项目关键词" />
<meta name="author" content="你的团队名称" />
```

**百度统计配置**：如果不需要百度统计，删除以下脚本块：

```html
<script>
  // 生产环境下注入百度统计
  if (window._VBEN_ADMIN_PRO_APP_CONF_) {
    // ... 删除整个脚本块
  }
</script>
```

如需保留，请替换为你自己的百度统计 ID。

---

## 第二步：环境变量配置

### 2.1 创建环境变量文件

在 `project-vben/apps/web-antd/` 目录下创建以下文件：

**`.env` - 通用配置**：

```bash
# 应用标题
VITE_APP_TITLE=你的应用名称

# 是否开启压缩
VITE_COMPRESS=gzip

# 是否开启PWA
VITE_PWA=false
```

**`.env.development` - 开发环境**：

```bash
# 开发环境 API 地址
VITE_GLOB_API_URL=http://localhost:8080/api

# 是否开启 mock
VITE_USE_MOCK=true
```

**`.env.production` - 生产环境**：

```bash
# 生产环境 API 地址
VITE_GLOB_API_URL=https://api.your-domain.com

# 是否开启压缩
VITE_COMPRESS=gzip

# 是否删除console
VITE_DROP_CONSOLE=true
```

---

## 第三步：应用配置

### 3.1 修改应用偏好设置

修改 `project-vben/apps/web-antd/src/preferences.ts`：

```typescript
export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    // 其他应用配置...
  },
  theme: {
    mode: 'light', // 'light' | 'dark' | 'auto'
  },
  widget: {
    themeToggle: true, // 是否显示主题切换按钮
  },
});
```

### 3.2 配置 API 请求

检查 `project-vben/apps/web-antd/src/api/request.ts`：

- 确认响应数据格式处理是否符合后端接口规范
- 修改 `successCode` 为后端实际的成功码
- 配置错误消息处理逻辑

```typescript
client.addResponseInterceptor(
  defaultResponseInterceptor({
    codeField: 'code',      // 后端状态码字段名
    dataField: 'data',      // 后端数据字段名
    successCode: 0,         // 后端成功状态码
  }),
);
```

---

## 第四步：复制模板文件

### 4.1 复制组件模板

将模板库中的组件复制到项目中：

```bash
# 复制所有组件
cp -r .specify/templates/project-vben/components/* project-vben/apps/web-antd/src/components/

# 或者按需复制
cp -r .specify/templates/project-vben/components/TableLayout project-vben/apps/web-antd/src/components/
cp -r .specify/templates/project-vben/components/DetailModal project-vben/apps/web-antd/src/components/
cp -r .specify/templates/project-vben/components/AttachmentUpload project-vben/apps/web-antd/src/components/
```

### 4.2 复制图标文件

```bash
cp .specify/templates/project-vben/icons/index.ts project-vben/apps/web-antd/src/icons/
```

### 4.3 复制 Quill 富文本编辑器资源（如需要）

```bash
cp -r .specify/templates/project-vben/public/plugins project-vben/apps/web-antd/public/
```

---

## 第五步：Swagger API 文档配置（可选）

如果项目需要使用 Swagger API 文档同步功能：

### 5.1 创建 Swagger 目录

```bash
mkdir -p docs/swagger
```

### 5.2 创建同步脚本

创建 `scripts/sync-swagger.sh`：

```bash
#!/bin/bash

# Swagger 文档同步脚本
# 修改以下 URL 为你的后端 API 文档地址

ADMIN_API_URL="https://your-api.com/v3/api-docs/admin"
COMMON_API_URL="https://your-api.com/v3/api-docs/common"

echo "正在同步 Swagger 文档..."

curl -s "$ADMIN_API_URL" > docs/swagger/admin-api.json
curl -s "$COMMON_API_URL" > docs/swagger/common-api.json

echo "Swagger 文档同步完成！"
```

赋予执行权限：

```bash
chmod +x scripts/sync-swagger.sh
```

### 5.3 更新开发规范

修改 `.cursor/rules/templates-rules-vben.mdc` 中的 Swagger 文档 URL 为你的实际地址。

---

## 第六步：清理示例代码

执行 `/cleanup-vben-template` 命令清理不需要的示例代码。

---

## 检查清单

- [ ] 修改了根 `package.json` 的项目信息
- [ ] 修改了应用 `package.json` 的应用信息
- [ ] 修改了 `index.html` 的页面元信息
- [ ] 创建了环境变量文件（`.env`、`.env.development`、`.env.production`）
- [ ] 配置了应用偏好设置 `preferences.ts`
- [ ] 检查了 API 请求配置 `request.ts`
- [ ] 复制了需要的组件模板
- [ ] 复制了图标文件
- [ ] （可选）配置了 Swagger 文档同步
- [ ] 清理了示例代码

---

## 重要提醒

### 必须保留的文件

以下文件是模板库的核心文件，**请勿删除**：

- `.specify/templates/project-vben/` - 组件和页面模板库
- `.cursor/rules/templates-rules-vben.mdc` - 开发规范

### 开发规范

开发过程中请遵循 `.cursor/rules/templates-rules-vben.mdc` 中定义的规范：

1. **列表页面**必须使用 `TableLayout` 组件
2. **详情展示**必须使用 `DetailModal` 组件
3. **文件上传**必须使用 `AttachmentUpload` 组件
4. **图标**必须从 `#/icons` 导入

### 获取帮助

- 组件使用文档：`.specify/templates/project-vben/components/README.md`
- 模板库总览：`.specify/templates/project-vben/README.md`
- 开发指南：`.specify/templates/project-vben/docs/`

