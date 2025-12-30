<template>
  <view :class="['image-loader', customClass]">
    <!-- 加载占位符 -->
    <view v-if="loading" class="image-placeholder">
      <view class="loading-skeleton"></view>
      <view class="loading-spinner">
        <view class="spinner-circle"></view>
      </view>
    </view>

    <!-- 错误占位符 -->
    <view v-else-if="error" class="image-error">
      <view class="error-icon-wrapper">
        <view class="error-icon"></view>
      </view>
      <text class="error-text">加载失败</text>
    </view>

    <!-- 实际图片 -->
    <image
      v-show="!loading && !error"
      :src="src"
      :mode="mode"
      :class="['image-content', { 'image-loaded': imageLoaded }]"
      :lazy-load="lazyLoad"
      @load="handleImageLoad"
      @error="handleImageError"
    />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue'
import type { ImageMode } from './types'
import './index.scss'

export default defineComponent({
  name: 'ImageLoader',
  props: {
    // 图片地址
    src: {
      type: String,
      required: true
    },
    // 图片裁剪模式
    mode: {
      type: String as PropType<ImageMode>,
      default: 'aspectFill' as ImageMode
    },
    // 是否懒加载
    lazyLoad: {
      type: Boolean,
      default: true
    },
    // 自定义类名
    customClass: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const loading = ref(true)
    const error = ref(false)
    const imageLoaded = ref(false)

    // 图片加载成功
    const handleImageLoad = () => {
      loading.value = false
      error.value = false
      imageLoaded.value = true
    }

    // 图片加载失败
    const handleImageError = () => {
      loading.value = false
      error.value = true
      imageLoaded.value = false
    }

    // 监听 src 变化，重置状态
    watch(() => props.src, () => {
      if (props.src) {
        loading.value = true
        error.value = false
        imageLoaded.value = false
      }
    })

    return {
      loading,
      error,
      imageLoaded,
      handleImageLoad,
      handleImageError
    }
  }
})
</script>

