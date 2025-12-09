<script setup lang="ts">
import { ref } from 'vue';

import { CustomTag } from '#/components/CustomTag';
import { MdiFlag, MdiHome, MdiUser } from '#/icons';

const tags = ref([
  {
    id: '1',
    name: '重要',
    type: 'CUSTOM' as const,
    color: '#D4A5A5', // 莫兰迪灰粉
    iconComponent: MdiFlag,
    closable: true,
  },
  {
    id: '2',
    name: '系统标签',
    type: 'SYS' as const,
    color: '#8B9DC3', // 莫兰迪灰蓝
    closable: false,
  },
  {
    id: '3',
    name: '首页',
    type: 'CUSTOM' as const,
    color: '#A8C5A0', // 莫兰迪灰绿
    iconComponent: MdiHome,
    closable: true,
  },
  {
    id: '4',
    name: '用户',
    type: 'CUSTOM' as const,
    color: '#B8A9C9', // 莫兰迪灰紫
    iconComponent: MdiUser,
    closable: true,
  },
]);

const handleClose = (id: string | number | undefined) => {
  console.log('删除标签:', id);
  tags.value = tags.value.filter((tag) => tag.id !== id);
};

const handleClick = (id: string | number | undefined) => {
  console.log('点击标签:', id);
};
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">CustomTag 组件演示</h1>
      <p class="mb-6 text-gray-600">
        自定义标签组件，支持图标、颜色自定义和删除功能
      </p>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">基础用法</h2>
        <div class="flex flex-wrap gap-2">
          <CustomTag
            v-for="tag in tags"
            :key="tag.id"
            :id="tag.id"
            :name="tag.name"
            :type="tag.type"
            :color="tag.color"
            :icon-component="tag.iconComponent"
            :closable="tag.closable"
            @close="handleClose"
            @click="handleClick"
          />
        </div>
      </div>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">不同颜色</h2>
        <div class="flex flex-wrap gap-2">
          <CustomTag name="灰粉标签" color="#D4A5A5" />
          <CustomTag name="灰蓝标签" color="#8B9DC3" />
          <CustomTag name="灰绿标签" color="#A8C5A0" />
          <CustomTag name="灰紫标签" color="#B8A9C9" />
          <CustomTag name="米色标签" color="#D4C4A5" />
        </div>
      </div>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">带图标</h2>
        <div class="flex flex-wrap gap-2">
          <CustomTag
            name="带图标标签"
            color="#8B9DC3"
            :icon-component="MdiFlag"
          />
          <CustomTag
            name="首页"
            color="#A8C5A0"
            :icon-component="MdiHome"
          />
          <CustomTag
            name="用户"
            color="#B8A9C9"
            :icon-component="MdiUser"
          />
        </div>
      </div>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">系统标签 vs 自定义标签</h2>
        <div class="flex flex-wrap gap-2">
          <CustomTag name="系统标签" type="SYS" color="#8B9DC3" />
          <CustomTag name="自定义标签" type="CUSTOM" color="#A8C5A0" />
        </div>
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

