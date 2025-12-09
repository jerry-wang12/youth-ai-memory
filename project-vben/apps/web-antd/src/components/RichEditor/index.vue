<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export interface RichEditorProps {
  modelValue: string;
  placeholder?: string;
  rows?: number;
}

const props = defineProps<RichEditorProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const quillEl = ref<HTMLDivElement | null>(null);
const quillInstance = ref<any>(null);
const localValue = ref(props.modelValue || '');

const rows = computed(() => props.rows ?? 10);
const placeholder = computed(() => props.placeholder ?? '请输入内容…');

const useQuill = computed(
  () => typeof window !== 'undefined' && (window as any).Quill,
);

onMounted(() => {
  // 如果全局存在 Quill（比如在 index.html 通过 CDN 注入），则启用富文本编辑器
  if (useQuill.value && quillEl.value) {
    const Q = (window as any).Quill;
    const options = {
      theme: 'snow',
      placeholder: placeholder.value,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean'],
        ],
      },
    };
    quillInstance.value = new Q(quillEl.value, options);
    // 初始内容
    if (props.modelValue) {
      quillInstance.value.clipboard.dangerouslyPasteHTML(props.modelValue);
    }
    // 内容变化事件
    quillInstance.value.on('text-change', () => {
      const html = quillEl.value!.querySelector('.ql-editor')?.innerHTML || '';
      emit('update:modelValue', html);
    });
  }
});

onBeforeUnmount(() => {
  if (quillInstance.value) {
    // Quill 没有 destroy API，置空引用即可
    quillInstance.value = null;
  }
});

// 外部变更时同步内部值
watch(
  () => props.modelValue,
  (val) => {
    if (useQuill.value && quillInstance.value) {
      const current =
        quillEl.value!.querySelector('.ql-editor')?.innerHTML || '';
      if (val !== current) {
        quillInstance.value.clipboard.dangerouslyPasteHTML(val || '');
      }
    } else {
      localValue.value = val || '';
    }
  },
);

// textarea 模式下双向绑定
watch(localValue, (val) => {
  if (!useQuill.value) emit('update:modelValue', val);
});
</script>

<template>
  <div class="rich-editor">
    <div v-if="useQuill" ref="quillEl" class="quill-container"></div>
    <textarea
      v-else
      class="form-control"
      :rows="rows"
      v-model="localValue"
      :placeholder="placeholder"
    ></textarea>
  </div>
</template>

<style scoped>
.quill-container {
  min-height: 220px;
}

.rich-editor :deep(.ql-container.ql-snow) {
  min-height: 220px;
  border-radius: 0 0 0.5rem 0.5rem;
}

.rich-editor :deep(.ql-toolbar.ql-snow) {
  border-radius: 0.5rem 0.5rem 0 0;
}
</style>
