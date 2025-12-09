<script setup lang="ts">
import { ref } from 'vue';

import { RichEditor } from '#/components/RichEditor';

const content = ref('<p>请输入内容...</p>');

const handleUpdate = (value: string) => {
  content.value = value;
  console.log('内容更新:', value);
};
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">RichEditor 组件演示</h1>
      <p class="mb-6 text-gray-600">
        富文本编辑器组件，基于 Quill 实现
      </p>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">基础用法</h2>
        <RichEditor
          v-model="content"
          placeholder="请输入内容..."
          :rows="10"
          @update:model-value="handleUpdate"
        />
        <div class="mt-4">
          <p class="mb-2 text-sm font-semibold">当前内容（HTML）：</p>
          <pre class="rounded bg-gray-100 p-4 text-sm">{{ content }}</pre>
        </div>
      </div>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">自定义行数</h2>
        <RichEditor
          v-model="content"
          placeholder="请输入内容..."
          :rows="5"
        />
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

