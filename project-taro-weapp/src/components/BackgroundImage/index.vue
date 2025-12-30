<template>
  <view class="background-image" :style="{
    backgroundImage: `url(${src})`
  }"></view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'BackgroundImage',
  props: {
    src: {
      type: String,
      required: true
    }
  }
})
</script>

