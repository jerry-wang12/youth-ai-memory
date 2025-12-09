<script setup lang="ts">
/**
 * FilterForm 组件
 *
 * 通用的筛选表单组件，支持多种字段类型
 *
 * 主要特性：
 * - 📝 支持 input、select、date、dateRange 等字段类型
 * - 📱 支持展开/收缩功能
 * - 🎨 响应式布局设计
 * - 🔄 内置搜索、重置、刷新功能
 */
import { computed, reactive, ref } from 'vue';

import {
  Button,
  DatePicker,
  Input,
  RangePicker,
  Select,
  SelectOption,
} from 'ant-design-vue';

// TODO: 导入您项目中的图标组件
// 需要导入：MdiChevronDown, MdiChevronUp, MdiRefresh
// 示例：import { MdiChevronDown, MdiChevronUp, MdiRefresh } from '#/icons';
import { MdiChevronDown, MdiChevronUp, MdiRefresh } from '../../icons/placeholder';

export interface FilterField {
  key: string;
  type: 'date' | 'dateRange' | 'input' | 'select';
  label: string;
  placeholder?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  multiple?: boolean;
  width?: string;
  // RangePicker 相关配置
  showTime?: boolean;
  format?: string;
  style?: Record<string, any>;
  rangePresets?: Array<{
    label: string;
    value: any[];
  }>;
}

interface FilterFormProps {
  loading?: boolean;
  fields?: FilterField[];
  maxCollapsedItems?: number;
  collapsible?: boolean;
}

interface FilterFormEmits {
  (e: 'search', params: Record<string, any>): void;
  (e: 'reset'): void;
  (e: 'refresh'): void;
}

const props = withDefaults(defineProps<FilterFormProps>(), {
  loading: false,
  fields: () => [],
  maxCollapsedItems: 4,
  collapsible: true,
});

const emit = defineEmits<FilterFormEmits>();

// 动态筛选参数
const filterValues = reactive<Record<string, any>>({});

// 展开/收缩状态
const isExpanded = ref(false);

// 初始化筛选值
const initFilterValues = () => {
  props.fields.forEach((field) => {
    if (field.type === 'select' && field.multiple) {
      filterValues[field.key] = [];
    } else if (field.type === 'dateRange') {
      // 支持 RangePicker 数组格式
      filterValues[field.key] = [];
    } else {
      filterValues[field.key] =
        field.type === 'select' && field.multiple ? [] : '';
    }
  });
};

// 计算显示的字段数量
const displayFieldsCount = computed(() => {
  return props.fields.length;
});

// 判断是否需要显示展开/收缩按钮
const shouldShowToggle = computed(() => {
  return (
    props.collapsible && displayFieldsCount.value > props.maxCollapsedItems
  );
});

// 计算收缩状态下显示的字段
const collapsedFields = computed(() => {
  return props.fields.slice(0, props.maxCollapsedItems);
});

// 处理搜索
const handleSearch = () => {
  const params: Record<string, any> = {};

  props.fields.forEach((field) => {
    if (field.type === 'dateRange') {
      const value = filterValues[field.key];
      if (Array.isArray(value) && value.length === 2) {
        params[field.key] = value;
      }
    } else {
      const value = filterValues[field.key];
      if (
        value !== undefined &&
        value !== '' &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        params[field.key] = value;
      }
    }
  });

  emit('search', params);
};

// 处理重置
const handleReset = () => {
  props.fields.forEach((field) => {
    if (field.type === 'select' && field.multiple) {
      filterValues[field.key] = [];
    } else if (field.type === 'dateRange') {
      filterValues[field.key] = [];
    } else {
      filterValues[field.key] = '';
    }
  });
  emit('reset');
};

// 处理刷新
const handleRefresh = () => {
  emit('refresh');
};

// 切换展开/收缩状态
const handleToggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 初始化
initFilterValues();

// 获取字段宽度
const getFieldWidth = (field: FilterField) => {
  return field.width || (field.type === 'dateRange' ? 'w-96' : 'w-64');
};
</script>

