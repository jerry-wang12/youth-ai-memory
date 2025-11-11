# 页面模板

本目录包含完整的页面模板示例，展示了如何使用组件库创建功能完整的管理页面。

## 页面列表

### tag-management - 标签管理

完整的 CRUD 页面示例，包含：

- 列表展示
- 搜索筛选
- 新增编辑
- 删除操作
- 状态切换

**查看详情：** [`tag-management/README.md`](./tag-management/README.md)

## 页面结构模板

### 基本结构

```vue
<script lang="ts" setup>
/**
 * 页面名称
 *
 * 功能说明：
 * - 功能1
 * - 功能2
 * - 功能3
 */

// 1. 导入依赖
import type { TableColumnsType } from 'ant-design-vue';
import { reactive, ref } from 'vue';

// 2. 导入组件和API
import { TableLayout } from '@/components/TableLayout';
import { getData, createData, updateData, deleteData } from '@/api/module';

// 3. 定义数据
const searchForm = reactive({
  keyword: '',
  page: 1,
  size: 10,
});

const dataSource = ref([]);
const total = ref(0);
const loading = ref(false);

// 4. 定义配置
const columns: TableColumnsType = [...];
const filterFields = [...];
const actionButtons = [...];

// 5. 定义方法
const fetchData = async () => {
  // 获取数据
};

const handleSearch = (keyword: string) => {
  // 处理搜索
};

const handleCreate = () => {
  // 处理新增
};

// 6. 初始化
fetchData();
</script>

<template>
  <!-- ⚠️ 必须使用根容器 -->
  <div class="page-container">
    <TableLayout
      :columns="columns"
      :data-source="dataSource"
      :filter-fields="filterFields"
      :action-buttons="actionButtons"
      :total="total"
      :loading="loading"
      title="页面标题"
      @search="handleSearch"
    >
      <!-- 自定义列内容 -->
      <template #bodyCell="{ column, record }">
        <!-- 自定义内容 -->
      </template>
    </TableLayout>
  </div>
</template>

<style scoped>
/* 页面特定样式 */
</style>
```

## 页面开发流程

### 1. 创建页面文件

```bash
# 创建页面目录
mkdir src/views/your-module

# 创建页面文件
touch src/views/your-module/index.vue
```

### 2. 定义数据结构

```typescript
// 定义数据接口
interface DataItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// 定义搜索参数
interface SearchParams {
  keyword?: string;
  status?: string;
  page: number;
  size: number;
}
```

### 3. 配置表格列

```typescript
const columns: TableColumnsType<DataItem> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
];
```

### 4. 配置筛选字段

```typescript
const filterFields: FilterField[] = [
  {
    key: 'status',
    type: 'select',
    label: '状态',
    placeholder: '选择状态',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
  {
    key: 'dateRange',
    type: 'rangePicker',
    label: '创建时间',
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
  },
];
```

### 5. 实现业务逻辑

```typescript
// 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    const params = {
      ...searchForm,
      page: (searchForm.page || 1) - 1, // 转换页码
    };
    const result = await getData(params);
    dataSource.value = result.content;
    total.value = result.page.totalElements;
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword;
  searchForm.page = 1;
  fetchData();
};

// 筛选处理
const handleFilter = (values: Record<string, any>) => {
  Object.assign(searchForm, values);
  searchForm.page = 1;
  fetchData();
};
```

### 6. 添加操作按钮

```typescript
const actionButtons: ActionButton[] = [
  {
    text: '新增',
    icon: MdiPlus,
    type: 'primary',
    onClick: () => {
      // 新增逻辑
    },
  },
  {
    text: '导出',
    icon: MdiDownload,
    onClick: () => {
      // 导出逻辑
    },
  },
];
```

### 7. 自定义表格列

```vue
<template #bodyCell="{ column, record }">
  <!-- 状态列 -->
  <template v-if="column.key === 'status'">
    <a-tag :color="record.status === 'active' ? 'green' : 'red'">
      {{ record.status === 'active' ? '启用' : '禁用' }}
    </a-tag>
  </template>

  <!-- 操作列 -->
  <template v-else-if="column.key === 'action'">
    <a-space size="small">
      <a-button type="link" @click="handleEdit(record)">编辑</a-button>
      <a-button type="link" danger @click="handleDelete(record.id)">
        删除
      </a-button>
    </a-space>
  </template>
</template>
```

## 页面类型

### 1. 列表页面

标准的 CRUD 列表页面，使用 TableLayout 组件。

**示例：** [`tag-management/index.vue`](./tag-management/index.vue)

### 2. 详情页面

使用 DetailModal 组件展示详细信息。

```vue
<script setup>
import { DetailModal } from '@/components/DetailModal';

const visible = ref(false);
const detail = ref({});

const showDetail = async (id: string) => {
  const data = await getDetail(id);
  detail.value = data;
  visible.value = true;
};
</script>

<template>
  <DetailModal v-model:visible="visible" :header="detailHeader">
    <template #content>
      <!-- 详情内容 -->
    </template>
  </DetailModal>
</template>
```

### 3. 表单页面

使用 Ant Design Vue Form 组件。

```vue
<script setup>
import { Form, Input, Button } from 'ant-design-vue';

const formRef = ref();
const formData = reactive({
  name: '',
  description: '',
});

const handleSubmit = async () => {
  await formRef.value.validate();
  await saveData(formData);
  message.success('保存成功');
};
</script>

<template>
  <div class="form-page">
    <Form ref="formRef" :model="formData" layout="vertical">
      <Form.Item label="名称" name="name" :rules="[{ required: true }]">
        <Input v-model:value="formData.name" />
      </Form.Item>
      <Form.Item label="描述" name="description">
        <Input.TextArea v-model:value="formData.description" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" @click="handleSubmit">提交</Button>
      </Form.Item>
    </Form>
  </div>
</template>
```

## 最佳实践

### 1. 根容器

所有页面都必须有根容器元素：

```vue
<template>
  <div class="page-container">
    <!-- 页面内容 -->
  </div>
</template>
```

### 2. 数据获取

在 `onMounted` 或脚本末尾获取初始数据：

```typescript
// 方式1：脚本末尾
fetchData();

// 方式2：onMounted
onMounted(() => {
  fetchData();
});
```

### 3. 错误处理

所有异步操作都应该有错误处理：

```typescript
try {
  await someAsyncOperation();
  message.success('操作成功');
} catch (error) {
  message.error('操作失败');
  console.error(error);
}
```

### 4. 加载状态

显示加载状态提升用户体验：

```typescript
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    // 请求数据
  } finally {
    loading.value = false;
  }
};
```

### 5. 分页同步

搜索和筛选时重置页码：

```typescript
const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword;
  searchForm.page = 1; // ← 重要
  fetchData();
};
```

## 常见问题

### Q: 页面不显示？

A: 检查是否添加了根容器元素。

### Q: 路由跳转后页面白屏？

A: 检查路由配置和组件导入是否正确。

### Q: 表格数据不更新？

A: 确保使用 `ref` 或 `reactive` 包裹数据，并正确赋值。

### Q: 分页不正确？

A: 检查前后端页码起始值是否一致，需要时进行转换。

## 相关文档

- [组件使用指南](../components/README.md)
- [TableLayout 文档](../docs/table-generation-guide.md)
- [DetailModal 文档](../docs/detail-modal-guide.md)
- [API 使用说明](../api/README.md)
- [开发规范](../docs/development-guide.md)
