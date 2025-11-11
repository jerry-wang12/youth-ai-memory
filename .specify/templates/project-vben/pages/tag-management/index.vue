<script lang="ts" setup>
/**
 * 标签管理页面模板
 *
 * 这是一个完整的 CRUD 页面示例，展示了：
 * - TableLayout 组件的使用
 * - 搜索、筛选、分页功能
 * - 新增、编辑、删除操作
 * - 表单验证和数据处理
 *
 * TODO 列表：
 * 1. 修改 API 导入路径
 * 2. 修改组件导入路径
 * 3. 修改图标导入路径
 * 4. 根据实际业务调整数据结构
 * 5. 调整表格列配置
 * 6. 调整筛选字段配置
 */
import type { TableColumnsType } from 'ant-design-vue';

// TODO: 修改为您项目中的实际类型导入
import type {
  CreateTagParams,
  Tag,
  TagListResponse,
  TagQueryParams,
  UpdateTagParams,
} from '../../api/tags';
// TODO: 修改为您项目中的实际组件导入
import type {
  ActionButton,
  FilterField,
} from '../../components/TableLayout/TableHeader';

import { reactive, ref } from 'vue';

import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
} from 'ant-design-vue';

// TODO: 修改为您项目中的实际 API 导入
import { createTag, deleteTag, getTags, updateTag } from '../../api/tags';
// TODO: 修改为您项目中的实际组件导入
import CustomTag from '../../components/CustomTag/index.vue';
import { TableLayout } from '../../components/TableLayout';
// TODO: 修改为您项目中的实际图标导入
import {
  MdiBell,
  MdiCheckCircle,
  MdiFlag,
  MdiHome,
  MdiInformation,
  MdiPlus,
  MdiRobot,
  MdiStudent,
  MdiUser,
} from '../../icons/placeholder';

// ==================== 搜索表单 ====================
const searchForm = reactive<TagQueryParams>({
  keyword: '',
  type: undefined,
  page: 1,
  size: 10,
});

// ==================== 筛选配置 ====================
const filterFields: FilterField[] = [
  {
    key: 'type',
    type: 'select',
    label: '标签类型',
    placeholder: '选择标签类型',
    options: [
      { label: '系统标签', value: 'SYS' },
      { label: '自定义标签', value: 'CUSTOM' },
    ],
  },
];

// ==================== 表格数据 ====================
const loading = ref(false);
const dataSource = ref<Tag[]>([]);
const total = ref(0);

// ==================== 弹窗相关 ====================
const modalVisible = ref(false);
const modalType = ref<'create' | 'edit'>('create');
const currentTag = ref<null | Tag>(null);

// ==================== 表单数据 ====================
const formData = reactive<CreateTagParams>({
  name: '',
  type: 'CUSTOM',
  color: '#33CC99',
  icon: '',
  description: '',
});

// ==================== 预设配置 ====================
// 预设颜色 - Web安全色
const presetColors = [
  '#33CC99', // 青绿色
  '#3399FF', // 亮蓝色
  '#33CC33', // 亮绿色
  '#FF6633', // 橙色
  '#CC33CC', // 紫色
  '#FFCC33', // 黄色
  '#FF3399', // 粉红色
  '#66CCFF', // 浅蓝色
];

// 预设图标 - 使用实际图标组件
const presetIcons = [
  { value: 'MdiCheckCircle', label: '勾选', component: MdiCheckCircle },
  { value: 'MdiFlag', label: '旗帜', component: MdiFlag },
  { value: 'MdiBell', label: '铃铛', component: MdiBell },
  { value: 'MdiHome', label: '房子', component: MdiHome },
  { value: 'MdiInformation', label: '信息', component: MdiInformation },
  { value: 'MdiRobot', label: '机器人', component: MdiRobot },
  { value: 'MdiStudent', label: '学生', component: MdiStudent },
  { value: 'MdiUser', label: '用户', component: MdiUser },
];

// 获取图标组件
const getIconComponent = (iconValue: string) => {
  const icon = presetIcons.find((item) => item.value === iconValue);
  return icon ? icon.component : null;
};

