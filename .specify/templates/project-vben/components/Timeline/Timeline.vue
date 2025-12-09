<script setup lang="ts">
/**
 * Timeline 组件
 *
 * 通用的时间轴组件，按日期分组展示记录
 *
 * 主要特性：
 * - 📅 按年/月/日自动分组
 * - 🎨 支持不同类型的节点颜色
 * - 📎 支持附件展示
 * - 🔧 支持自定义操作按钮
 * - 📱 响应式设计
 */
import { computed } from 'vue';

import { Empty } from 'ant-design-vue';

import AttachmentPreview from '../AttachmentPreview/index.vue';

// TODO: 替换为您项目中的文件上传响应类型
// 示例：import type { UploadServiceResponse } from '#/api/core/file';
import type { UploadServiceResponse } from '../AttachmentPreview/index.vue';

export interface TimelineItem {
  id: number | string;
  title?: string;
  content: string;
  time: string;
  status?: string;
  type?: 'default' | 'dynamic' | 'talk';
  recorder?: string;
  fileInfos?: UploadServiceResponse[];
  [key: string]: any;
}

export interface TimelineAction {
  icon: any;
  label: string;
  color: string;
  action: (item: TimelineItem) => void;
}

const props = defineProps<{
  actions?: TimelineAction[];
  emptyText?: string;
  items: TimelineItem[];
}>();

const emit = defineEmits<{
  itemClick: [item: TimelineItem];
}>();

// 处理项目点击
const handleItemClick = (item: TimelineItem) => {
  emit('itemClick', item);
};

// 处理操作按钮点击
const handleActionClick = (
  action: TimelineAction,
  item: TimelineItem,
  event: Event,
) => {
  event.stopPropagation(); // 阻止事件冒泡，避免触发item点击
  action.action(item);
};

// 获取时间轴节点颜色
const getTimelineColor = (item: TimelineItem) => {
  switch (item.type) {
    case 'dynamic': {
      return 'hsl(var(--primary))';
    }
    case 'talk': {
      return '#52c41a';
    }
    default: {
      return '#d9d9d9';
    }
  }
};

// 获取状态标签样式
const getStatusStyle = (status?: string) => {
  switch (status) {
    case '已取消': {
      return 'bg-gray-100 text-gray-800';
    }
    case '已完成': {
      return 'bg-blue-100 text-blue-800';
    }
    case '进行中': {
      return 'bg-green-100 text-green-800';
    }
    default: {
      return 'bg-gray-100 text-gray-800';
    }
  }
};

// 按日期分组的数据（年份 -> 月份 -> 日期 -> 记录）
const groupedItems = computed(() => {
  const yearGroups = new Map<
    string,
    {
      monthGroups: Map<
        string,
        {
          dayGroups: Map<
            string,
            {
              date: string;
              dayMonth: string;
              items: TimelineItem[];
            }
          >;
          items: TimelineItem[];
          monthYear: string;
          simpleMonth: string;
        }
      >;
      year: string;
    }
  >();

  // 按时间倒序排序
  const sortedItems = [...props.items].sort((a, b) => {
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
    return dateB.getTime() - dateA.getTime();
  });

  sortedItems.forEach((item) => {
    // 尝试解析不同的日期格式
    let date: Date;
    if (item.time.includes('年') && item.time.includes('月')) {
      // 处理中文日期格式，如 "2024年5月16日"
      const yearMatch = item.time.match(/(\d{4})年/);
      const monthMatch = item.time.match(/(\d{1,2})月/);
      const dayMatch = item.time.match(/(\d{1,2})日/);

      if (yearMatch?.[1] && monthMatch?.[1]) {
        const year = Number.parseInt(yearMatch[1], 10);
        const month = Number.parseInt(monthMatch[1], 10);
        const day = dayMatch?.[1] ? Number.parseInt(dayMatch[1], 10) : 1;
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(item.time);
      }
    } else {
      date = new Date(item.time);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const yearString = `${year}年`;
    const monthYear = `${year}年${month}月`;
    const simpleMonth = `${month}月`;
    const dayMonth = `${day}日`;

    // 创建年份分组
    if (!yearGroups.has(yearString)) {
      yearGroups.set(yearString, {
        year: yearString,
        monthGroups: new Map(),
      });
    }

    const yearGroup = yearGroups.get(yearString)!;

    // 创建月份分组
    if (!yearGroup.monthGroups.has(monthYear)) {
      yearGroup.monthGroups.set(monthYear, {
        items: [],
        monthYear,
        simpleMonth,
        dayGroups: new Map(),
      });
    }

    const monthGroup = yearGroup.monthGroups.get(monthYear)!;
    monthGroup.items.push(item);

    // 创建日期分组
    if (!monthGroup.dayGroups.has(dayMonth)) {
      monthGroup.dayGroups.set(dayMonth, {
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        dayMonth,
        items: [],
      });
    }

    monthGroup.dayGroups.get(dayMonth)!.items.push(item);
  });

  // 转换为数组并排序
  return [...yearGroups.values()].map((yearGroup) => ({
    ...yearGroup,
    monthGroups: [...yearGroup.monthGroups.values()].map((monthGroup) => ({
      ...monthGroup,
      dayGroups: [...monthGroup.dayGroups.values()].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }),
    })),
  }));
});
</script>

