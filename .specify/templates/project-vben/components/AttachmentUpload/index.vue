<script setup lang="ts">
import type { UploadResponse } from '#/api/core/upload';

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { Modal, Progress, Spin } from 'ant-design-vue';

import { useUpload } from '#/hooks/useUpload';
import {
  MdiClose,
  MdiCloudUpload,
  MdiDelete,
  MdiDownload,
  MdiEye,
  MdiFile,
  MdiFileDocument,
  MdiFilePdf,
  MdiImage,
  MdiUpload,
} from '#/icons';

/**
 * 附件上传组件 Props
 */
interface AttachmentUploadProps {
  /** v-model 双向绑定的文件列表 */
  modelValue?: UploadResponse[];
  /** 允许的文件类型（如 'image/*,.pdf' 或 ['image/png', 'application/pdf']） */
  accept?: string;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 是否支持多文件 */
  multiple?: boolean;
  /** 最大文件数量 */
  maxCount?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 列表展示类型 */
  listType?: 'picture-card' | 'text';
  /** 上传模式：dragger-拖拽卡片模式，button-传统按钮模式 */
  uploadMode?: 'button' | 'dragger';
}

const props = withDefaults(defineProps<AttachmentUploadProps>(), {
  modelValue: () => [],
  accept: undefined,
  maxSize: 10,
  multiple: true,
  maxCount: undefined,
  disabled: false,
  listType: 'text',
  uploadMode: 'dragger',
});

const emit = defineEmits<{
  change: [value: UploadResponse[]];
  'update:modelValue': [value: UploadResponse[]];
}>();

// 上传逻辑
const { uploading, uploadProgress, uploadFile, validateFile } = useUpload();

// 本地文件列表
const fileList = ref<UploadResponse[]>([...(props.modelValue || [])]);

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    fileList.value = [...newVal];
  },
);

// 拖拽状态
const isDragging = ref(false);
const uploadAreaRef = ref<HTMLElement>();
const fileInputRef = ref<HTMLInputElement>();

// 预览相关
const previewVisible = ref(false);
const previewFile = ref<null | UploadResponse>(null);

/**
 * 触发文件选择
 */
function triggerFileSelect() {
  if (props.disabled) return;
  fileInputRef.value?.click();
}

/**
 * 处理文件选择
 */
async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = [...(target.files || [])];
  await handleFiles(files);
  // 清空 input，允许重复选择同一文件
  target.value = '';
}

/**
 * 处理文件上传
 */
async function handleFiles(files: File[]) {
  if (props.disabled || files.length === 0) return;

  // 检查数量限制
  if (props.maxCount && fileList.value.length + files.length > props.maxCount) {
    Modal.warning({
      title: '文件数量超限',
      content: `最多只能上传 ${props.maxCount} 个文件`,
    });
    return;
  }

  // 验证并上传文件
  for (const file of files) {
    if (validateFile(file, { accept: props.accept, maxSize: props.maxSize })) {
      try {
        const result = await uploadFile(file);
        fileList.value.push(result);
        updateValue();
      } catch (error) {
        console.error('文件上传失败:', error);
      }
    }
  }
}

/**
 * 更新 v-model 值
 */
function updateValue() {
  emit('update:modelValue', [...fileList.value]);
  emit('change', [...fileList.value]);
}

/**
 * 删除文件
 */
function removeFile(index: number) {
  fileList.value.splice(index, 1);
  updateValue();
}

/**
 * 预览文件
 */
function previewFileHandler(file: UploadResponse) {
  previewFile.value = file;
  previewVisible.value = true;
}

/**
 * 下载文件
 */
function downloadFile(file: UploadResponse) {
  window.open(file.url, '_blank');
}

/**
 * 判断是否为图片
 */
function isImage(file: UploadResponse): boolean {
  return file.type?.startsWith('image/') ?? false;
}

/**
 * 判断是否为 PDF
 */
function isPdf(file: UploadResponse): boolean {
  return file.type === 'application/pdf';
}

/**
 * 获取文件图标
 */
function getFileIcon(file: UploadResponse) {
  if (isImage(file)) return MdiImage;
  if (isPdf(file)) return MdiFilePdf;
  return MdiFileDocument;
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: null | number): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// 拖拽事件处理
function handleDragEnter(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (!props.disabled) {
    isDragging.value = true;
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  // 只有离开上传区域时才取消拖拽状态
  if (e.target === uploadAreaRef.value) {
    isDragging.value = false;
  }
}

async function handleDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = false;

  if (props.disabled) return;

  const files = [...(e.dataTransfer?.files || [])];
  await handleFiles(files);
}

// 粘贴事件处理
async function handlePaste(e: ClipboardEvent) {
  if (props.disabled) return;

  const items = e.clipboardData?.items;
  if (!items) return;

  const files: File[] = [];
  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  }

  if (files.length > 0) {
    await handleFiles(files);
  }
}