// ==================== 表格列定义 ====================
const columns: TableColumnsType<Tag> = [
  {
    title: '标签名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '标签预览',
    key: 'preview',
    width: 120,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    width: 240,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
];

// ==================== 数据获取 ====================
const fetchTagList = async () => {
  loading.value = true;
  try {
    // 过滤掉空值参数
    const params: TagQueryParams = {};
    if (searchForm.keyword) params.keyword = searchForm.keyword;
    if (searchForm.type) params.type = searchForm.type;
    // 前端页码从1开始，后端从0开始，需要转换
    params.page = (searchForm.page || 1) - 1;
    params.size = searchForm.size;

    const result: TagListResponse = await getTags(params);
    dataSource.value = result.content || [];
    total.value = result.page?.totalElements || 0;
  } catch (error) {
    message.error('获取标签列表失败');
    console.error('获取标签列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// ==================== 事件处理 ====================
// 处理搜索事件
const handleSearch = (keyword: string) => {
  searchForm.keyword = keyword || undefined;
  searchForm.page = 1;
  fetchTagList();
};

// 处理筛选事件
const handleFilter = (values: Record<string, any>) => {
  searchForm.type = values.type || undefined;
  searchForm.page = 1;
  fetchTagList();
};

// 处理刷新事件
const handleRefresh = () => {
  fetchTagList();
};

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    type: undefined,
    page: 1,
    size: 10,
  });
  fetchTagList();
};

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  searchForm.page = page;
  searchForm.size = pageSize;
  fetchTagList();
};

// ==================== 操作按钮配置 ====================
const actionButtons: ActionButton[] = [
  {
    text: '新增标签',
    icon: MdiPlus,
    type: 'primary',
    onClick: () => {
      modalType.value = 'create';
      currentTag.value = null;
      Object.assign(formData, {
        name: '',
        type: 'CUSTOM',
        color: '#33CC99',
        icon: '',
        description: '',
      });
      modalVisible.value = true;
    },
  },
];

// ==================== 编辑操作 ====================
const showEditModal = (record: Tag) => {
  modalType.value = 'edit';
  currentTag.value = record;
  Object.assign(formData, {
    name: record.name,
    type: record.type,
    color: record.color,
    icon: record.icon || '',
    description: record.description || '',
  });
  modalVisible.value = true;
};

// ==================== 保存操作 ====================
const handleSave = async () => {
  try {
    if (modalType.value === 'create') {
      await createTag(formData);
      message.success('创建成功');
    } else {
      const updateData: UpdateTagParams = {
        objectId: currentTag.value!.objectId,
        ...formData,
      };
      await updateTag(updateData);
      message.success('更新成功');
    }
    modalVisible.value = false;
    fetchTagList();
  } catch (error) {
    message.error('保存失败');
    console.error('保存失败:', error);
  }
};

// ==================== 删除操作 ====================
const handleDelete = async (objectId: string) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个标签吗？',
    onOk: async () => {
      try {
        await deleteTag(objectId);
        message.success('删除成功');
        fetchTagList();
      } catch (error) {
        message.error('删除失败');
        console.error('删除失败:', error);
      }
    },
  });
};

// ==================== 切换状态 ====================
const handleToggleStatus = async (record: Tag) => {
  try {
    const updateData: UpdateTagParams = {
      objectId: record.objectId,
      name: record.name,
      description: record.description,
      color: record.color,
      icon: record.icon,
      type: record.type,
      enabled: !record.enabled,
    };
    await updateTag(updateData);
    message.success('状态更新成功');
    fetchTagList();
  } catch (error) {
    message.error('状态更新失败');
    console.error('状态更新失败:', error);
  }
};

// ==================== 辅助函数 ====================
const getTypeText = (type: string) => {
  return type === 'SYS' ? '系统标签' : '自定义标签';
};

// 初始化加载数据
fetchTagList();
</script>