<template>
  <div class="timeline-container">
    <div v-if="items.length === 0" class="timeline-empty">
      <Empty :description="emptyText || '暂无记录'" />
    </div>

    <div v-else class="timeline-wrapper">
      <!-- 连续的时间轴主线 -->
      <div class="timeline-main-line"></div>

      <!-- 按年份分组显示 -->
      <div
        v-for="yearGroup in groupedItems"
        :key="yearGroup.year"
        class="year-group"
      >
        <!-- 按月份分组显示 -->
        <div
          v-for="(monthGroup, monthIndex) in yearGroup.monthGroups"
          :key="monthGroup.monthYear"
          class="month-group"
        >
          <!-- 按日期分组显示 -->
          <div
            v-for="(dayGroup, dayIndex) in monthGroup.dayGroups"
            :key="dayGroup.dayMonth"
            class="day-group"
          >
            <!-- 该日期的记录 -->
            <div
              v-for="(item, itemIndex) in dayGroup.items"
              :key="item.id"
              class="timeline-item-wrapper"
            >
              <!-- 左侧：年份/月份/日期信息 -->
              <div class="timeline-left">
                <div v-if="itemIndex === 0" class="date-info">
                  <!-- 只在年份的第一个项目显示年份 -->
                  <div
                    v-if="monthIndex === 0 && dayIndex === 0"
                    class="year-label"
                  >
                    {{ yearGroup.year }}
                  </div>
                  <!-- 只在月份的第一个项目显示月份 -->
                  <div v-if="dayIndex === 0" class="month-label">
                    {{ monthGroup.simpleMonth }}
                  </div>
                  <!-- 每个日期组都显示日期 -->
                  <div class="day-label">{{ dayGroup.dayMonth }}</div>
                </div>
              </div>

              <!-- 时间轴节点 -->
              <div class="timeline-node">
                <div
                  :style="{ backgroundColor: getTimelineColor(item) }"
                  class="timeline-dot"
                ></div>
              </div>

              <!-- 右侧：内容区域 -->
              <div class="timeline-content">
                <div class="timeline-item" @click="handleItemClick(item)">
                  <!-- 主要内容区域 -->
                  <div class="item-content-wrapper">
                    <!-- 主要内容 -->
                    <div class="item-main">
                      <!-- 有标题时显示标题和内容 -->
                      <template v-if="item.title">
                        <h3 class="item-title">
                          {{ item.title }}
                        </h3>
                        <p
                          v-if="item.content !== item.title"
                          class="item-description"
                        >
                          {{ item.content }}
                        </p>
                      </template>
                      <!-- 没有标题时仅显示内容，不加粗 -->
                      <template v-else>
                        <p class="item-description">
                          {{ item.content }}
                        </p>
                      </template>
                      <p v-if="item.recorder" class="item-recorder">
                        {{ item.recorder }}
                      </p>

                      <!-- 附件展示 -->
                      <AttachmentPreview
                        v-if="item.fileInfos && item.fileInfos.length > 0"
                        :attachments="item.fileInfos"
                        :max-display="3"
                      />
                    </div>

                    <!-- 时间和状态 -->
                    <div class="item-meta">
                      <div class="item-time">{{ item.time }}</div>
                      <div
                        v-if="item.status"
                        :class="getStatusStyle(item.status)"
                        class="item-status"
                      >
                        {{ item.status }}
                      </div>
                    </div>
                  </div>

                  <!-- 操作按钮区域 -->
                  <div
                    v-if="actions && actions.length > 0"
                    class="item-actions"
                  >
                    <button
                      v-for="action in actions"
                      :key="action.label"
                      :style="{ color: action.color }"
                      :title="action.label"
                      class="action-btn"
                      @click="(event) => handleActionClick(action, item, event)"
                    >
                      <component :is="action.icon" v-if="action.icon" />
                      <span v-else class="action-text">{{ action.label }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式调整 */
@media (max-width: 640px) {
  /* .timeline-wrapper {
    padding: 0 8px;
  } */

  .timeline-main-line {
    left: calc(50px + 10px + 10px - 3px);
  }

  .timeline-left {
    width: 50px;
    padding-right: 10px;
  }

  .timeline-content {
    padding-left: 10px;
  }

  .timeline-item {
    padding: 10px 12px;
  }

  .item-actions {
    margin-left: 8px;
  }

  .year-label {
    font-size: 11px;
  }

  .month-label {
    font-size: 13px;
  }

  .day-label {
    font-size: 11px;
  }

  .item-title {
    font-size: 15px;
  }

  .item-description {
    font-size: 13px;
  }

  .item-time {
    font-size: 11px;
  }
}

.timeline-container {
  position: relative;
}

.timeline-empty {
  padding: 40px 0;
}

/* .timeline-wrapper {
  position: relative;
  padding: 0 16px;
} */

.timeline-item-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

/* 时间轴主线 - 连接所有点 */
.timeline-main-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(50px + 10px - 1px);
  z-index: 1;
  width: 2px;
  background-color: #e8e8e8;
}

