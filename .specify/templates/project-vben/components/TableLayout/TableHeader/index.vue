<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';

import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  RangePicker,
  Select,
  Switch,
  Tooltip,
} from 'ant-design-vue';

// TODO: 导入您项目中的图标组件
// 需要导入以下图标：MdiChevronDown, MdiChevronUp, MdiFilter, MdiKeyboardReturn, MdiMagnify, MdiRefresh
// 示例：import { MdiMagnify, MdiRefresh, MdiFilter, MdiChevronDown, MdiChevronUp, MdiKeyboardReturn } from '@/icons';
// 或者使用 unplugin-icons: import MdiMagnify from '~icons/mdi/magnify'
import {
  MdiChevronDown,
  MdiChevronUp,
  MdiFilter,
  MdiKeyboardReturn,
  MdiMagnify,
  MdiRefresh,
} from '../../../icons/placeholder'; // TODO: 替换为实际的图标导入路径

export interface FilterField {
  disabledDate?: (current: any) => boolean;
  format?: string;
  key: string;
  label: string;
  operators?: Array<{ label: string; value: string }>;
  options?: Array<{ label: string; value: boolean | number | string }>;
  placeholder?: string;
  rangePresets?: Array<{
    label: string;
    value: any[];
  }>;
  // RangePicker 相关配置
  showTime?: boolean;
  style?: Record<string, any>;
  type:
    | 'dateRange'
    | 'input'
    | 'input-number'
    | 'rangePicker'
    | 'select'
    | 'switch';
}

export interface ActionButton {
  icon?: any;
  onClick: () => void;
  text: string;
  type?: 'default' | 'primary';
}

export interface StatisticItem {
  label: string;
  loading?: boolean;
  value: number | string;
}

export interface QuickFilter {
  color?: string; // 颜色，可选
  count?: number; // 计数，可选
  icon?: string;
  key: string;
  label: string;
  tooltip?: string;
}

export interface QuickFilterConfig {
  showCount?: boolean; // 是否显示计数
  showTitle?: boolean; // 是否显示标题（大卡片时自动隐藏）
  size?: 'large' | 'small'; // 卡片大小
}

interface TableHeaderProps {
  actionButtons?: ActionButton[];
  activeQuickFilter?: string;
  filterFields?: FilterField[];
  loading?: boolean;
  quickFilterConfig?: QuickFilterConfig;
  quickFilters?: QuickFilter[];
  searchPlaceholder?: string;
  searchValue?: string;
  showAdvancedFilter?: boolean;
  showSearch?: boolean;
  statistics?: StatisticItem[];
  title: string;
}

interface TableHeaderEmits {
  (e: 'search', value: string): void;
  (e: 'refresh'): void;
  (e: 'reset'): void;
  (
    e: 'filter',
    values: Record<string, any>,
    operators?: Record<string, string>,
  ): void;
  (e: 'update:searchValue', value: string): void;
  (e: 'quickFilter', key: string): void;
}

const props = withDefaults(defineProps<TableHeaderProps>(), {
  loading: false,
  showSearch: true,
  searchPlaceholder: '搜索...',
  searchValue: '',
  showAdvancedFilter: false,
  filterFields: () => [],
  actionButtons: () => [],
  quickFilters: () => [],
  activeQuickFilter: '',
  quickFilterConfig: () => ({
    showCount: false,
    size: 'small',
    showTitle: true,
  }),
  statistics: () => [],
});

const emit = defineEmits<TableHeaderEmits>();

// 搜索值
const searchInput = ref(props.searchValue);
// 高级筛选显示状态
const isAdvancedFilterVisible = ref(false);
// 筛选表单数据
const filterForm = reactive<Record<string, any>>({});
// 操作符表单数据
const operatorForm = reactive<Record<string, string>>({});

// 初始化筛选表单
const initFilterForm = () => {
  props.filterFields.forEach((field) => {
    if (field.type === 'dateRange') {
      filterForm[`${field.key}Start`] = undefined;
      filterForm[`${field.key}End`] = undefined;
    } else if (field.type === 'rangePicker') {
      filterForm[field.key] = [];
    } else {
      filterForm[field.key] = undefined;
      // 如果有操作符配置，初始化为第一个操作符
      if (field.operators && field.operators?.length > 0) {
        operatorForm[field.key] = field.operators[0]?.value || '';
      }
    }
  });
};

