<script setup lang="ts">
import { ref } from 'vue';

import { message } from 'ant-design-vue';

import { UniversalUpload } from '#/components/UniversalUpload';

const buttonUploadVisible = ref(false);
const dragUploadVisible = ref(false);

const mockUploadApi = async (file: File) => {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
  return { id: String(Date.now()), name: file.name, url: '#' };
};

const mockTemplateApi = async () => {
  const text = '姓名,年龄,部门\n张三,28,技术部\n';
  return new Blob([text], { type: 'text/csv' });
};

const handleSuccess = () => {
  message.success('上传成功（Demo）');
};
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">UniversalUpload 演示</h1>
      <p class="mb-6 text-gray-600">
        通用上传弹窗组件：支持按钮/拖拽两种模式、自动/手动上传、进度模拟、文件删除、模板下载。
      </p>

      <section class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">按钮模式（手动上传 + 模板下载）</h2>
        <a-button type="primary" @click="buttonUploadVisible = true">打开按钮上传</a-button>
        <UniversalUpload
          v-model:visible="buttonUploadVisible"
          title="按钮模式上传"
          :upload-api="mockUploadApi"
          :template-api="mockTemplateApi"
          template-name="人员信息模板.csv"
          :max-size="10 * 1024 * 1024"
          :auto-upload="false"
          multiple
          @success="handleSuccess"
        />
      </section>

      <section class="rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">拖拽模式（自动上传）</h2>
        <a-button type="primary" @click="dragUploadVisible = true">打开拖拽上传</a-button>
        <UniversalUpload
          v-model:visible="dragUploadVisible"
          title="拖拽模式上传"
          :upload-api="mockUploadApi"
          :max-size="5 * 1024 * 1024"
          drag
          multiple
          @success="handleSuccess"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