<template>
  <!-- 
    ⚠️ 重要：必须使用根容器元素包裹 TableLayout，避免 Vue Transition 警告
    推荐使用具有语义的类名，如：page-container、xxx-page 等
  -->
  <div class="tag-management-page">
    <TableLayout
      :action-buttons="actionButtons"
      :columns="columns"
      :current="searchForm.page"
      :data-source="dataSource"
      :filter-fields="filterFields"
      :loading="loading"
      :page-size="searchForm.size"
      :search-value="searchForm.keyword"
      :total="total"
      row-key="objectId"
      search-placeholder="搜索标签..."
      size="small"
      title="标签管理"
      @filter="handleFilter"
      @page-change="handlePageChange"
      @refresh="handleRefresh"
      @reset="handleReset"
      @search="handleSearch"
    >
      <!-- 自定义表格列内容 -->
      <template #bodyCell="{ column, record }">
        <!-- 标签预览列 -->
        <template v-if="column.key === 'preview'">
          <CustomTag
            :id="record.objectId"
            :color="record.color"
            :icon-component="
              record.icon ? getIconComponent(record.icon) : undefined
            "
            :name="record.name"
            :type="record.type"
          />
        </template>

        <!-- 类型列 -->
        <template v-else-if="column.key === 'type'">
          {{ getTypeText(record.type) }}
        </template>

        <!-- 状态列 -->
        <template v-else-if="column.key === 'status'">
          <Switch
            :checked="record.enabled"
            size="small"
            @change="() => handleToggleStatus(record as Tag)"
          />
        </template>

        <!-- 操作列 -->
        <template v-else-if="column.key === 'action'">
          <Space size="small">
            <Button
              class="p-0 text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/0.8)]"
              size="small"
              type="link"
              @click="showEditModal(record as Tag)"
            >
              编辑
            </Button>
            <Button
              class="p-0 text-red-600 hover:text-red-800"
              danger
              size="small"
              type="link"
              @click="handleDelete(record.objectId)"
            >
              删除
            </Button>
          </Space>
        </template>
      </template>
    </TableLayout>

    <!-- 新增/编辑弹窗 -->
    <Modal
      v-model:open="modalVisible"
      :title="modalType === 'create' ? '新增标签' : '编辑标签'"
      width="600px"
      @ok="handleSave"
    >
      <Form :model="formData" class="mt-4" layout="vertical">
        <Row :gutter="16">
          <Col :span="12">
            <Form.Item label="标签名称" required>
              <Input
                v-model:value="formData.name"
                placeholder="请输入标签名称"
              />
            </Form.Item>
          </Col>
          <Col :span="12">
            <Form.Item label="标签类型" required>
              <Select v-model:value="formData.type" placeholder="请选择类型">
                <Select.Option value="CUSTOM">自定义标签</Select.Option>
                <Select.Option value="SYS">系统标签</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col :span="12">
            <Form.Item label="标签颜色">
              <div class="flex items-center gap-2">
                <Input
                  v-model:value="formData.color"
                  style="
                    width: 60px;
                    height: 32px;
                    padding: 0;
                    border-radius: 6px;
                  "
                  type="color"
                />
                <div class="flex gap-1">
                  <div
                    v-for="color in presetColors"
                    :key="color"
                    :style="{ backgroundColor: color }"
                    class="h-6 w-6 cursor-pointer rounded border border-gray-200"
                    @click="formData.color = color"
                  ></div>
                </div>
              </div>
            </Form.Item>
          </Col>
          <Col :span="12">
            <Form.Item label="标签图标">
              <Select
                v-model:value="formData.icon"
                allow-clear
                placeholder="请选择图标"
              >
                <Select.Option
                  v-for="icon in presetIcons"
                  :key="icon.value"
                  :value="icon.value"
                >
                  <div class="flex items-center gap-2">
                    <component :is="icon.component" class="text-base" />
                    <span>{{ icon.label }}</span>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="标签描述">
          <Input.TextArea
            v-model:value="formData.description"
            :rows="3"
            placeholder="请输入标签描述"
          />
        </Form.Item>

        <!-- 标签预览 -->
        <Form.Item label="标签预览">
          <CustomTag
            :color="formData.color"
            :icon-component="
              formData.icon ? getIconComponent(formData.icon) : undefined
            "
            :name="formData.name || '标签名称'"
            :type="formData.type"
          />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<style scoped>
/* 弹窗样式优化 */
:deep(.ant-modal-body) {
  padding: 16px 24px !important;
}
</style>
