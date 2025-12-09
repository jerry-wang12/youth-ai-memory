<script setup lang="ts">
/**
 * MediaPreview 组件
 *
 * 通用的媒体预览组件，支持图片/视频/音频
 *
 * 主要特性：
 * - 🖼️ 支持图片、视频、音频预览
 * - 🔍 支持图片缩放（滚轮、按钮）
 * - ⌨️ 支持键盘快捷键（方向键切换、Esc关闭）
 * - 📥 支持下载功能
 * - 📱 响应式设计
 */
import { computed, ref } from 'vue';

import { Button, Modal } from 'ant-design-vue';

import {
  MdiClose,
  MdiDownload,
  MdiMagnify,
  MdiMinus,
  MdiPlus,
} from '#/icons';

export interface MediaItem {
  url: string;
  name: string;
  type: 'audio' | 'image' | 'video';
}

interface MediaPreviewProps {
  visible: boolean;
  items: MediaItem[];
  current?: number;
}

const props = withDefaults(defineProps<MediaPreviewProps>(), {
  visible: false,
  items: () => [],
  current: 0,
});

const emit = defineEmits<{
  close: [];
  'update:visible': [value: boolean];
}>();

const currentIndex = ref(props.current);
const scale = ref(1);
const minScale = 0.5;
const maxScale = 3;

// 当前媒体项
const currentItem = computed(() => {
  return props.items[currentIndex.value] || null;
});

// 是否有多个媒体项
const hasMultiple = computed(() => {
  return props.items.length > 1;
});

// 是否可以上一个
const canPrevious = computed(() => {
  return hasMultiple.value && currentIndex.value > 0;
});

// 是否可以下一个
const canNext = computed(() => {
  return hasMultiple.value && currentIndex.value < props.items.length - 1;
});

const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});

// 关闭预览
const handleClose = () => {
  scale.value = 1; // 重置缩放
  emit('update:visible', false);
  emit('close');
};

// 上一个
const handlePrevious = () => {
  if (canPrevious.value) {
    currentIndex.value--;
    scale.value = 1; // 切换时重置缩放
  }
};

// 下一个
const handleNext = () => {
  if (canNext.value) {
    currentIndex.value++;
    scale.value = 1; // 切换时重置缩放
  }
};

// 下载当前媒体
const handleDownload = () => {
  if (!currentItem.value) return;

  const link = document.createElement('a');
  link.href = currentItem.value.url;
  link.download = currentItem.value.name;
  link.target = '_blank';
  document.body.append(link);
  link.click();
  link.remove();
};

// 放大图片
const zoomIn = () => {
  if (scale.value < maxScale) {
    scale.value = Math.min(scale.value + 0.25, maxScale);
  }
};

// 缩小图片
const zoomOut = () => {
  if (scale.value > minScale) {
    scale.value = Math.max(scale.value - 0.25, minScale);
  }
};

// 重置缩放
const resetZoom = () => {
  scale.value = 1;
};

// 计算图片样式
const imageStyle = computed(() => {
  if (currentItem.value?.type === 'image') {
    return {
      transform: `scale(${scale.value})`,
      transition: 'transform 0.2s ease',
    };
  }
  return {};
});

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.visible) return;

  switch (e.key) {
    case '+':
    case '=': {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoomIn();
      }
      break;
    }

    case '-': {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoomOut();
      }
      break;
    }
    case '0': {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        resetZoom();
      }
      break;
    }
    case 'ArrowLeft': {
      handlePrevious();
      break;
    }
    case 'ArrowRight': {
      handleNext();
      break;
    }
    case 'Escape': {
      handleClose();
      break;
    }
  }
};

// 监听鼠标滚轮缩放
const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }
};

// 监听键盘事件
document.addEventListener('keydown', handleKeydown);
</script>

