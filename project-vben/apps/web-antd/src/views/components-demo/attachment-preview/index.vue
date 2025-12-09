<script setup lang="ts">
import { ref } from 'vue';

import { AttachmentPreview } from '#/components/AttachmentPreview';
import type { UploadServiceResponse } from '#/components/AttachmentPreview';

const attachments = ref<UploadServiceResponse[]>([
  {
    filename: 'image1.jpg',
    url: 'https://via.placeholder.com/300x200',
    type: 'image/jpeg',
    size: 102400,
  },
  {
    filename: 'document.pdf',
    url: 'https://example.com/document.pdf',
    type: 'application/pdf',
    size: 204800,
  },
  {
    filename: 'spreadsheet.xlsx',
    url: 'https://example.com/spreadsheet.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 153600,
  },
  {
    filename: 'image2.png',
    url: 'https://via.placeholder.com/400x300',
    type: 'image/png',
    size: 307200,
  },
  {
    filename: 'presentation.pptx',
    url: 'https://example.com/presentation.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 512000,
  },
]);
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">AttachmentPreview 组件演示</h1>
      <p class="mb-6 text-gray-600">
        附件预览组件，支持图片缩略图预览和多种文件类型图标展示
      </p>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">基础用法</h2>
        <AttachmentPreview :attachments="attachments" :max-display="4" />
      </div>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">限制显示数量</h2>
        <AttachmentPreview :attachments="attachments" :max-display="2" />
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

