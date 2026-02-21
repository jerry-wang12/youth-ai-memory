<script setup lang="ts">
import type {
  FileItem,
  UniversalUploadEmits,
  UniversalUploadProps,
} from './types';
import { FileStatus } from './types';

import { ref, watch } from 'vue';

import { message } from 'ant-design-vue';

import { MdiDownload, MdiUpload } from '#/icons';

const props = withDefaults(defineProps<UniversalUploadProps>(), {
  visible: false,
  title: '文件上传',
  width: '600px',
  accept: '*',
  maxSize: 10 * 1024 * 1024,
  maxCount: undefined,
  multiple: false,
  drag: false,
  showPreview: false,
  buttonText: '选择文件',
  disabled: false,
  autoUpload: true,
  showFileList: true,
  templateUrl: undefined,
  templateName: '模板文件',
});

const emit = defineEmits<UniversalUploadEmits>();

const files = ref<FileItem[]>([]);
const fileList = ref<any[]>([]);

const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

const validateFile = (file: File): { error?: string; valid: boolean } => {
  if (props.maxSize && file.size > props.maxSize) {
    return {
      valid: false,
      error: `文件大小不能超过 ${Math.round(props.maxSize / 1024 / 1024)}MB`,
    };
  }
  if (props.accept && props.accept !== '*') {
    const acceptTypes = props.accept.split(',').map((t) => t.trim());
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const mime = file.type;
    const ok = acceptTypes.some((t) =>
      t.startsWith('.') ? ext === t.toLowerCase() : mime.includes(t),
    );
    if (!ok) return { valid: false, error: `只支持 ${props.accept} 格式的文件` };
  }
  return { valid: true };
};

const syncFiles = (list: any[]) => {
  files.value = list.map((f: any) => {
    const raw = f.originFileObj || f;
    const v = validateFile(raw);
    return {
      id: f.uid || generateId(),
      name: f.name,
      size: f.size,
      status: (() => {
        if (!v.valid) return FileStatus.ERROR;
        if (f.status === 'done') return FileStatus.SUCCESS;
        if (f.status === 'error') return FileStatus.ERROR;
        return FileStatus.PENDING;
      })(),
      progress: f.percent || 0,
      file: raw,
      error: v.valid ? f.error : v.error,
    };
  });
  emit('change', files.value);
};

const handleFileChange = ({ fileList: list }: any) => {
  fileList.value = list;
  syncFiles(list);

  if (props.autoUpload) {
    const pending = files.value.filter((f) => f.status === FileStatus.PENDING);
    for (const item of pending) {
      processFileUpload(item);
    }
  }
};

const processFileUpload = async (fileItem: FileItem) => {
  if (!fileItem.file) {
    fileItem.status = FileStatus.ERROR;
    fileItem.error = '文件对象不存在';
    return;
  }
  fileItem.status = FileStatus.UPLOADING;
  fileItem.progress = 0;

  try {
    const progressInterval = setInterval(() => {
      if (fileItem.progress < 90) {
        fileItem.progress += Math.random() * 20;
        emit('progress', fileItem.progress);
      }
    }, 200);

    let result: any;
    if (props.uploadApi) {
      result = await props.uploadApi(fileItem.file);
    } else {
      await new Promise((r) => setTimeout(r, 1000 + Math.random() * 2000));
      result = { id: Date.now(), name: fileItem.name };
    }

    clearInterval(progressInterval);
    fileItem.progress = 100;
    fileItem.status = FileStatus.SUCCESS;
    emit('success', { success: true, data: result, message: '上传成功', file: fileItem.file });
  } catch (error: any) {
    fileItem.status = FileStatus.ERROR;
    fileItem.error = error.message || '上传失败';
    emit('error', new Error(error.message || '上传失败'));
  }
};

const handleRemove = (file: any) => {
  const idx = fileList.value.findIndex((f) => f.uid === file.uid);
  if (idx !== -1) {
    fileList.value.splice(idx, 1);
    syncFiles(fileList.value);
    emit('remove', file);
  }
};