/* 左侧日期信息 */
.timeline-left {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  width: 50px;
  padding-right: 4px;
}

.date-info {
  text-align: right;
}

.year-label {
  margin-bottom: 1px;
  font-size: 12px;
  font-weight: 400;
  color: #bfbfbf;
}

.month-label {
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.day-label {
  font-size: 12px;
  color: #8c8c8c;
}

/* 时间轴节点 - 确保在线上 */
.timeline-node {
  position: relative;
  z-index: 2;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: 8px;
}

.timeline-dot {
  position: relative;
  z-index: 3;
  width: 12px;
  height: 12px;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #e8e8e8;
}

/* 右侧内容区域 */
.timeline-content {
  position: relative;
  flex: 1;
  padding-left: 16px;
  margin-top: 8px;
}

.timeline-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 40px;
  padding: 12px 16px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 4%);
  transition: all 0.3s ease;
}

.timeline-item:hover {
  border-color: #d9d9d9;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

/* 内容包装器 */
.item-content-wrapper {
  flex: 1;
  min-width: 0;
}

/* 主要内容样式 */
.item-main {
  margin-bottom: 8px;
}

.item-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: #262626;
}

.item-description {
  margin: 4px 0;
  font-size: 14px;
  line-height: 1.5;
}

.item-recorder {
  margin: 4px 0 0;
  font-size: 12px;
  color: #bfbfbf;
}

/* 时间和状态样式 */
.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.item-time {
  font-size: 12px;
  color: #bfbfbf;
}

.item-status {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
}

/* 操作按钮区域 */
.item-actions {
  display: flex;
  gap: 4px;
  align-items: flex-start;
  margin-left: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  font-size: 18px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-text {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.action-btn:hover {
  background: rgb(0 0 0 / 4%);
  transform: scale(1.05);
}

.action-btn:active {
  transform: scale(0.95);
}

/* 月份分组样式 */
.month-group {
  margin-bottom: 32px;
}

.month-group:last-child {
  margin-bottom: 0;
}

/* 日期分组样式 */
.day-group {
  margin-bottom: 8px;
}

.day-group:last-child {
  margin-bottom: 0;
}

/* 年份分组样式 */
.year-group {
  margin-bottom: 40px;
}

.year-group:last-child {
  margin-bottom: 0;
}
</style>

