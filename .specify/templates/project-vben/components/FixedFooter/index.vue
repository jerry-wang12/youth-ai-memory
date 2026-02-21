<script setup lang="ts">
/**
 * 固定底部 Footer 组件
 * 通过 leftOffset 控制左侧偏移（可与侧边栏宽度联动，由调用方传入）
 */
import { computed } from 'vue';

interface Props {
  /** 左侧偏移量（数字为 px，字符串可带单位），默认 0 */
  leftOffset?: number | string;
  /** 自定义 z-index，默认 100 */
  zIndex?: number;
  /** 自定义内边距 */
  padding?: string;
  /** 内容最大宽度 */
  maxWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
  leftOffset: 0,
  zIndex: 100,
  padding: '16px 24px',
  maxWidth: '100%',
});

const footerLeft = computed(() => {
  const v = props.leftOffset;
  if (v == null) return '0px';
  return typeof v === 'number' ? `${v}px` : String(v);
});

const footerStyle = computed(() => ({
  left: footerLeft.value,
  zIndex: props.zIndex,
  padding: props.padding,
}));

const contentStyle = computed(() => ({
  maxWidth: props.maxWidth,
}));
</script>

<template>
  <div :style="footerStyle" class="fixed-footer">
    <div :style="contentStyle" class="footer-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fixed-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 8px rgb(0 0 0 / 6%);
  transition: left 0.2s ease-in-out;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
}
</style>
