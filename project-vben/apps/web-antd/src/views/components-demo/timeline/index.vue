<script setup lang="ts">
import { ref } from 'vue';

import { Timeline } from '#/components/Timeline';
import type { TimelineItem } from '#/components/Timeline';

const timelineItems = ref<TimelineItem[]>([
  {
    id: 1,
    title: '项目启动',
    content: '项目正式启动，开始进行需求分析',
    time: '2024年5月16日 10:00',
    status: '已完成',
    type: 'dynamic',
    recorder: '张三',
  },
  {
    id: 2,
    title: '需求评审',
    content: '完成需求评审会议，确定了项目范围',
    time: '2024年5月15日 14:30',
    status: '已完成',
    type: 'talk',
    recorder: '李四',
  },
  {
    id: 3,
    content: '开始进行技术选型，确定了主要技术栈',
    time: '2024年5月14日 09:00',
    type: 'default',
    recorder: '王五',
  },
  {
    id: 4,
    title: '项目立项',
    content: '项目正式立项，获得批准',
    time: '2024年4月20日 16:00',
    status: '已完成',
    type: 'dynamic',
    recorder: '赵六',
  },
  {
    id: 5,
    content: '完成项目可行性分析报告',
    time: '2024年4月15日 11:00',
    type: 'default',
    recorder: '孙七',
  },
]);

const handleItemClick = (item: TimelineItem) => {
  console.log('点击了时间轴项:', item);
};
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">Timeline 组件演示</h1>
      <p class="mb-6 text-gray-600">
        时间轴组件，按日期自动分组展示记录
      </p>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">基础用法</h2>
        <Timeline :items="timelineItems" @item-click="handleItemClick" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>