<template>
  <Modal
    v-model:open="visible"
    :centered="true"
    :footer="null"
    class="media-preview-modal"
    width="70vw"
    @cancel="handleClose"
  >
    <template #closeIcon>
      <MdiClose class="text-lg text-white" />
    </template>

    <div
      v-if="currentItem"
      class="media-preview-container"
      @wheel="handleWheel"
    >
      <!-- 媒体内容 -->
      <div class="media-content">
        <!-- 图片 -->
        <img
          v-if="currentItem.type === 'image'"
          :alt="currentItem.name"
          :src="currentItem.url"
          :style="imageStyle"
          class="media-image"
        />

        <!-- 视频 -->
        <video
          v-else-if="currentItem.type === 'video'"
          :src="currentItem.url"
          class="media-video"
          controls
          preload="metadata"
        ></video>

        <!-- 音频 -->
        <audio
          v-else-if="currentItem.type === 'audio'"
          :src="currentItem.url"
          class="media-audio"
          controls
          preload="metadata"
        ></audio>
      </div>

      <!-- 导航按钮 -->
      <div v-if="hasMultiple" class="media-navigation">
        <button
          :disabled="!canPrevious"
          class="nav-button nav-previous"
          @click="handlePrevious"
        >
          ‹
        </button>
        <button
          :disabled="!canNext"
          class="nav-button nav-next"
          @click="handleNext"
        >
          ›
        </button>
      </div>

      <!-- 工具栏 -->
      <div class="media-toolbar">
        <div class="toolbar-left">
          <span class="media-name">{{ currentItem.name }}</span>
          <span v-if="hasMultiple" class="media-counter">
            {{ currentIndex + 1 }} / {{ props.items.length }}
          </span>
        </div>

        <div class="toolbar-right">
          <!-- 缩放控制（仅图片显示） -->
          <template v-if="currentItem.type === 'image'">
            <Button
              :disabled="scale <= minScale"
              type="text"
              @click="zoomOut"
            >
              <MdiMinus class="text-lg text-white" />
            </Button>

            <Button type="text" @click="resetZoom">
              <MdiMagnify class="text-lg text-white" />
            </Button>

            <Button :disabled="scale >= maxScale" type="text" @click="zoomIn">
              <MdiPlus class="text-lg text-white" />
            </Button>
          </template>

          <Button type="text" @click="handleDownload">
            <MdiDownload class="text-lg text-white" />
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .media-preview-modal {
    :deep(.ant-modal) {
      max-width: 95vw !important;
      max-height: 95vh !important;
    }

    :deep(.ant-modal-close) {
      top: 15px !important;
      right: 15px !important;
      width: 36px !important;
      height: 36px !important;
    }
  }

  .media-content {
    padding: 50px 15px 70px;
  }

  .media-image {
    max-width: calc(95vw - 30px);
    max-height: calc(95vh - 120px);
  }

  .media-video {
    max-width: calc(95vw - 30px);
    max-height: calc(95vh - 120px);
  }

  .media-audio {
    max-width: calc(95vw - 30px);
  }

  .media-toolbar {
    min-height: 70px;
    padding: 15px;
  }

  .media-name {
    max-width: 200px;
    font-size: 14px;
  }

  .toolbar-right .ant-btn {
    min-width: 36px;
    height: 36px;
    padding: 6px;
  }
}

:global(.media-preview-modal .ant-modal-content) {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.media-preview-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  min-height: 200px;
  background: transparent;
}

.media-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  padding: 60px 20px 80px;
}

.media-image {
  display: block;
  width: auto;
  max-width: calc(90vw - 40px);
  height: auto;
  max-height: calc(90vh - 140px);
  cursor: grab;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 50%);
}

.media-image:active {
  cursor: grabbing;
}

.media-video {
  width: auto;
  max-width: calc(90vw - 40px);
  height: auto;
  max-height: calc(90vh - 140px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 50%);
}

.media-audio {
  width: 400px;
  max-width: calc(90vw - 40px);
}

.media-navigation {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
  transform: translateY(-50%);
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  font-size: 24px;
  color: white;
  pointer-events: auto;
  cursor: pointer;
  background: rgb(0 0 0 / 60%);
  border: none;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.nav-button:hover:not(:disabled) {
  background: rgb(0 0 0 / 80%);
}

.nav-button:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.media-toolbar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  padding: 20px;
  background: linear-gradient(transparent, rgb(0 0 0 / 80%));
  border-radius: 0 0 8px 8px;
}

.toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.media-name {
  max-width: 300px;
  overflow: hidden;
  font-size: 16px;
  font-weight: 500;
  color: white;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgb(0 0 0 / 80%);
  white-space: nowrap;
}

.media-counter {
  font-size: 14px;
  color: rgb(255 255 255 / 80%);
  text-shadow: 0 1px 2px rgb(0 0 0 / 80%);
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.toolbar-right .ant-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 8px;
  background: rgb(0 0 0 / 30%);
  border: none;
  border-radius: 6px;
}

.toolbar-right .ant-btn:hover:not(:disabled) {
  background: rgb(255 255 255 / 20%);
}

.toolbar-right .ant-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

/* MediaPreview专用样式 - 限制作用范围 */
</style>

