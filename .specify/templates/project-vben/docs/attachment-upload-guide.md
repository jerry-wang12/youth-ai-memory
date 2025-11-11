# AttachmentUpload 附件上传组件使用指南

## 组件概述

`AttachmentUpload` 是一个功能完善的文件上传组件，支持拖拽上传、点击上传、粘贴上传等多种方式，提供文件预览、下载、删除等功能。

## 核心特性

### 📤 多种上传方式
- **拖拽上传**：拖拽文件到上传区域
- **点击上传**：点击上传区域选择文件
- **粘贴上传**：使用 Ctrl+V / Cmd+V 粘贴文件
- **传统按钮**：提供按钮式上传模式

### 🎨 灵活的展示模式
- **拖拽卡片模式** (dragger)：大面积拖拽区域
- **按钮模式** (button)：传统按钮上传
- **文本列表** (text)：文件列表展示
- **图片卡片** (picture-card)：图片缩略图展示

### ✨ 丰富的功能
- 文件类型限制
- 文件大小限制
- 文件数量限制
- 单/多文件上传
- 图片/PDF 文件预览
- 文件下载
- 文件删除
- 上传进度显示

## 安装步骤

### 1. 复制组件文件

```bash
# 复制组件
cp .specify/templates/project/components/AttachmentUpload/* apps/web-antd/src/components/AttachmentUpload/

# 复制 hooks
cp .specify/templates/project/hooks/useUpload.ts apps/web-antd/src/hooks/

# 复制 API
cp .specify/templates/project/api/upload.ts apps/web-antd/src/api/core/
```

### 2. 导出 API

在 `apps/web-antd/src/api/core/index.ts` 添加：

```typescript
export * from './upload';
```

### 3. 添加所需图标

在 `apps/web-antd/src/icons/index.ts` 添加：

```typescript
/** 文件图标 */
export const MdiFile = createIconifyIcon('mdi:file-outline');
export const MdiFileDocument = createIconifyIcon('mdi:file-document-outline');
export const MdiFilePdf = createIconifyIcon('mdi:file-pdf-box');
export const MdiImage = createIconifyIcon('mdi:image-outline');

/** 上传图标 */
export const MdiUpload = createIconifyIcon('mdi:upload');
export const MdiCloudUpload = createIconifyIcon('mdi:cloud-upload-outline');

/** 操作图标 */
export const MdiEye = createIconifyIcon('mdi:eye-outline');
export const MdiDownload = createIconifyIcon('mdi:download-outline');
export const MdiDelete = createIconifyIcon('mdi:delete-outline');
export const MdiClose = createIconifyIcon('mdi:close');
```

## 基本使用

### 最简单的用法

```vue
<script setup lang="ts">
import type { UploadResponse } from '#/api/core/upload';
import { ref } from 'vue';
import { AttachmentUpload } from '#/components/AttachmentUpload';

const fileList = ref<UploadResponse[]>([]);
</script>

<template>
  <AttachmentUpload v-model="fileList" />
</template>
```

### 拖拽卡片模式（默认）

```vue
<template>
  <AttachmentUpload
    v-model="fileList"
    upload-mode="dragger"
    accept="image/*,.pdf"
    :max-size="10"
    :max-count="5"
  />
</template>
```

### 传统按钮模式

```vue
<template>
  <AttachmentUpload
    v-model="fileList"
    upload-mode="button"
    accept=".doc,.docx,.pdf"
    :max-size="5"
  />
</template>
```

## Props 详解

### modelValue

- **类型**：`UploadResponse[]`
- **默认值**：`[]`
- **说明**：v-model 双向绑定的文件列表

```vue
<AttachmentUpload v-model="fileList" />
```

### accept

- **类型**：`string`
- **默认值**：`undefined`（所有文件类型）
- **说明**：允许的文件类型

**示例**：

```vue
<!-- 仅允许图片 -->
<AttachmentUpload accept="image/*" />

<!-- 允许图片和 PDF -->
<AttachmentUpload accept="image/*,.pdf" />

<!-- 允许特定扩展名 -->
<AttachmentUpload accept=".jpg,.png,.pdf" />

<!-- 允许特定 MIME 类型 -->
<AttachmentUpload accept="image/png,image/jpeg,application/pdf" />
```

### maxSize

- **类型**：`number`
- **默认值**：`10`
- **单位**：MB
- **说明**：最大文件大小限制