// 处理搜索
const handleSearch = () => {
  emit('search', searchInput.value);
  emit('update:searchValue', searchInput.value);
};

// 处理刷新
const handleRefresh = () => {
  emit('refresh');
};

// 切换高级筛选
const toggleAdvancedFilter = () => {
  isAdvancedFilterVisible.value = !isAdvancedFilterVisible.value;
};

// 处理重置
const handleReset = () => {
  searchInput.value = '';
  Object.keys(filterForm).forEach((key) => {
    filterForm[key] = undefined;
  });
  // 重置操作符为默认值
  props.filterFields.forEach((field) => {
    if (field.operators && field.operators.length > 0) {
      operatorForm[field.key] = field.operators[0]?.value || '';
    }
  });
  emit('reset');
  emit('update:searchValue', '');
};

// 处理筛选
const handleFilter = () => {
  const values: Record<string, any> = {};
  const operators: Record<string, string> = {};

  // 包含当前的搜索关键词
  if (searchInput.value && searchInput.value.trim() !== '') {
    values.keyword = searchInput.value.trim();
  }

  props.filterFields.forEach((field) => {
    if (field.type === 'dateRange') {
      const startValue = filterForm[`${field.key}Start`];
      const endValue = filterForm[`${field.key}End`];
      if (startValue) values[`${field.key}Start`] = startValue;
      if (endValue) values[`${field.key}End`] = endValue;
    } else if (field.type === 'rangePicker') {
      const value = filterForm[field.key];
      if (Array.isArray(value) && value.length === 2) {
        values[field.key] = value;
      }
    } else {
      const value = filterForm[field.key];
      if (field.type === 'switch') {
        // Switch 类型字段处理：只有明确选择了true/false才传递值
        if (value !== undefined) {
          values[field.key] = value;
        }
      } else {
        // 其他类型字段处理
        if (value !== undefined && value !== '') {
          values[field.key] = value;
          // 如果有操作符，收集操作符
          if (operatorForm[field.key]) {
            operators[field.key] = operatorForm[field.key]!;
          }
        }
      }
    }
  });

  // 将操作符作为第二个参数传递
  emit('filter', values, operators);
};

// 处理回车事件 - 根据筛选状态决定触发哪个功能
const handleEnterKey = () => {
  handleSearch();
};

// 处理快捷筛选
const handleQuickFilter = (key: string) => {
  emit('quickFilter', key);
};

// 获取筛选卡片的样式类
const getFilterCardClass = (filter: QuickFilter, isActive: boolean) => {
  const baseClasses =
    'cursor-pointer rounded-lg border p-4 text-center shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:transform';

  if (isActive) {
    // 使用自定义颜色或默认色
    const colorMap: Record<string, string> = {
      gold: 'border-yellow-400 bg-yellow-50 text-yellow-700',
      orange: 'border-orange-400 bg-orange-50 text-orange-700',
      red: 'border-red-400 bg-red-50 text-red-700',
      purple: 'border-purple-400 bg-purple-50 text-purple-700',
      green: 'border-green-400 bg-green-50 text-green-700',
      blue: 'border-blue-400 bg-blue-50 text-blue-700',
      default:
        'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]',
    };
    const color = filter.color || 'default';
    return `${baseClasses} ${colorMap[color] || colorMap.default}`;
  } else {
    // 未激活状态的颜色悬停效果
    const hoverColorMap: Record<string, string> = {
      gold: 'border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:shadow-lg',
      orange:
        'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:shadow-lg',
      red: 'border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:shadow-lg',
      purple:
        'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:shadow-lg',
      green:
        'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:shadow-lg',
      blue: 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:shadow-lg',
      default:
        'border-gray-200 bg-white text-gray-700 hover:border-[hsl(var(--primary))] hover:shadow-lg',
    };
    const color = filter.color || 'default';
    return `${baseClasses} ${hoverColorMap[color] || hoverColorMap.default}`;
  }
};

