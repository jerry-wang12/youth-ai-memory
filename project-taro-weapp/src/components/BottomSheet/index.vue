<template>
  <!-- page-meta 控制页面滚动和样式 -->
  <page-meta v-if="visible" :page-style="pageStyle" />

  <!-- 使用 AtFloatLayout 作为基础 -->
  <view :class="['bottom-sheet-wrapper', { 'is-visible': visible }]">
    <AtFloatLayout :is-opened="visible" :title="title" @close="handleClose">
      <!-- 内容区域 -->
      <view class="bottom-sheet-content">
        <slot />
      </view>
    </AtFloatLayout>
  </view>

  <!-- 底部固定操作区 - 独立于 wrapper，确保在最上层 -->
  <view v-if="visible && $slots.footer" class="bottom-sheet-footer">
    <slot name="footer" />
  </view>
</template>

<script>
import { ref, watch } from 'vue'
import { AtFloatLayout } from 'taro-ui-vue3'
import './index.scss'

export default {
  name: 'BottomSheet',
  components: {
    AtFloatLayout
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'update:visible'],
  setup(props, { emit }) {
    const pageStyle = ref('overflow: hidden;')

    // 监听 visible 变化
    watch(() => props.visible, (newVal) => {
      if (!newVal) {
        // 关闭时恢复页面滚动
        pageStyle.value = ''
      } else {
        // 打开时阻止页面滚动
        pageStyle.value = 'overflow: hidden;'
      }
    }, { immediate: true })

    // 关闭弹窗
    const handleClose = () => {
      emit('close')
      emit('update:visible', false)
    }

    return {
      pageStyle,
      handleClose
    }
  }
}
</script>

