# API 层使用指南

## 概述

本目录包含 API 接口定义和使用示例。所有 API 模块都采用 TypeScript 编写，提供完整的类型定义和文档注释。

## 文件结构

```
api/
├── tags.ts         # 标签管理 API 示例
└── README.md       # 本文件
```

## 使用前准备

### 1. 配置请求客户端

在使用 API 模块之前，需要先配置项目的请求客户端。

#### 方式一：使用 Axios

```typescript
// utils/request.ts
import axios from 'axios';

const requestClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
requestClient.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
requestClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 统一错误处理
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

export { requestClient };
```

#### 方式二：使用自定义 Fetch 封装

```typescript
// utils/request.ts
interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

class RequestClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(url: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get(url: string, config?: RequestOptions): Promise<any> {
    const queryString = config?.params
      ? '?' + new URLSearchParams(config.params).toString()
      : '';
    return this.request(`${url}${queryString}`, { method: 'GET' });
  }

  async post(url: string, data?: any): Promise<any> {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch(url: string, data?: any): Promise<any> {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(url: string): Promise<any> {
    return this.request(url, { method: 'DELETE' });
  }
}

export const requestClient = new RequestClient(
  import.meta.env.VITE_API_BASE_URL,
);
```

### 2. 修改 API 模块

在 `tags.ts` 文件顶部，替换请求客户端导入：

```typescript
// 原代码（占位符）
declare const requestClient: {
  // ...
};

// 替换为实际导入
import { requestClient } from '@/utils/request';
```

## API 使用示例

### 基本用法

```typescript
import { getTags, createTag, updateTag, deleteTag } from '@/api/tags';

// 获取标签列表
const fetchTags = async () => {
  try {
    const result = await getTags({
      keyword: '重要',
      page: 0,
      size: 10,
    });
    console.log('标签列表:', result.content);
    console.log('总数:', result.page.totalElements);
  } catch (error) {
    console.error('获取失败:', error);
  }
};

// 创建标签
const addTag = async () => {
  try {
    const newTag = await createTag({
      name: '重要学生',
      type: 'CUSTOM',
      color: '#FF0000',
      icon: 'MdiFlag',
      description: '需要特别关注的学生',
    });
    console.log('创建成功:', newTag);
  } catch (error) {
    console.error('创建失败:', error);
  }
};

// 更新标签
const modifyTag = async (tagId: string) => {
  try {
    const updatedTag = await updateTag({
      objectId: tagId,
      name: '重要学生（已修改）',
      enabled: true,
    });
    console.log('更新成功:', updatedTag);
  } catch (error) {
    console.error('更新失败:', error);
  }
};

// 删除标签
const removeTag = async (tagId: string) => {
  try {
    await deleteTag(tagId);
    console.log('删除成功');
  } catch (error) {
    console.error('删除失败:', error);
  }
};
```

### 在组件中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTags } from '@/api/tags';
import type { Tag } from '@/api/tags';

const tags = ref<Tag[]>([]);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const result = await getTags({ page: 0, size: 20 });
    tags.value = result.content;
  } catch (error) {
    console.error('获取数据失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else>
    <div v-for="tag in tags" :key="tag.objectId">
      {{ tag.name }}
    </div>
  </div>
</template>
```

## 错误处理最佳实践

### 1. 统一错误处理

```typescript
// utils/error-handler.ts
import { message } from 'ant-design-vue';

export function handleApiError(error: any, defaultMessage = '操作失败') {
  if (error.response) {
    // 服务器返回错误状态码
    const status = error.response.status;
    const errorMessage = error.response.data?.message || defaultMessage;

    switch (status) {
      case 400:
        message.error('请求参数错误');
        break;
      case 401:
        message.error('未授权，请重新登录');
        // 跳转到登录页
        break;
      case 403:
        message.error('权限不足');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
        message.error('服务器内部错误');
        break;
      default:
        message.error(errorMessage);
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    message.error('网络连接失败，请检查网络');
  } else {
    // 其他错误
    message.error(error.message || defaultMessage);
  }

  console.error('API Error:', error);
}
```

### 2. 在组件中使用错误处理

```typescript
import { handleApiError } from '@/utils/error-handler';
import { getTags } from '@/api/tags';

const fetchData = async () => {
  try {
    const result = await getTags({ page: 0, size: 10 });
    // 处理成功响应
  } catch (error) {
    handleApiError(error, '获取标签列表失败');
  }
};
```

## 类型定义

所有 API 模块都提供完整的 TypeScript 类型定义：

```typescript
import type {
  Tag,
  TagListResponse,
  CreateTagParams,
  UpdateTagParams,
  TagQueryParams,
  PageInfo,
} from '@/api/tags';
```

## 接口适配

如果后端 API 接口与模板不一致，需要进行适配：

### 1. 修改接口路径

```typescript
// 原代码
export async function getTags(
  params?: TagQueryParams,
): Promise<TagListResponse> {
  return requestClient.get('/tags', { params });
}

// 修改为实际接口路径
export async function getTags(
  params?: TagQueryParams,
): Promise<TagListResponse> {
  return requestClient.get('/api/v1/tags', { params });
}
```

### 2. 数据转换

```typescript
export async function getTags(
  params?: TagQueryParams,
): Promise<TagListResponse> {
  // 请求参数转换
  const requestParams = {
    ...params,
    // 假设后端使用 pageNum 而不是 page
    pageNum: params?.page,
    pageSize: params?.size,
  };
  delete requestParams.page;
  delete requestParams.size;

  const response = await requestClient.get('/tags', { params: requestParams });

  // 响应数据转换
  return {
    content: response.data.list, // 假设后端返回的是 data.list
    page: {
      size: response.data.pageSize,
      number: response.data.pageNum,
      totalElements: response.data.total,
      totalPages: Math.ceil(response.data.total / response.data.pageSize),
    },
  };
}
```

## 环境变量配置

在项目根目录创建环境变量文件：

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://api.yourapp.com
```

## 注意事项

1. **类型安全**：始终使用 TypeScript 类型定义，避免使用 `any`
2. **错误处理**：每个 API 调用都应该包含 try-catch 错误处理
3. **加载状态**：在请求过程中显示加载状态，提升用户体验
4. **请求取消**：对于可能快速重复的请求（如搜索），考虑使用请求取消机制
5. **缓存策略**：对于不常变化的数据，可以考虑使用缓存
6. **接口文档**：保持 API 接口文档与后端保持同步

## 扩展阅读

- [Axios 文档](https://axios-http.com/)
- [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [TypeScript 类型系统](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
