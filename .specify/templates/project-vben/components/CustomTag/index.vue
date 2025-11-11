<script lang="ts" setup>
/**
 * CustomTag 组件
 *
 * 自定义标签组件，支持图标、颜色自定义和删除功能
 *
 * 主要特性：
 * - 🎨 支持自定义颜色
 * - 🖼️ 支持自定义图标
 * - ✖️ 可选的删除功能
 * - 🏷️ 系统标签/自定义标签区分
 * - ⚡ 流畅的动画效果
 */
import { computed } from 'vue';

// TODO: 导入您项目中的图标组件
// 需要导入：MdiClose
// 示例：import { MdiClose } from '@/icons';
import { MdiClose } from '../../icons/placeholder'; // TODO: 替换为实际的图标导入路径

export interface CustomTagProps {
  closable?: boolean;
  color?: string;
  disabled?: boolean;
  icon?: string;
  iconComponent?: any;
  id?: number | string;
  isBadgeShow?: boolean;
  name: string;
  type?: 'CUSTOM' | 'custom' | 'SYS' | 'system';
}

interface CustomTagEmits {
  click: [id?: number | string];
  close: [id?: number | string];
}

const props = withDefaults(defineProps<CustomTagProps>(), {
  id: undefined,
  type: 'custom',
  color: '#0066FF',
  icon: undefined,
  iconComponent: undefined,
  closable: false,
  disabled: false,
  isBadgeShow: false,
});

const emit = defineEmits<CustomTagEmits>();

// 计算标签类型
const isSystemTag = computed(() => {
  return props.type === 'SYS' || props.type === 'system';
});

// 计算是否可删除
const isDeletable = computed(() => {
  return props.closable && !isSystemTag.value && !props.disabled;
});

// 处理关闭事件
const handleClose = (e: Event) => {
  e.stopPropagation();
  if (isDeletable.value) {
    emit('close', props.id);
  }
};

// 处理点击事件
const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.id);
  }
};
</script>

<template>
  <div
    :class="{
      'system-tag': isSystemTag,
      'closable-tag': isDeletable,
      'disabled-tag': disabled,
    }"
    :style="{ backgroundColor: color }"
    class="custom-tag"
    @click="handleClick"
  >
    <!-- 图标 -->
    <component :is="iconComponent" v-if="iconComponent" class="tag-icon" />

    <!-- 标签文本 -->
    <span class="tag-text">{{ name }}</span>

    <!-- 删除按钮 -->
    <MdiClose v-if="isDeletable" class="delete-icon" @click="handleClose" />
  </div>
</template>

<style scoped>
/* 自定义标签样式 */
.custom-tag {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 24px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  user-select: none;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
  transition: all 0.2s ease;
}

/* 可删除标签需要为删除按钮预留空间 */
.closable-tag {
  padding-right: 28px;
}

.custom-tag:hover:not(.disabled-tag) {
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  transform: scale(1.05);
}

.custom-tag.disabled-tag {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 图标样式 */
.tag-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

/* 标签文本样式 */
.tag-text {
  line-height: 1;
  white-space: nowrap;
}

/* 删除按钮样式 */
.delete-icon {
  position: absolute;
  top: 50%;
  right: 8px;
  width: 14px;
  height: 14px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translateY(-50%);
}

.custom-tag:hover .delete-icon {
  opacity: 0.8;
}

.delete-icon:hover {
  opacity: 1 !important;
}

/* 系统标签样式 */
.system-tag {
  position: relative;
}
</style>