```vue
<!-- 限制 5MB -->
<AttachmentUpload :max-size="5" />

<!-- 限制 20MB -->
<AttachmentUpload :max-size="20" />
```

### multiple

- **类型**：`boolean`
- **默认值**：`true`
- **说明**：是否支持多文件上传

```vue
<!-- 单文件上传 -->
<AttachmentUpload :multiple="false" />

<!-- 多文件上传 -->
<AttachmentUpload :multiple="true" />
```

### maxCount

- **类型**：`number`
- **默认值**：`undefined`（不限制）
- **说明**：最大文件数量

```vue
<!-- 最多 3 个文件 -->
<AttachmentUpload :max-count="3" />

<!-- 最多 10 个文件 -->
<AttachmentUpload :max-count="10" />
```

### disabled

- **类型**：`boolean`
- **默认值**：`false`
- **说明**：是否禁用上传

```vue
<AttachmentUpload :disabled="isDisabled" />
```

### uploadMode

- **类型**：`'dragger' | 'button'`
- **默认值**：`'dragger'`
- **说明**：上传模式

```vue
<!-- 拖拽卡片模式 -->
<AttachmentUpload upload-mode="dragger" />

<!-- 传统按钮模式 -->
<AttachmentUpload upload-mode="button" />
```

### listType

- **类型**：`'text' | 'picture-card'`
- **默认值**：`'text'`
- **说明**：文件列表展示类型

```vue
<!-- 文本列表模式 -->
<AttachmentUpload list-type="text" />

<!-- 图片卡片模式 -->
<AttachmentUpload list-type="picture-card" />
```

## Events 事件

### update:modelValue

文件列表变化时触发

```vue
<AttachmentUpload v-model="fileList" />
```

### change

文件列表变化时触发（与 update:modelValue 相同，提供额外的监听方式）

```vue
<AttachmentUpload @change="handleChange" />
```

```typescript
function handleChange(files: UploadResponse[]) {
  console.log('文件列表:', files);
}
```

## 完整示例

### 示例 1：图片上传（图片卡片模式）

```vue
<script setup lang="ts">
import type { UploadResponse } from '#/api/core/upload';
import { ref } from 'vue';
import { AttachmentUpload } from '#/components/AttachmentUpload';

const images = ref<UploadResponse[]>([]);

function handleChange(files: UploadResponse[]) {
  console.log('已上传图片:', files);
}
</script>

<template>
  <div class="upload-demo">
    <h3>图片上传</h3>
    <AttachmentUpload
      v-model="images"
      accept="image/*"
      :max-size="5"
      :max-count="6"
      list-type="picture-card"
      @change="handleChange"
    />
  </div>
</template>
```

### 示例 2：文档上传（文本列表模式）

```vue
<script setup lang="ts">
import type { UploadResponse } from '#/api/core/upload';
import { ref } from 'vue';
import { AttachmentUpload } from '#/components/AttachmentUpload';

const documents = ref<UploadResponse[]>([]);
</script>

<template>
  <div class="upload-demo">
    <h3>文档上传</h3>
    <AttachmentUpload
      v-model="documents"
      accept=".pdf,.doc,.docx"
      :max-size="10"
      list-type="text"
    />
  </div>
</template>
```

### 示例 3：单文件上传（按钮模式）

```vue
<script setup lang="ts">
import type { UploadResponse } from '#/api/core/upload';
import { ref } from 'vue';
import { AttachmentUpload } from '#/components/AttachmentUpload';

const file = ref<UploadResponse[]>([]);
</script>

<template>
  <div class="upload-demo">
    <h3>单文件上传</h3>
    <AttachmentUpload
      v-model="file"
      upload-mode="button"
      :multiple="false"
      :max-count="1"
      accept=".xlsx,.xls"
      :max-size="20"
    />
  </div>
</template>
```

### 示例 4：表单中使用

