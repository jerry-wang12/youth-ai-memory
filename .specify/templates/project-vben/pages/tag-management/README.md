# 标签管理页面模板

这是一个完整的 CRUD 页面示例，展示了如何使用 TableLayout 组件和相关 API 创建一个功能完整的管理页面。

## 功能特性

- ✅ 列表展示
- 🔍 关键词搜索
- 🎛️ 类型筛选
- ➕ 新增标签
- ✏️ 编辑标签
- 🗑️ 删除标签
- 🔄 状态切换
- 📄 分页功能
- 🎨 实时预览

## 页面结构

### 1. 数据层

```typescript
// 搜索表单
const searchForm = reactive<TagQueryParams>({
  keyword: '',
  type: undefined,
  page: 1,
  size: 10,
});

// 表格数据
const dataSource = ref<Tag[]>([]);
const total = ref(0);
const loading = ref(false);
```

### 2. 配置层

```typescript
// 筛选字段配置
const filterFields: FilterField[] = [
  {
    key: 'type',
    type: 'select',
    label: '标签类型',
    options: [...],
  },
];

// 操作按钮配置
const actionButtons: ActionButton[] = [
  {
    text: '新增标签',
    icon: MdiPlus,
    type: 'primary',
    onClick: showCreateModal,
  },
];

// 表格列配置
const columns: TableColumnsType = [
  { title: '标签名称', dataIndex: 'name', key: 'name' },
  { title: '标签预览', key: 'preview' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action', fixed: 'right' },
];
```

### 3. 业务逻辑层

```typescript
// 获取数据
const fetchTagList = async () => {
  loading.value = true;
  try {
    const result = await getTags(searchForm);
    dataSource.value = result.content;
    total.value = result.page.totalElements;
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword;
  searchForm.page = 1;
  fetchTagList();
};

// 筛选处理
const handleFilter = (values: Record<string, any>) => {
  searchForm.type = values.type;
  searchForm.page = 1;
  fetchTagList();
};

// 新增/编辑
const handleSave = async () => {
  if (modalType.value === 'create') {
    await createTag(formData);
  } else {
    await updateTag({ objectId: currentTag.value.objectId, ...formData });
  }
  modalVisible.value = false;
  fetchTagList();
};

// 删除
const handleDelete = async (objectId: string) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个标签吗？',
    onOk: async () => {
      await deleteTag(objectId);
      fetchTagList();
    },
  });
};
```

### 4. 视图层

```vue
<template>
  <div class="tag-management-page">
    <!-- 表格布局 -->
    <TableLayout
      :columns="columns"
      :data-source="dataSource"
      :filter-fields="filterFields"
      :action-buttons="actionButtons"
      :total="total"
      :loading="loading"
      @search="handleSearch"
      @filter="handleFilter"
      @page-change="handlePageChange"
    >
      <!-- 自定义列内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'preview'">
          <CustomTag :name="record.name" :color="record.color" />
        </template>
        <template v-else-if="column.key === 'action'">
          <Button @click="showEditModal(record)">编辑</Button>
          <Button @click="handleDelete(record.objectId)">删除</Button>
        </template>
      </template>
    </TableLayout>

    <!-- 编辑弹窗 -->
    <Modal v-model:open="modalVisible" @ok="handleSave">
      <Form :model="formData">
        <!-- 表单字段 -->
      </Form>
    </Modal>
  </div>
</template>
```

## 如何使用此模板

### 1. 复制页面文件

```bash
cp pages/tag-management/index.vue src/views/your-module/index.vue
```

### 2. 修改导入路径

替换组件和 API 的导入路径：

```typescript
// 修改前
import { createTag, getTags } from '../../api/tags';
import { TableLayout } from '../../components/TableLayout';

// 修改后
import { createTag, getTags } from '@/api/tags';
import { TableLayout } from '@/components/TableLayout';
```

### 3. 替换图标

将占位符图标替换为实际图标：

```typescript
// 修改前
import { MdiPlus } from '../../icons/placeholder';

// 修改后
import MdiPlus from '~icons/mdi/plus';
```

### 4. 调整业务逻辑

根据实际业务需求调整：

1. **数据结构**：修改 `Tag` 接口定义
2. **API 接口**：修改 API 调用和参数
3. **表格列**：调整 `columns` 配置
4. **筛选字段**：调整 `filterFields` 配置
5. **表单字段**：调整弹窗中的表单

### 5. 添加路由

在路由配置中添加页面：

