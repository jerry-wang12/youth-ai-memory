<script setup lang="ts">
/**
 * AttachmentPreview 组件
 *
 * 通用的附件预览组件，展示已上传的附件列表
 *
 * 主要特性：
 * - 🖼️ 支持图片缩略图预览
 * - 📄 支持多种文件类型图标
 * - 👁️ 图片点击可全屏预览
 * - 📥 非图片文件点击可下载/打开
 * - 📱 响应式设计
 */
import { computed, ref } from 'vue';

import { Avatar } from 'ant-design-vue';

import MediaPreview from '../MediaPreview/index.vue';

import {
  MdiFileDocumentOutline,
  MdiFilePdfBox,
  VscodeIconsFileTypeExcel,
  VscodeIconsFileTypePowerpoint,
  VscodeIconsFileTypeWord,
} from '#/icons';

// TODO: 替换为您项目中的文件上传响应类型
// 示例：import type { UploadServiceResponse } from '#/api/core/file';
export interface UploadServiceResponse {
  filename: string;
  url: string;
  type: string;
  size: number | string;
  path?: string;
  checksum?: string;
}

interface Props {
  attachments: UploadServiceResponse[];
  maxDisplay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 4,
});

// 判断文件类型
const isImage = (fileType: string) => {
  return fileType.startsWith('image/');
};

const isPdf = (fileType: string) => {
  return fileType === 'application/pdf';
};

// 获取文件图标组件
const getFileIconComponent = (fileType: string) => {
  if (isPdf(fileType)) {
    return MdiFilePdfBox;
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return VscodeIconsFileTypeWord;
  }
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
    return VscodeIconsFileTypeExcel;
  }
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
    return VscodeIconsFileTypePowerpoint;
  }
  return MdiFileDocumentOutline;
};

// 格式化文件大小
const formatFileSize = (size: number | string) => {
  const sizeNum = typeof size === 'string' ? Number.parseInt(size, 10) : size;
  if (sizeNum < 1024) {
    return `${sizeNum}B`;
  }
  if (sizeNum < 1024 * 1024) {
    return `${(sizeNum / 1024).toFixed(1)}KB`;
  }
  if (sizeNum < 1024 * 1024 * 1024) {
    return `${(sizeNum / (1024 * 1024)).toFixed(1)}MB`;
  }
  return `${(sizeNum / (1024 * 1024 * 1024)).toFixed(1)}GB`;
};

// 显示的附件列表
const displayAttachments = computed(() => {
  return props.attachments.slice(0, props.maxDisplay);
});

// 是否有更多附件
const hasMore = computed(() => {
  return props.attachments.length > props.maxDisplay;
});

// 剩余附件数量
const remainingCount = computed(() => {
  return props.attachments.length - props.maxDisplay;
});

// MediaPreview 相关状态
const mediaPreviewVisible = ref(false);
const mediaItems = ref<
  Array<{
    name: string;
    type: 'audio' | 'image' | 'video';
    url: string;
  }>
>([]);
const currentMediaIndex = ref(0);

// 处理附件点击
const handleAttachmentClick = (attachment: UploadServiceResponse) => {
  if (!attachment.url) return;

  if (isImage(attachment.type)) {
    // 图片类型 - 使用 MediaPreview 预览
    const allImages = props.attachments
      .filter((item) => isImage(item.type))
      .map((item) => ({
        name: item.filename,
        type: 'image' as const,
        url: item.url,
      }));

    mediaItems.value = allImages;
    // 找到当前点击图片在图片列表中的索引
    const imageIndex = allImages.findIndex(
      (item) => item.url === attachment.url,
    );
    currentMediaIndex.value = Math.max(imageIndex, 0);
    mediaPreviewVisible.value = true;
  } else {
    // 非图片类型 - 直接在新窗口打开
    window.open(attachment.url, '_blank');
  }
};
</script>

<template>
  <div v-if="attachments.length > 0" class="attachment-preview">
    <div class="attachment-list">
      <div
        v-for="attachment in displayAttachments"
        :key="attachment.path || attachment.url"
        class="attachment-item"
        @click="handleAttachmentClick(attachment)"
      >
        <!-- 图片预览 -->
        <div v-if="isImage(attachment.type)" class="attachment-image">
          <img
            :alt="attachment.filename"
            :src="attachment.url"
            class="attachment-img"
            loading="lazy"
          />
          <div class="attachment-overlay">
            <div class="attachment-name">{{ attachment.filename }}</div>
            <div class="attachment-size">
              {{ formatFileSize(attachment.size) }}
            </div>
          </div>
        </div>

        <!-- 文件图标预览 -->
        <div v-else class="attachment-file">
          <div class="attachment-file-icon">
            <component
              :is="getFileIconComponent(attachment.type)"
              class="file-icon"
            />
          </div>
          <div class="attachment-file-info">
            <div :title="attachment.filename" class="attachment-file-name">
              {{ attachment.filename }}
            </div>
            <div class="attachment-file-size">
              {{ formatFileSize(attachment.size) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 更多附件提示 -->
      <div v-if="hasMore" class="attachment-more">
        <div class="more-indicator">
          <Avatar :size="32" class="more-avatar">
            <template #icon>
              <span class="text-sm">+{{ remainingCount }}</span>
            </template>
          </Avatar>
          <div class="more-text">更多附件</div>
        </div>
      </div>
    </div>

    <!-- 媒体预览组件 -->
    <MediaPreview
      v-model:visible="mediaPreviewVisible"
      :current="currentMediaIndex"
      :items="mediaItems"
    />
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .attachment-image {
    width: 100px;
    height: 100px;
  }

  .attachment-file {
    width: 100px;
    height: 100px;
  }

  .attachment-file-icon {
    height: 70px;
  }

  .file-icon {
    font-size: 65px !important;
  }
}

.attachment-preview {
  margin-top: 8px;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.attachment-item:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  transform: translateY(-2px);
}

/* 图片预览样式 */
.attachment-image {
  position: relative;
  width: 120px;
  height: 120px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.attachment-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 6px 8px;
  font-size: 11px;
  line-height: 1.3;
  color: white;
  background: linear-gradient(transparent, rgb(0 0 0 / 70%));
}

.attachment-name {
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-size {
  opacity: 0.8;
}

/* 文件预览样式 */
.attachment-file {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  padding: 0;
  overflow: hidden;
  text-align: center;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.attachment-file-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
}

.file-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
  font-size: 80px !important;
  color: hsl(var(--primary)) !important;
}

.attachment-file-info {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px 6px 6px;
  background: linear-gradient(transparent, rgb(255 255 255 / 95%));
}

.attachment-file-name {
  margin-bottom: 2px;
  overflow: hidden;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
  color: #333;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-file-size {
  font-size: 9px;
  color: #666;
}

/* 更多附件样式 */
.attachment-more {
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-indicator {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.more-avatar {
  width: 40px !important;
  height: 40px !important;
  color: #666 !important;
  background-color: #d9d9d9 !important;
}

.more-text {
  font-size: 11px;
  color: #666;
}
</style>