const downloadTemplate = async () => {
  try {
    let blob: Blob;
    let fileName: string;
    if (props.templateApi) {
      blob = await props.templateApi();
      fileName = props.templateName || '模板文件';
    } else if (props.templateUrl) {
      const resp = await fetch(props.templateUrl);
      blob = await resp.blob();
      fileName = props.templateName || '模板文件';
    } else {
      message.error('未配置模板下载');
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    message.success('模板下载成功');
  } catch (error: any) {
    message.error(`模板下载失败: ${error.message}`);
  }
};

const handleCancel = () => {
  emit('update:visible', false);
  files.value = [];
  fileList.value = [];
};

const handleConfirmUpload = async () => {
  if (files.value.length === 0) {
    message.warning('请先选择文件');
    return;
  }
  const pending = files.value.filter((f) => f.status === FileStatus.PENDING);
  if (pending.length === 0) {
    if (files.value.some((f) => f.status === FileStatus.SUCCESS)) {
      handleCancel();
      return;
    }
    message.warning('没有待上传的文件');
    return;
  }
  for (const item of pending) {
    await processFileUpload(item);
  }
  if (files.value.every((f) => f.status === FileStatus.SUCCESS || f.status === FileStatus.ERROR)) {
    handleCancel();
  }
};

watch(
  () => props.visible,
  (v) => {
    if (!v) {
      files.value = [];
      fileList.value = [];
    }
  },
);
</script>

<template>
  <a-modal :open="visible" :title="title" :width="width" @cancel="handleCancel">
    <div class="universal-upload">
      <div v-if="templateApi || templateUrl" class="template-download">
        <div class="template-content">
          <div class="template-info">
            <p class="template-title">请先下载模板文件：</p>
            <p class="template-hint">按照模板格式填写信息后上传</p>
          </div>
          <a-button class="download-template-btn" type="primary" @click="downloadTemplate">
            <template #icon><MdiDownload /></template>
            <span>下载模板</span>
          </a-button>
        </div>
      </div>

      <div class="upload-area">
        <a-upload-dragger
          v-if="drag"
          :accept="accept"
          :before-upload="() => false"
          :disabled="disabled"
          :file-list="fileList"
          :multiple="multiple"
          class="upload-dragger"
          @change="handleFileChange"
          @remove="handleRemove"
        >
          <div class="upload-content">
            <div class="upload-icon"><MdiUpload /></div>
            <div class="upload-text">{{ buttonText }}</div>
            <div class="upload-hint">支持拖拽上传，或点击选择文件</div>
          </div>
        </a-upload-dragger>

        <div v-else class="upload-button-area">
          <a-upload
            :accept="accept"
            :before-upload="() => false"
            :disabled="disabled"
            :file-list="fileList"
            :multiple="multiple"
            @change="handleFileChange"
            @remove="handleRemove"
          >
            <a-button :disabled="disabled" class="upload-button" size="large" type="primary">
              <MdiUpload />
              {{ buttonText }}
            </a-button>
          </a-upload>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button
          :disabled="fileList.length === 0"
          :loading="files.some((f) => f.status === 'uploading')"
          type="primary"
          @click="handleConfirmUpload"
        >
          {{ files.some((f) => f.status === 'uploading') ? '上传中...' : '确认上传' }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<style scoped>
@media (max-width: 768px) {
  .template-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .upload-content {
    padding: 30px 15px;
  }

  .upload-icon {
    font-size: 36px;
  }
}

.universal-upload {
  width: 100%;
}

.template-download {
  padding: 16px;
  margin-bottom: 16px;
  background: #eff6ff;
  border-radius: 8px;
}

.template-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.template-info {
  flex: 1;
}

.template-title {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  color: #1e40af;
}

.template-hint {
  margin: 0;
  font-size: 12px;
  color: #3b82f6;
}

.download-template-btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  white-space: nowrap;
}

.upload-area {
  margin-bottom: 24px;
}

.upload-dragger {
  margin-top: 20px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
}

.upload-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 48px;
  color: #9ca3af;
}

.upload-text {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
}

.upload-button-area {
  padding: 20px;
  text-align: center;
}

.upload-button {
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
