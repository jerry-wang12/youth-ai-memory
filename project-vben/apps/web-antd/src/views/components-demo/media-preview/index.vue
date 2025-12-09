<script setup lang="ts">
import { ref } from 'vue';

import { Button } from 'ant-design-vue';

import { MediaPreview } from '#/components/MediaPreview';
import type { MediaItem } from '#/components/MediaPreview';

const previewVisible = ref(false);
const currentIndex = ref(0);

const imageItems: MediaItem[] = [
  {
    name: 'image1.jpg',
    type: 'image',
    url: 'https://via.placeholder.com/800x600',
  },
  {
    name: 'image2.jpg',
    type: 'image',
    url: 'https://via.placeholder.com/600x800',
  },
  {
    name: 'image3.jpg',
    type: 'image',
    url: 'https://via.placeholder.com/1000x500',
  },
];

const videoItems: MediaItem[] = [
  {
    name: 'video1.mp4',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];

const audioItems: MediaItem[] = [
  {
    name: 'audio1.mp3',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
];

const openPreview = (items: MediaItem[], index = 0) => {
  currentIndex.value = index;
  previewVisible.value = true;
};
</script>

<template>
  <div class="page-container">
    <div class="p-6">
      <h1 class="mb-4 text-2xl font-bold">MediaPreview 组件演示</h1>
      <p class="mb-6 text-gray-600">
        媒体预览组件，支持图片、视频、音频的全屏预览
      </p>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">图片预览</h2>
        <div class="flex gap-4">
          <Button type="primary" @click="openPreview(imageItems, 0)">
            预览图片1
          </Button>
          <Button type="primary" @click="openPreview(imageItems, 1)">
            预览图片2
          </Button>
          <Button type="primary" @click="openPreview(imageItems, 2)">
            预览图片3
          </Button>
        </div>
        <p class="mt-4 text-sm text-gray-500">
          提示：使用 Ctrl/Cmd + 滚轮可以缩放图片，方向键切换图片，Esc
          关闭预览
        </p>
      </div>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">视频预览</h2>
        <Button type="primary" @click="openPreview(videoItems, 0)">
          预览视频
        </Button>
      </div>

      <div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">音频预览</h2>
        <Button type="primary" @click="openPreview(audioItems, 0)">
          预览音频
        </Button>
      </div>

      <MediaPreview
        v-model:visible="previewVisible"
        :current="currentIndex"
        :items="[...imageItems, ...videoItems, ...audioItems]"
      />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>

