# 开发规范

本文档定义了使用本模板开发时应遵循的规范和最佳实践。

## 目录

- [代码风格](#代码风格)
- [Vue 组件规范](#vue-组件规范)
- [TypeScript 规范](#typescript-规范)
- [样式规范](#样式规范)
- [文件命名规范](#文件命名规范)
- [Git 提交规范](#git-提交规范)
- [测试规范](#测试规范)

## 代码风格

### 基本原则

1. **可读性优先**：代码应该易于理解和维护
2. **一致性**：保持代码风格的一致性
3. **简洁性**：避免过度设计，保持代码简洁
4. **注释**：关键逻辑和复杂算法需要添加注释

### 格式化工具

使用 ESLint + Prettier 保持代码风格一致：

```bash
# 安装
pnpm add -D eslint prettier eslint-plugin-vue eslint-config-prettier

# 运行
pnpm lint      # 检查代码
pnpm format    # 格式化代码
```

### 代码组织

#### 导入顺序

```typescript
// 1. Vue 核心
import { ref, reactive, computed, watch, onMounted } from 'vue';

// 2. 第三方库
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

// 3. 类型导入
import type { TableColumnsType } from 'ant-design-vue';
import type { User } from '@/types';

// 4. 组件导入
import { TableLayout } from '@/components/TableLayout';
import CustomTag from '@/components/CustomTag/index.vue';

// 5. API 导入
import { getUsers, createUser } from '@/api/user';

// 6. 工具函数
import { formatDate, formatMoney } from '@/utils';

// 7. 样式导入
import './styles.css';
```

#### 变量声明顺序

```typescript
// 1. Props
const props = defineProps<{
  title: string;
}>();

// 2. Emits
const emit = defineEmits<{
  change: [value: string];
}>();

// 3. 响应式数据
const loading = ref(false);
const dataSource = ref<User[]>([]);
const searchForm = reactive({
  keyword: '',
  page: 1,
});

// 4. 计算属性
const filteredData = computed(() => {
  return dataSource.value.filter((item) => item.active);
});

// 5. 方法
const fetchData = async () => {
  // 实现
};

const handleSearch = (keyword: string) => {
  // 实现
};

// 6. 生命周期和监听器
watch(
  () => props.title,
  (newVal) => {
    // 处理
  },
);

onMounted(() => {
  fetchData();
});
```

## Vue 组件规范

### 单文件组件结构

```vue
<script setup lang="ts">
// 脚本内容
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 样式内容 */
</style>
```

### 组件命名

- **文件名**：使用 PascalCase，如 `UserList.vue`
- **组件名**：使用 PascalCase，如 `<UserList />`
- **Props**：使用 camelCase 定义，模板中使用 kebab-case

```vue
<script setup lang="ts">
// Props 定义
const props = defineProps<{
  userName: string; // camelCase
}>();
</script>

<template>
  <!-- 模板中使用 kebab-case -->
  <User user-name="John" />
</template>
```

### Props 定义

优先使用 TypeScript 接口定义 Props：

```typescript
// ✅ 推荐
interface UserCardProps {
  userId: string;
  userName: string;
  userAvatar?: string;
}

const props = withDefaults(defineProps<UserCardProps>(), {
  userAvatar: '/default-avatar.png',
});

// ❌ 不推荐
const props = defineProps({
  userId: String,
  userName: String,
  userAvatar: {
    type: String,
    default: '/default-avatar.png',
  },
});
```

### Emits 定义

明确定义所有事件：

```typescript
// ✅ 推荐
interface UserCardEmits {
  (e: 'update:modelValue', value: string): void;
  (e: 'delete', userId: string): void;
  (e: 'edit', user: User): void;
}

const emit = defineEmits<UserCardEmits>();

// 使用
emit('delete', userId);
emit('edit', user);
```

### 组件通信

1. **父→子**：使用 Props
2. **子→父**：使用 Emits
3. **跨组件**：使用 Provide/Inject 或 Pinia
4. **兄弟组件**：通过父组件或 Pinia

```typescript
// Provide/Inject 示例
// 父组件
provide('userStore', userStore);

// 子组件
const userStore = inject<UserStore>('userStore');
```

## TypeScript 规范

### 类型定义

#### 使用 interface 而非 type

```typescript
// ✅ 推荐
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ 不推荐（除非需要联合类型）
type User = {
  id: string;
  name: string;
  email: string;
};
```

#### 避免使用 any

```typescript
// ❌ 不推荐
const data: any = await fetchData();

// ✅ 推荐
interface ApiResponse {
  code: number;
  message: string;
  data: User[];
}

const response: ApiResponse = await fetchData();
```

#### 类型导入

```typescript
// ✅ 推荐
import type { User } from '@/types';
import type { TableColumnsType } from 'ant-design-vue';

// ❌ 不推荐
import { User } from '@/types';
import { TableColumnsType } from 'ant-design-vue';
```

### 类型守卫

```typescript
function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string'
  );
}

const data = await fetchData();
if (isUser(data)) {
  // TypeScript 知道 data 是 User 类型
  console.log(data.name);
}
```

## 样式规范

### Tailwind CSS 优先

优先使用 Tailwind CSS 实用类：

```vue
<template>
  <!-- ✅ 推荐 -->
  <div class="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
    <span class="text-sm font-medium text-gray-700">内容</span>
  </div>

  <!-- ❌ 不推荐 -->
  <div class="custom-container">
    <span class="custom-text">内容</span>
  </div>
</template>

<style scoped>
.custom-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  /* ... */
}
</style>
```

### Scoped 样式

需要自定义样式时使用 `<style scoped>`：

```vue
<style scoped>
/* ✅ 正确：仅影响当前组件 */
.user-card {
  /* 自定义样式 */
}

/* ✅ 使用 :deep() 修改子组件样式 */
:deep(.ant-table-thead) {
  background-color: #f0f0f0;
}
</style>
```

### CSS 变量

使用 CSS 变量实现主题：

```css
:root {
  --primary: 217 91% 60%;
  --foreground: 222 47% 11%;
}

.dark {
  --primary: 217 91% 70%;
  --foreground: 213 31% 91%;
}
```

```vue
<template>
  <div class="bg-[hsl(var(--primary))] text-[hsl(var(--foreground))]">内容</div>
</template>
```

## 文件命名规范

### 目录结构

```
src/
├── components/          # 组件（PascalCase）
│   ├── UserCard/
│   │   ├── index.vue
│   │   └── index.ts
│   └── DataTable/
├── views/              # 页面（kebab-case）
│   ├── user-management/
│   └── system-settings/
├── api/                # API（kebab-case）
│   ├── user.ts
│   └── auth.ts
├── utils/              # 工具函数（kebab-case）
│   ├── date.ts
│   └── format.ts
├── types/              # 类型定义（kebab-case）
│   └── user.ts
└── stores/             # 状态管理（kebab-case）
    └── user.ts
```

### 命名规则

| 类型            | 命名方式                 | 示例                        |
| --------------- | ------------------------ | --------------------------- |
| 组件文件        | PascalCase               | `UserCard.vue`              |
| 组件目录        | PascalCase               | `UserCard/`                 |
| 页面文件        | kebab-case               | `user-management/index.vue` |
| TypeScript 文件 | kebab-case               | `user-api.ts`               |
| 类型文件        | kebab-case               | `user-types.ts`             |
| 工具函数文件    | kebab-case               | `date-utils.ts`             |
| 常量文件        | kebab-case 或 UPPER_CASE | `api-constants.ts`          |

## Git 提交规范

### Commit Message 格式

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（不是新功能也不是修复 Bug）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
# 新功能
git commit -m "feat(user): add user profile page"

# 修复 Bug
git commit -m "fix(table): fix pagination bug"

# 文档更新
git commit -m "docs: update README"

# 代码格式
git commit -m "style: format code with prettier"

# 重构
git commit -m "refactor(api): refactor user API structure"
```

### 分支命名

- `main` / `master`: 主分支
- `develop`: 开发分支
- `feature/xxx`: 功能分支
- `fix/xxx`: 修复分支
- `hotfix/xxx`: 紧急修复分支

## 测试规范

### 单元测试

使用 Vitest 进行单元测试：

```typescript
// user.test.ts
import { describe, it, expect } from 'vitest';
import { formatUserName } from '@/utils/user';

describe('formatUserName', () => {
  it('should format user name correctly', () => {
    expect(formatUserName('john')).toBe('John');
    expect(formatUserName('JOHN')).toBe('John');
  });

  it('should handle empty string', () => {
    expect(formatUserName('')).toBe('');
  });
});
```

### 组件测试

```typescript
// UserCard.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import UserCard from './UserCard.vue';

describe('UserCard', () => {
  it('renders user name', () => {
    const wrapper = mount(UserCard, {
      props: {
        userName: 'John Doe',
      },
    });
    expect(wrapper.text()).toContain('John Doe');
  });

  it('emits delete event', async () => {
    const wrapper = mount(UserCard, {
      props: {
        userId: '123',
        userName: 'John',
      },
    });

    await wrapper.find('.delete-btn').trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.[0]).toEqual(['123']);
  });
});
```

## 性能优化

### 1. 组件懒加载

```typescript
// 路由懒加载
const routes = [
  {
    path: '/user',
    component: () => import('@/views/user/index.vue'),
  },
];

// 组件懒加载
const UserDetail = defineAsyncComponent(() => import('./UserDetail.vue'));
```

### 2. 合理使用 computed

```typescript
// ✅ 推荐：使用 computed 缓存计算结果
const filteredUsers = computed(() => {
  return users.value.filter((user) => user.active);
});

// ❌ 不推荐：在模板中进行复杂计算
```

### 3. 避免不必要的响应式

```typescript
// ✅ 推荐：静态数据不使用 ref
const STATUS_OPTIONS = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

// ❌ 不推荐：不会变化的数据使用 ref
const statusOptions = ref([...]);
```

### 4. 使用 v-memo

对于大列表使用 `v-memo` 优化：

```vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.name]">
    <!-- 只有 item.id 或 item.name 变化时才重新渲染 -->
  </div>
</template>
```

## 错误处理

### API 错误处理

```typescript
const fetchData = async () => {
  loading.value = true;
  try {
    const result = await getUsers();
    dataSource.value = result.content;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    message.error('获取数据失败，请重试');
  } finally {
    loading.value = false;
  }
};
```

### 全局错误处理

```typescript
// main.ts
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  console.log('Component:', instance);
  console.log('Error info:', info);

  // 上报到监控系统
  reportError(err);
};
```

## 安全规范

### 1. XSS 防护

```vue
<!-- ✅ 安全：使用 v-text -->
<div v-text="userInput"></div>

<!-- ❌ 危险：使用 v-html -->
<div v-html="userInput"></div>

<!-- ✅ 必须使用 v-html 时，先清理 HTML -->
<div v-html="sanitizeHtml(userInput)"></div>
```

### 2. 敏感信息

```typescript
// ❌ 不要在代码中硬编码敏感信息
const API_KEY = 'sk-xxx';

// ✅ 使用环境变量
const API_KEY = import.meta.env.VITE_API_KEY;
```

### 3. 权限检查

```typescript
// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const token = localStorage.getItem('token');

  if (requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});
```

## 相关文档

- [主 README](../README.md)
- [组件使用指南](../components/README.md)
- [迁移指南](./migration-guide.md)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