```typescript
// router/index.ts
{
  path: '/tag-management',
  name: 'TagManagement',
  component: () => import('@/views/tag-management/index.vue'),
  meta: { title: '标签管理' },
}
```

## 核心功能说明

### 搜索功能

使用 TableLayout 的搜索功能：

```typescript
const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword || undefined;
  searchForm.page = 1;
  fetchTagList();
};
```

**注意事项：**

- 搜索时重置页码为 1
- 空字符串应设为 undefined

### 筛选功能

配置筛选字段：

```typescript
const filterFields: FilterField[] = [
  {
    key: 'type', // 字段键
    type: 'select', // 字段类型
    label: '标签类型', // 字段标签
    placeholder: '选择类型', // 占位符
    options: [
      // 选项（select 类型）
      { label: '系统', value: 'SYS' },
      { label: '自定义', value: 'CUSTOM' },
    ],
  },
];
```

**支持的字段类型：**

- `input` - 输入框
- `select` - 下拉选择
- `dateRange` - 日期范围
- `rangePicker` - 时间范围选择器
- `switch` - 开关
- `input-number` - 数字输入框

### 分页功能

处理分页变更：

```typescript
const handlePageChange = (page: number, pageSize: number) => {
  searchForm.page = page;
  searchForm.size = pageSize;
  fetchTagList();
};
```

**注意事项：**

- 前端页码从 1 开始
- 后端页码从 0 开始
- 需要在请求时转换：`params.page = (searchForm.page || 1) - 1`

### 自定义表格列

使用 `bodyCell` 插槽自定义列内容：

```vue
<template #bodyCell="{ column, record }">
  <template v-if="column.key === 'custom'">
    <!-- 自定义内容 -->
  </template>
</template>
```

### 表单验证

添加表单验证规则：

```typescript
const rules = {
  name: [
    { required: true, message: '请输入标签名称' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
  ],
  type: [{ required: true, message: '请选择标签类型' }],
};
```

## 最佳实践

### 1. 错误处理

使用 try-catch 处理异步错误：

```typescript
const fetchData = async () => {
  loading.value = true;
  try {
    const result = await getTags(params);
    dataSource.value = result.content;
  } catch (error) {
    message.error('获取数据失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};
```

### 2. 加载状态

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

### 3. 数据刷新

操作成功后刷新列表：

```typescript
const handleSave = async () => {
  await createTag(formData);
  message.success('创建成功');
  modalVisible.value = false;
  fetchTagList(); // 刷新列表
};
```

### 4. 确认对话框

危险操作使用确认对话框：

```typescript
const handleDelete = (id: string) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除吗？此操作不可恢复。',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await deleteTag(id);
      message.success('删除成功');
      fetchTagList();
    },
  });
};
```

### 5. 表单重置

切换新增/编辑模式时重置表单：

```typescript
const showCreateModal = () => {
  modalType.value = 'create';
  Object.assign(formData, defaultFormData);
  modalVisible.value = true;
};

const showEditModal = (record: Tag) => {
  modalType.value = 'edit';
  Object.assign(formData, {
    name: record.name,
    type: record.type,
    // ... 其他字段
  });
  modalVisible.value = true;
};
```

## 常见问题

### Q: 搜索后分页不正确？

A: 搜索时需要重置页码：

```typescript
const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword;
  searchForm.page = 1; // 重置页码
  fetchTagList();
};
```

### Q: 表格列宽度不合适？

A: 在 columns 配置中设置宽度：

```typescript
const columns = [
  { title: '名称', dataIndex: 'name', width: 150 },
  { title: '描述', dataIndex: 'desc', ellipsis: true }, // 超长省略
  { title: '操作', key: 'action', width: 150, fixed: 'right' }, // 固定列
];
```

### Q: 如何添加多选功能？

A: 使用 rowSelection 配置：

```typescript
const selectedRowKeys = ref<string[]>([]);

const rowSelection = {
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
};
```

```vue
<TableLayout :row-selection="rowSelection" />
```

### Q: 如何实现导出功能？

A: 添加导出按钮：

```typescript
const actionButtons: ActionButton[] = [
  {
    text: '导出',
    icon: MdiDownload,
    onClick: async () => {
      const data = await exportTags(searchForm);
      downloadFile(data, 'tags.xlsx');
    },
  },
];
```

## 相关文档

- [TableLayout 组件文档](../docs/table-generation-guide.md)
- [API 使用说明](../../api/README.md)
- [组件使用指南](../../components/README.md)
- [开发规范](../docs/development-guide.md)