<template>
  <div class="mb-6 rounded-lg border-0 bg-gray-50 p-4">
    <!-- 收缩状态 - 单行布局 -->
    <div v-if="!isExpanded" class="flex items-center justify-between gap-4">
      <div class="flex flex-1 gap-4">
        <template v-for="field in collapsedFields" :key="field.key">
          <!-- 输入框 -->
          <Input
            v-if="field.type === 'input'"
            v-model:value="filterValues[field.key]"
            :class="getFieldWidth(field)"
            :placeholder="field.placeholder || field.label"
            allow-clear
            size="large"
          />

          <!-- 单选下拉框 -->
          <Select
            v-else-if="field.type === 'select' && !field.multiple"
            v-model:value="filterValues[field.key]"
            :class="getFieldWidth(field)"
            :placeholder="field.placeholder || `选择${field.label}`"
            allow-clear
            size="large"
          >
            <SelectOption
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>

          <!-- 多选下拉框 -->
          <Select
            v-else-if="field.type === 'select' && field.multiple"
            v-model:value="filterValues[field.key]"
            :class="`select-no-wrap ${getFieldWidth(field)}`"
            :max-tag-count="2"
            :max-tag-text-length="4"
            :placeholder="field.placeholder || `选择${field.label}`"
            mode="multiple"
            size="large"
          >
            <SelectOption
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectOption>
          </Select>

          <!-- 单个日期选择 -->
          <DatePicker
            v-else-if="field.type === 'date'"
            v-model:value="filterValues[field.key]"
            :class="getFieldWidth(field)"
            :placeholder="field.placeholder || field.label"
            size="large"
          />

          <!-- 日期范围选择 -->
          <RangePicker
            v-else-if="field.type === 'dateRange'"
            v-model:value="filterValues[field.key]"
            :class="getFieldWidth(field)"
            :format="field.format"
            :placeholder="[`开始${field.label}`, `结束${field.label}`]"
            :presets="field.rangePresets"
            :show-time="field.showTime"
            :style="field.style"
            size="large"
          />
        </template>
      </div>

      <div class="flex gap-2">
        <!-- 展开按钮 -->
        <Button
          v-if="shouldShowToggle"
          class="flex items-center justify-center"
          size="large"
          @click="handleToggleExpand"
        >
          <template #icon>
            <component :is="MdiChevronDown" />
          </template>
        </Button>

        <!-- 刷新按钮 -->
        <Button
          :loading="loading"
          class="flex items-center justify-center"
          shape="circle"
          size="large"
          @click="handleRefresh"
        >
          <template #icon>
            <component :is="MdiRefresh" />
          </template>
        </Button>

        <!-- 重置按钮 -->
        <Button class="w-20 shrink-0" size="large" @click="handleReset">
          重置
        </Button>

        <!-- 筛选按钮 -->
        <Button
          class="w-20 shrink-0"
          size="large"
          type="primary"
          @click="handleSearch"
        >
          筛选
        </Button>
      </div>
    </div>

    <!-- 展开状态 - 多行布局 -->
    <div v-else class="space-y-4">
      <!-- 筛选项区域 -->
      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <template v-for="field in fields" :key="field.key">
          <!-- 输入框 - 展开状态 -->
          <div v-if="field.type === 'input'">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              {{ field.label }}
            </label>
            <Input
              v-model:value="filterValues[field.key]"
              :placeholder="field.placeholder || field.label"
              allow-clear
              class="w-full"
              size="large"
            />
          </div>

          <!-- 选择框 - 展开状态 -->
          <div v-else-if="field.type === 'select'">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              {{ field.label }}
            </label>
            <Select
              v-model:value="filterValues[field.key]"
              :allow-clear="!field.multiple"
              :class="field.multiple ? 'select-no-wrap w-full' : 'w-full'"
              :max-tag-count="field.multiple ? 2 : undefined"
              :max-tag-text-length="field.multiple ? 4 : undefined"
              :mode="field.multiple ? 'multiple' : undefined"
              :placeholder="field.placeholder || `选择${field.label}`"
              size="large"
            >
              <SelectOption
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
            </Select>
          </div>

          <!-- 日期选择 - 展开状态 -->
          <div v-else-if="field.type === 'date'">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              {{ field.label }}
            </label>
            <DatePicker
              v-model:value="filterValues[field.key]"
              :placeholder="field.placeholder || field.label"
              class="w-full"
              size="large"
            />
          </div>

          <!-- 日期范围选择 - 展开状态 -->
          <div v-else-if="field.type === 'dateRange'">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              {{ field.label }}
            </label>
            <RangePicker
              v-model:value="filterValues[field.key]"
              :format="field.format"
              :placeholder="[`开始${field.label}`, `结束${field.label}`]"
              :presets="field.rangePresets"
              :show-time="field.showTime"
              :style="field.style"
              class="w-full"
              size="large"
            />
          </div>
        </template>
      </div>

      <!-- 按钮区域 -->
      <div
        class="flex items-center justify-between border-t border-gray-200 pt-4"
      >
        <div class="flex gap-2">
          <!-- 收缩按钮 -->
          <Button
            v-if="shouldShowToggle"
            class="flex items-center gap-1"
            size="large"
            @click="handleToggleExpand"
          >
            <template #icon>
              <component :is="MdiChevronUp" />
            </template>
            收起
          </Button>
        </div>

        <div class="flex gap-2">
          <!-- 刷新按钮 -->
          <Button
            :loading="loading"
            class="flex items-center justify-center"
            shape="circle"
            size="large"
            @click="handleRefresh"
          >
            <template #icon>
              <component :is="MdiRefresh" />
            </template>
          </Button>

          <!-- 重置按钮 -->
          <Button class="w-20 shrink-0" size="large" @click="handleReset">
            重置
          </Button>

          <!-- 筛选按钮 -->
          <Button
            class="w-20 shrink-0"
            size="large"
            type="primary"
            @click="handleSearch"
          >
            筛选
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-no-wrap :deep(.ant-select-selector) {
  flex-wrap: nowrap !important;
  overflow: hidden;
}

.select-no-wrap :deep(.ant-select-selection-overflow) {
  flex-wrap: nowrap !important;
}

.select-no-wrap :deep(.ant-select-selection-overflow-item) {
  flex-shrink: 0;
}
</style>
