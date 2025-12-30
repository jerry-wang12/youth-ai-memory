<template>
  <view class="page-background" :style="backgroundStyle" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'PageBackground',
  props: {
    // 起始颜色
    startColor: {
      type: String,
      default: 'rgba(50, 98, 146, 0.3)' // 默认蓝色
    },
    // 结束颜色
    endColor: {
      type: String,
      default: 'rgba(50, 98, 146, 0.08)'
    },
    // 渐变角度
    angle: {
      type: Number,
      default: 240
    }
  },
  setup(props) {
    const backgroundStyle = computed(() => {
      return {
        background: `linear-gradient(${props.angle}deg, ${props.startColor} 0%, ${props.endColor} 100%)`
      }
    })

    return {
      backgroundStyle
    }
  }
})
</script>

