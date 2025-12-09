<script setup lang="ts">
import { ref } from 'vue';

import { Button } from 'ant-design-vue';

import { DetailDrawer } from '#/components/DetailDrawer';
import type { DetailHeader, DetailTab } from '#/components/DetailDrawer';

const drawerVisible = ref(false);
const drawerLayout = ref<'flat' | 'tabs'>('flat');
const drawerLoading = ref(false);

const header: DetailHeader = {
  title: '详情标题',
  subtitle: '这是副标题信息',
  createdAt: new Date(),
  createdAtLabel: '创建时间',
  updatedAt: new Date(),
  updatedAtLabel: '更新时间',
};

const tabs: DetailTab[] = [
  { key: 'basic', label: '基本信息' },
  { key: 'detail', label: '详细信息' },
  { key: 'history', label: '历史记录' },
];

const openDrawer = (layout: 'flat' | 'tabs') => {
  drawerLayout.value = layout;
  drawerVisible.value = true;
};

const handleClose = () => {
  drawerVisible.value = false;
};
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">DetailDrawer 组件演示</h1>
      <p class="mb-6 text-gray-600">
        详情抽屉组件，支持平铺和标签页两种布局模式
      </p>

      <div class="mb-8 flex gap-4">
        <Button type="primary" @click="openDrawer('flat')">
          打开平铺布局抽屉
        </Button>
        <Button type="primary" @click="openDrawer('tabs')">
          打开标签页布局抽屉
        </Button>
      </div>

      <!-- 平铺布局抽屉 -->
      <DetailDrawer
        v-model:visible="drawerVisible"
        :header="header"
        :layout="drawerLayout"
        :loading="drawerLoading"
        width="70vw"
      >
        <template #content>
          <div class="p-6">
            <div class="mb-4">
              <h3 class="mb-2 font-semibold">基本信息</h3>
              <p class="text-gray-600">这是平铺布局的内容区域</p>
            </div>
            <div class="mb-4">
              <h3 class="mb-2 font-semibold">详细信息</h3>
              <p class="text-gray-600">可以在这里放置任何内容</p>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <Button @click="handleClose">取消</Button>
            <Button type="primary">确定</Button>
          </div>
        </template>
      </DetailDrawer>

      <!-- 标签页布局抽屉 -->
      <DetailDrawer
        v-if="drawerLayout === 'tabs'"
        v-model:visible="drawerVisible"
        :header="header"
        :tabs="tabs"
        :layout="drawerLayout"
        :loading="drawerLoading"
        width="70vw"
      >
        <template #tab-basic>
          <div class="p-6">
            <h3 class="mb-2 font-semibold">基本信息</h3>
            <p class="text-gray-600">这是基本信息标签页的内容</p>
          </div>
        </template>
        <template #tab-detail>
          <div class="p-6">
            <h3 class="mb-2 font-semibold">详细信息</h3>
            <p class="text-gray-600">这是详细信息标签页的内容</p>
          </div>
        </template>
        <template #tab-history>
          <div class="p-6">
            <h3 class="mb-2 font-semibold">历史记录</h3>
            <p class="text-gray-600">这是历史记录标签页的内容</p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <Button @click="handleClose">取消</Button>
            <Button type="primary">确定</Button>
          </div>
        </template>
      </DetailDrawer>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>