// 获取小卡片的样式类
const getSmallFilterCardClass = (filter: QuickFilter, isActive: boolean) => {
  const baseClasses =
    'flex h-8 items-center rounded-lg px-3 text-sm font-medium transition-all';

  if (isActive) {
    if (filter.color && filter.color !== 'default') {
      const colorMap: Record<string, string> = {
        gold: 'border-yellow-300 bg-yellow-100 text-yellow-800',
        orange: 'border-orange-300 bg-orange-100 text-orange-800',
        red: 'border-red-300 bg-red-100 text-red-800',
        purple: 'border-purple-300 bg-purple-100 text-purple-800',
        green: 'border-green-300 bg-green-100 text-green-800',
        blue: 'border-blue-300 bg-blue-100 text-blue-800',
      };
      return `${baseClasses} ${colorMap[filter.color] || 'border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]'}`;
    }
    return `${baseClasses} border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]`;
  } else {
    return `${baseClasses} border border-gray-300 text-gray-700 hover:bg-gray-50`;
  }
};

// 监听外部搜索值变化，保持同步
watch(
  () => props.searchValue,
  (newValue) => {
    searchInput.value = newValue || '';
  },
  { immediate: true },
);

// 监听筛选字段变化，重新初始化筛选表单
watch(
  () => props.filterFields,
  () => {
    initFilterForm();
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div>
    <!-- Title + Action Bar -->
    <div
      v-if="
        title ||
        actionButtons.length > 0 ||
        (statistics && statistics.length > 0)
      "
      class="px-6 py-4"
    >
      <div class="flex items-center justify-between">
        <!-- Title 标题 -->
        <div v-if="title">
          <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
        </div>
        <!-- Statistics & Action Bar 统计信息和操作栏 -->
        <div class="flex flex-shrink-0 items-center gap-6">
          <!-- Statistics 统计信息 -->
          <div
            v-if="statistics && statistics.length > 0"
            class="flex items-center gap-6"
          >
            <div
              v-for="(stat, index) in statistics"
              :key="index"
              class="flex items-center gap-2 text-sm"
            >
              <span class="text-gray-600">{{ stat.label }}:</span>
              <span v-if="stat.loading" class="text-gray-400">-</span>
              <span v-else class="font-semibold text-gray-900">{{
                stat.value
              }}</span>
            </div>
          </div>
          <!-- Action Buttons 操作按钮 -->
          <div v-if="actionButtons.length > 0" class="flex gap-2">
            <Button
              v-for="(button, index) in actionButtons"
              :key="index"
              :class="[
                button.type === 'primary'
                  ? 'bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/0.9)] hover:shadow-md'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
              ]"
              :type="button.type || 'default'"
              class="flex h-8 items-center rounded-lg px-4 font-medium shadow-sm transition-all"
              @click="button.onClick"
            >
              <component
                :is="button.icon"
                v-if="button.icon"
                class="mr-2 h-4 w-4"
              />
              {{ button.text }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter 筛选区域 -->
    <div
      v-if="showSearch || filterFields.length > 0"
      :class="
        title ||
        actionButtons.length > 0 ||
        (statistics && statistics.length > 0)
          ? 'border-t border-gray-200'
          : ''
      "
      class="px-6 py-4"
    >
      <!-- 搜索和筛选控件 -->
      <div class="flex items-center justify-between">
        <div v-if="showSearch" class="flex flex-1 items-center space-x-4">
          <div class="relative max-w-md flex-1">
            <Input
              v-model:value="searchInput"
              :placeholder="searchPlaceholder"
              allow-clear
              class="h-8 w-full"
              size="small"
              @press-enter="handleEnterKey"
            >
              <template #prefix>
                <MdiMagnify class="h-4 w-4 text-gray-400" />
              </template>
              <template #suffix>
                <Button
                  class="h-6 w-6 rounded-md p-0 hover:bg-gray-100"
                  size="small"
                  title="回车搜索"
                  type="text"
                  @click="handleSearch"
                >
                  <MdiKeyboardReturn
                    class="h-4 w-4 text-gray-400 hover:text-gray-600"
                  />
                </Button>
              </template>
            </Input>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Button
            v-if="filterFields.length > 0"
            class="flex h-8 items-center space-x-2 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="toggleAdvancedFilter"
          >
            <component :is="MdiFilter" class="h-4 w-4" />
            <span class="ml-1">
              {{ isAdvancedFilterVisible ? '收起筛选' : '展开筛选' }}
            </span>
            <component
              :is="isAdvancedFilterVisible ? MdiChevronUp : MdiChevronDown"
              class="h-4 w-4"
            />
          </Button>
          <Button
            :loading="loading"
            class="flex h-8 items-center justify-center rounded-lg border border-gray-300 px-3 text-gray-700 hover:bg-gray-50"
            @click="handleRefresh"
          >
            <component :is="MdiRefresh" class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Quick Filter 和额外操作按钮容器 - 只有在有内容时才显示 -->
      <div
        v-if="quickFilters.length > 0 || $slots['extra-actions']"
        class="mt-4 flex items-center justify-between"
      >
        <!-- Quick Filter 快捷筛选 -->
        <div v-if="quickFilters.length > 0" class="flex-auto">
          <!-- 小卡片样式 -->
          <div
            v-if="quickFilterConfig.size === 'small'"
            class="flex items-center gap-4"
          >
            <span
              v-if="quickFilterConfig.showTitle"
              class="whitespace-nowrap text-sm font-medium text-gray-700"
            >
              快捷筛选：
            </span>
            <div class="flex flex-wrap gap-2">
              <Tooltip
                v-for="filter in quickFilters"
                :key="filter.key"
                :title="filter.tooltip"
                overlay-class-name="quick-filter-tooltip"
                placement="top"
              >
                <Button
                  :class="
                    getSmallFilterCardClass(
                      filter,
                      activeQuickFilter === filter.key,
                    )
                  "
                  @click="handleQuickFilter(filter.key)"
                >
                  <span v-if="filter.icon" class="mr-2">{{ filter.icon }}</span>
                  {{ filter.label }}
                  <span
                    v-if="
                      quickFilterConfig.showCount && filter.count !== undefined
                    "
                    class="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {{ filter.count }}
                  </span>
                </Button>
              </Tooltip>
            </div>
          </div>

          <!-- 大卡片样式 -->
          <div
            v-else-if="quickFilterConfig.size === 'large'"
            class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            <Tooltip
              v-for="filter in quickFilters"
              :key="filter.key"
              :title="filter.tooltip"
              overlay-class-name="quick-filter-tooltip"
              placement="top"
            >
              <div
                :class="
                  getFilterCardClass(filter, activeQuickFilter === filter.key)
                "
                @click="handleQuickFilter(filter.key)"
              >
                <div v-if="filter.icon" class="mb-2 text-2xl">
                  {{ filter.icon }}
                </div>
                <div
                  v-if="
                    quickFilterConfig.showCount && filter.count !== undefined
                  "
                  class="text-2xl font-bold"
                >
                  {{ filter.count }}
                </div>
                <div class="text-sm font-medium">{{ filter.label }}</div>
              </div>
            </Tooltip>
          </div>
        </div>
        <!-- 额外操作按钮插槽 -->
        <slot name="extra-actions"></slot>
      </div>

      <!-- 高级筛选表单 (可折叠) -->
      <transition name="filter-expand">
        <div
          v-if="isAdvancedFilterVisible && filterFields.length > 0"
          class="mt-4 rounded-lg bg-gray-50/50 px-4 py-4"
        >
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            <template v-for="field in filterFields" :key="field.key">
              <!-- 普通字段 -->
              <div
                v-if="
                  field.type !== 'dateRange' && field.type !== 'rangePicker'
                "
                class="flex items-center space-x-3"
              >
                <label
                  class="w-20 flex-shrink-0 text-sm font-medium text-gray-700"
                >
                  {{ field.label }}：
                </label>
                <div class="flex flex-1 items-center">
                  <!-- 操作符选择框 -->
                  <Select
                    v-if="field.operators && field.operators.length > 0"
                    v-model:value="operatorForm[field.key]"
                    class="operator-select w-24 flex-shrink-0"
                  >
                    <Select.Option
                      v-for="operator in field.operators"
                      :key="operator.value"
                      :value="operator.value"
                    >
                      {{ operator.label }}
                    </Select.Option>
                  </Select>
                  <!-- 输入框/选择框 -->
                  <Input
                    v-if="field.type === 'input'"
                    v-model:value="filterForm[field.key]"
                    :class="[
                      field.operators && field.operators.length > 0
                        ? 'input-connected'
                        : '',
                    ]"
                    :placeholder="field.placeholder || `输入${field.label}`"
                    class="flex-1"
                    @press-enter="handleFilter"
                  />
                  <InputNumber
                    v-else-if="field.type === 'input-number'"
                    v-model:value="filterForm[field.key]"
                    :class="[
                      field.operators && field.operators.length > 0
                        ? 'input-connected'
                        : '',
                    ]"
                    :placeholder="field.placeholder || `输入${field.label}`"
                    class="flex-1"
                  />
                  <Select
                    v-else-if="field.type === 'select'"
                    v-model:value="filterForm[field.key]"
                    :class="[
                      field.operators && field.operators.length > 0
                        ? 'input-connected'
                        : '',
                    ]"
                    :filter-option="
                      (input, option) =>
                        option?.label
                          ?.toString()
                          ?.toLowerCase()
                          ?.includes(input.toLowerCase()) ?? false
                    "
                    :placeholder="field.placeholder || `选择${field.label}`"
                    allow-clear
                    class="flex-1"
                    show-search
                  >
                    <Select.Option
                      v-for="option in field.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select>
                  <Switch
                    v-else-if="field.type === 'switch'"
                    v-model:checked="filterForm[field.key]"
                    :checked-children="field.placeholder?.split('|')[0] || '是'"
                    :un-checked-children="
                      field.placeholder?.split('|')[1] || '否'
                    "
                    class="flex-shrink-0"
                  />
                </div>
              </div>

              <!-- 日期范围字段 -->
              <div
                v-else-if="field.type === 'dateRange'"
                class="col-span-2 flex items-center space-x-3"
              >
                <label
                  class="w-20 flex-shrink-0 text-sm font-medium text-gray-700"
                >
                  {{ field.label }}：
                </label>
                <div class="flex flex-1 items-center space-x-2">
                  <DatePicker
                    v-model:value="filterForm[`${field.key}Start`]"
                    :placeholder="`开始${field.label}`"
                    class="flex-1"
                    size="small"
                  />
                  <span class="text-gray-500">~</span>
                  <DatePicker
                    v-model:value="filterForm[`${field.key}End`]"
                    :placeholder="`结束${field.label}`"
                    class="flex-1"
                    size="small"
                  />
                </div>
              </div>

              <!-- RangePicker 字段 -->
              <div
                v-else-if="field.type === 'rangePicker'"
                class="col-span-2 flex items-center space-x-3"
              >
                <label
                  class="w-20 flex-shrink-0 text-sm font-medium text-gray-700"
                >
                  {{ field.label }}：
                </label>
                <RangePicker
                  v-model:value="filterForm[field.key]"
                  :disabled-date="field.disabledDate"
                  :format="field.format"
                  :placeholder="[`开始${field.label}`, `结束${field.label}`]"
                  :presets="field.rangePresets"
                  :show-time="field.showTime"
                  :style="field.style"
                  class="flex-1"
                  size="small"
                />
              </div>
            </template>
          </div>
          <div
            class="mt-4 flex items-center justify-end border-t border-gray-200 pt-3"
          >
            <div class="flex gap-3">
              <Button
                class="flex h-8 items-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100"
                @click="handleReset"
              >
                重置
              </Button>
              <Button
                class="flex h-8 items-center rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[hsl(var(--primary)/0.9)] hover:shadow-md"
                type="primary"
                @click="handleFilter"
              >
                查询
              </Button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* 筛选表单过渡动画 */
.filter-expand-enter-active,
.filter-expand-leave-active {
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-expand-enter-from,
.filter-expand-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.filter-expand-enter-to,
.filter-expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>

<style>
/* 快捷筛选tooltip样式 */
.quick-filter-tooltip .ant-tooltip-inner {
  max-width: 300px;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.4;
  background: linear-gradient(
    135deg,
    hsl(var(--primary) / 90%) 0%,
    hsl(var(--primary) / 80%) 100%
  );
  border-radius: 8px;
  box-shadow: 0 4px 12px hsl(var(--primary) / 15%);
}

.quick-filter-tooltip .ant-tooltip-arrow::before {
  background: hsl(var(--primary) / 90%);
}

.quick-filter-tooltip .ant-tooltip-arrow::after {
  background: hsl(var(--primary) / 90%);
}
</style>

<style lang="scss">
/* 操作符和输入框连接样式 */
.operator-select {
  .ant-select-selector {
    border-right: 0 !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}

.input-connected .ant-input,
.input-connected .ant-input-number,
.input-connected .ant-select-selector {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input-connected {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  .ant-input-number-input {
    height: 31px !important;
  }
}
</style>
