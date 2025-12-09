<script setup lang="ts">
import { Button } from 'ant-design-vue';

import { EmptyState } from '#/components/EmptyState';
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">EmptyState 组件演示</h1>
      <p class="mb-6 text-gray-600">
        空状态组件，用于展示空列表、无搜索结果等场景
      </p>

      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h2 class="mb-4 text-lg font-semibold">默认样式</h2>
          <EmptyState />
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h2 class="mb-4 text-lg font-semibold">自定义标题和描述</h2>
          <EmptyState
            title="暂无数据"
            description="当前没有任何内容，请稍后再试"
          />
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h2 class="mb-4 text-lg font-semibold">文档图标</h2>
          <EmptyState
            icon-type="document"
            title="暂无文档"
            description="当前没有任何文档"
          />
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h2 class="mb-4 text-lg font-semibold">搜索图标</h2>
          <EmptyState
            icon-type="search"
            title="暂无搜索结果"
            description="请尝试其他关键词"
          />
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h2 class="mb-4 text-lg font-semibold">消息图标</h2>
          <EmptyState
            icon-type="message"
            title="暂无消息"
            description="当前没有任何消息"
          />
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-6">
          <h2 class="mb-4 text-lg font-semibold">带操作按钮</h2>
          <EmptyState
            icon-type="folder"
            title="暂无文件"
            description="上传您的第一个文件"
          >
            <template #action>
              <Button type="primary">上传文件</Button>
            </template>
          </EmptyState>
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