// 生命周期
onMounted(() => {
  // 监听全局粘贴事件
  document.addEventListener('paste', handlePaste);
});

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste);
});

// 计算是否可以继续上传
const canUpload = computed(() => {
  if (props.maxCount) {
    return fileList.value.length < props.maxCount;
  }
  return true;
});
</script>

<template>
  <div class="attachment-upload">
    <!-- 拖拽卡片上传模式 -->
    <div
      v-if="canUpload && uploadMode === 'dragger'"
      ref="uploadAreaRef"
      class="upload-area"
      :class="{
        'upload-area--dragging': isDragging,
        'upload-area--disabled': disabled,
      }"
      @click="triggerFileSelect"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="upload-input"
        @change="handleFileSelect"
      />

      <Spin :spinning="uploading">
        <div class="upload-content">
          <MdiCloudUpload class="upload-icon" />
          <div class="upload-text">
            <p class="upload-text-main">点击或拖拽文件到此区域上传</p>
            <p class="upload-text-hint">
              <template v-if="accept">支持文件类型：{{ accept }}</template>
              <template v-if="maxSize">，最大 {{ maxSize }}MB</template>
              <template v-if="maxCount">
                ，最多 {{ maxCount }} 个文件
              </template>
            </p>
            <p class="upload-text-hint">也可以使用 Ctrl+V 粘贴上传</p>
          </div>
        </div>
      </Spin>

      <!-- 上传进度 -->
      <div v-if="uploading" class="upload-progress">
        <Progress :percent="uploadProgress" :show-info="false" />
      </div>
    </div>

    <!-- 传统按钮上传模式 -->
    <div v-if="canUpload && uploadMode === 'button'" class="button-upload-area">
      <input
        ref="fileInputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="upload-input"
        @change="handleFileSelect"
      />

      <button
        type="button"
        class="upload-button"
        :disabled="disabled || uploading"
        @click="triggerFileSelect"
      >
        <MdiUpload class="upload-button-icon" />
        <span>{{ uploading ? '上传中...' : '选择文件' }}</span>
      </button>

      <!-- 上传提示 -->
      <div class="button-upload-hint">
        <template v-if="accept">支持：{{ accept }}</template>
        <template v-if="maxSize">，最大 {{ maxSize }}MB</template>
        <template v-if="maxCount">，最多 {{ maxCount }} 个</template>
      </div>

      <!-- 上传进度 -->
      <div v-if="uploading" class="upload-progress">
        <Progress :percent="uploadProgress" />
      </div>
    </div>

    <!-- 文件列表 -->
    <div v-if="fileList.length > 0" class="file-list">
      <div
        v-for="(file, index) in fileList"
        :key="file.path"
        class="file-item"
        :class="{ 'file-item--picture': listType === 'picture-card' }"
      >
        <!-- 图片卡片模式 -->
        <template v-if="listType === 'picture-card' && isImage(file)">
          <div class="file-item-picture">
            <img :src="file.url" :alt="file.filename" class="file-item-image" />
            <div class="file-item-actions">
              <MdiEye
                class="file-item-action-icon"
                @click.stop="previewFileHandler(file)"
              />
              <MdiDownload
                class="file-item-action-icon"
                @click.stop="downloadFile(file)"
              />
              <MdiDelete
                class="file-item-action-icon"
                @click.stop="removeFile(index)"
              />
            </div>
          </div>
          <div class="file-item-name">{{ file.filename }}</div>
        </template>

        <!-- 文本列表模式 -->
        <template v-else>
          <component
            :is="getFileIcon(file)"
            class="file-item-icon"
            :class="{
              'file-item-icon--image': isImage(file),
              'file-item-icon--pdf': isPdf(file),
            }"
          />
          <div class="file-item-info">
            <div class="file-item-name">{{ file.filename }}</div>
            <div class="file-item-size">{{ formatFileSize(file.size) }}</div>
          </div>
          <div class="file-item-actions">
            <MdiEye
              v-if="isImage(file) || isPdf(file)"
              class="file-item-action-icon"
              @click="previewFileHandler(file)"
            />
            <MdiDownload
              class="file-item-action-icon"
              @click="downloadFile(file)"
            />
            <MdiDelete
              class="file-item-action-icon file-item-action-icon--danger"
              @click="removeFile(index)"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <Modal
      v-model:open="previewVisible"
      :footer="null"
      :width="1200"
      :centered="true"
      wrap-class-name="attachment-preview-modal"
      class="preview-modal"
    >
      <template #closeIcon>
        <MdiClose />
      </template>
      <div v-if="previewFile" class="preview-content">
        <h3 class="preview-title">{{ previewFile.filename }}</h3>
        <div class="preview-body">
          <!-- 图片预览 -->
          <img
            v-if="isImage(previewFile)"
            :src="previewFile.url"
            :alt="previewFile.filename"
            class="preview-image"
          />
          <!-- PDF 预览 -->
          <iframe
            v-else-if="isPdf(previewFile)"
            :src="previewFile.url"
            class="preview-pdf"
          ></iframe>
          <!-- 其他文件提示下载 -->
          <div v-else class="preview-download">
            <MdiFile class="preview-download-icon" />
            <p>此文件类型不支持预览</p>
            <a
              :href="previewFile.url"
              target="_blank"
              class="preview-download-link"
            >
              点击下载查看
            </a>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.attachment-upload {
  width: 100%;
}