```vue
<script setup lang="ts">
import type { UploadResponse } from '#/api/core/upload';
import { reactive } from 'vue';
import { Form, FormItem, Input, Button } from 'ant-design-vue';
import { AttachmentUpload } from '#/components/AttachmentUpload';

const formData = reactive({
  title: '',
  description: '',
  attachments: [] as UploadResponse[],
});

function handleSubmit() {
  console.log('表单数据:', formData);
  // 提交表单
  // formData.attachments 包含了所有上传的文件信息
}
</script>

<template>
  <Form :model="formData" @submit="handleSubmit">
    <FormItem label="标题" required>
      <Input v-model:value="formData.title" />
    </FormItem>
    
    <FormItem label="描述">
      <Input v-model:value="formData.description" type="textarea" />
    </FormItem>
    
    <FormItem label="附件">
      <AttachmentUpload
        v-model="formData.attachments"
        accept="image/*,.pdf"
        :max-size="10"
        :max-count="5"
      />
    </FormItem>
    
    <FormItem>
      <Button type="primary" html-type="submit">提交</Button>
    </FormItem>
  </Form>
</template>
```

## 数据结构

### UploadResponse

上传成功后返回的文件信息：

```typescript
interface UploadResponse {
  filename: string;  // 原始文件名，如 "document.pdf"
  path: string;      // 存储路径，如 "A1B2/C3D4/E5F6/document.pdf"
  url: string;       // 访问URL，如 "http://example.com/s3/alumni/A1B2/..."
  type: string;      // MIME类型，如 "application/pdf"
  size: number | null; // 文件大小（字节）
}
```

## 样式自定义

组件使用了 CSS 变量 `hsl(var(--primary))` 作为主题色，可以通过修改主题色来自定义组件样式。

```css
/* 自定义主题色 */
:root {
  --primary: 220 90% 56%;
}
```

## 常见问题

### Q1：如何限制只允许上传图片？

```vue
<AttachmentUpload accept="image/*" />
```

### Q2：如何限制只允许上传 PDF？

```vue
<AttachmentUpload accept=".pdf" />
<!-- 或 -->
<AttachmentUpload accept="application/pdf" />
```

### Q3：如何实现单文件上传？

```vue
<AttachmentUpload :multiple="false" :max-count="1" />
```

### Q4：如何获取上传的文件路径？

```vue
<script setup lang="ts">
const fileList = ref<UploadResponse[]>([]);

// 获取所有文件的路径
const filePaths = computed(() => fileList.value.map(f => f.path));

// 获取所有文件的 URL
const fileUrls = computed(() => fileList.value.map(f => f.url));
</script>
```

### Q5：如何在编辑时回显已上传的文件？

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const fileList = ref<UploadResponse[]>([]);

// 从后端获取数据并回显
onMounted(async () => {
  const data = await fetchData();
  fileList.value = data.attachments; // 直接赋值即可
});
</script>

<template>
  <AttachmentUpload v-model="fileList" />
</template>
```

### Q6：组件报错 "Content-Type 'application/json' is not supported"

确保 `upload.ts` 中正确设置了 `Content-Type: undefined`：

```typescript
const response = await requestClient.post<UploadResponse>('/os/upload', formData, {
  headers: {
    'Content-Type': undefined, // 让浏览器自动设置
  },
});
```

## 最佳实践

### 1. 根据场景选择合适的模式

- **图片上传**：使用 `picture-card` + `dragger` 模式
- **文档上传**：使用 `text` + `dragger` 模式
- **表单附件**：使用 `text` + `button` 模式

### 2. 合理设置文件限制

```vue
<!-- 图片上传建议 -->
<AttachmentUpload
  accept="image/png,image/jpeg"
  :max-size="5"
  :max-count="10"
/>

<!-- 文档上传建议 -->
<AttachmentUpload
  accept=".pdf,.doc,.docx"
  :max-size="10"
  :max-count="5"
/>
```

### 3. 提供明确的提示信息

组件会自动显示文件类型、大小、数量限制的提示信息。

### 4. 使用 TypeScript 类型

```typescript
import type { UploadResponse } from '#/api/core/upload';

const fileList = ref<UploadResponse[]>([]);
```

## 相关文件

- **组件**：`.specify/templates/project/components/AttachmentUpload/`
- **Hooks**：`.specify/templates/project/hooks/useUpload.ts`
- **API**：`.specify/templates/project/api/upload.ts`
- **测试页面**：`apps/web-antd/src/views/system/attachment-test/index.vue`

## 技术支持

如遇问题，请参考：
1. API 接口文档：`docs/技术文档/API接口文档.md`
2. 开发规范：`.cursor/rules/templates-rules.mdc`
3. 组件示例：`apps/web-antd/src/views/system/attachment-test/index.vue`