/* 上传区域 */
.upload-area {
  position: relative;
  padding: 32px;
  cursor: pointer;
  background-color: #fafafa;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.upload-area:hover {
  background-color: hsl(var(--primary) / 2%);
  border-color: hsl(var(--primary));
}

.upload-area--dragging {
  background-color: hsl(var(--primary) / 5%);
  border-color: hsl(var(--primary));
  transform: scale(1.01);
}

.upload-area--disabled {
  cursor: not-allowed;
  background-color: #f5f5f5;
  opacity: 0.6;
}

.upload-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.upload-icon {
  font-size: 48px;
  color: hsl(var(--primary));
  opacity: 0.6;
}

.upload-text {
  text-align: center;
}

.upload-text-main {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.upload-text-hint {
  margin: 4px 0;
  font-size: 14px;
  color: #999;
}

.upload-progress {
  margin-top: 16px;
}

/* 传统按钮上传模式 */
.button-upload-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.upload-button {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  background-color: hsl(var(--primary));
  border: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.upload-button:hover:not(:disabled) {
  background-color: hsl(var(--primary) / 90%);
  box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
  transform: translateY(-1px);
}

.upload-button:active:not(:disabled) {
  transform: translateY(0);
}

.upload-button:disabled {
  cursor: not-allowed;
  background-color: #d9d9d9;
  opacity: 0.6;
}

.upload-button-icon {
  font-size: 18px;
}

.button-upload-hint {
  font-size: 12px;
  color: #999;
}

/* 文件列表 */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.file-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.file-item:hover {
  background-color: hsl(var(--primary) / 2%);
  border-color: hsl(var(--primary));
}

.file-item--picture {
  display: inline-flex;
  flex-direction: column;
  width: 120px;
  padding: 8px;
}

.file-item-picture {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.file-item-picture:hover .file-item-actions {
  opacity: 1;
}

.file-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-item-icon {
  flex-shrink: 0;
  font-size: 32px;
  color: #8c8c8c;
}

.file-item-icon--image {
  color: hsl(var(--primary));
}

.file-item-icon--pdf {
  color: #e74c3c;
}

.file-item-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.file-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: #333;
  white-space: nowrap;
}

.file-item-size {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.file-item-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.file-item:hover .file-item-actions,
.file-item-picture .file-item-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 8px;
  background-color: rgb(0 0 0 / 50%);
  border-radius: 4px;
  transform: translate(-50%, -50%);
}

.file-item:not(.file-item--picture):hover .file-item-actions {
  position: static;
  background-color: transparent;
  opacity: 1;
  transform: none;
}

.file-item-action-icon {
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
}

.file-item-action-icon:hover {
  color: hsl(var(--primary));
}

.file-item-picture .file-item-action-icon {
  color: #fff;
}

.file-item-action-icon--danger:hover {
  color: #ff4d4f;
}

/* 预览弹窗 */
.preview-content {
  padding: 16px 0;
}

.preview-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.preview-body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.preview-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}

.preview-pdf {
  width: 100%;
  height: 75vh;
  min-height: 600px;
  border: none;
}

.preview-download {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 40px;
}

.preview-download-icon {
  font-size: 64px;
  color: #bfbfbf;
}

.preview-download p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.preview-download-link {
  padding: 8px 16px;
  font-size: 14px;
  color: hsl(var(--primary));
  text-decoration: none;
  border: 1px solid hsl(var(--primary));
  border-radius: 4px;
  transition: all 0.2s ease;
}

.preview-download-link:hover {
  color: #fff;
  background-color: hsl(var(--primary));
}

/* 预览弹窗全局样式 */
:deep(.attachment-preview-modal .ant-modal) {
  max-width: 95vw;
}

:deep(.attachment-preview-modal .ant-modal-body) {
  max-height: 85vh;
  padding: 16px 24px;
  overflow: hidden;
}

:deep(.attachment-preview-modal .ant-modal-content) {
  box-shadow: 0 8px 32px rgb(0 0 0 / 12%);
}
</style>

