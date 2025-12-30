<template>
  <view :class="['image-uploader', { circle: shape === 'circle' }]" @tap="handleChooseImage">
    <image v-if="imageUrl" :src="imageUrl" :class="['image-preview', { circle: shape === 'circle' }]"
      mode="aspectFill" />
    <view v-else :class="['image-placeholder', { circle: shape === 'circle' }]">
      <text class="placeholder-icon">+</text>
      <text class="placeholder-text">{{ placeholder }}</text>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue'
import Taro from '@tarojs/taro'
import './index.scss'

/**
 * 上传结果接口
 */
interface UploadResult {
  url: string
  [key: string]: any
}

/**
 * 上传函数类型
 */
type UploadFunction = (filePath: string) => Promise<UploadResult>

/**
 * 默认上传函数（示例实现，实际使用时请注入真实的上传函数）
 */
const defaultUploadFn: UploadFunction = async (filePath: string) => {
  // 这是一个示例实现，实际使用时应该注入真实的上传函数
  console.warn('ImageUploader: 使用默认上传函数，请通过 uploadFn prop 注入真实的上传函数')
  // 模拟上传，直接返回本地路径
  return { url: filePath }
}

export default defineComponent({
  name: 'ImageUploader',
  props: {
    // 图片URL
    modelValue: {
      type: String,
      default: ''
    },
    // 形状：circle 圆形 | square 方形
    shape: {
      type: String,
      default: 'square',
      validator: (value: string) => ['circle', 'square'].includes(value)
    },
    // 占位符文本
    placeholder: {
      type: String,
      default: '点击上传'
    },
    // 高度（仅方形时生效）
    height: {
      type: String,
      default: '320rpx'
    },
    // 上传函数（可注入）
    uploadFn: {
      type: Function as PropType<UploadFunction>,
      default: () => defaultUploadFn
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const imageUrl = ref(props.modelValue)

    // 监听外部值变化
    watch(() => props.modelValue, (newVal) => {
      imageUrl.value = newVal
    })

    // 选择图片
    const handleChooseImage = async () => {
      try {
        const res = await Taro.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        const tempFilePath = res.tempFilePaths[0]
        uploadImageFile(tempFilePath)
      } catch (err: any) {
        // 用户取消选择，静默处理
        if (err.errMsg && err.errMsg.includes('cancel')) {
          return
        }
        // 其他错误，显示提示
        console.error('选择图片失败:', err)
        Taro.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    }

    // 上传图片
    const uploadImageFile = async (filePath: string) => {
      try {
        Taro.showLoading({ title: '上传中...' })

        const result = await props.uploadFn(filePath)

        imageUrl.value = result.url
        emit('update:modelValue', result.url)
        emit('change', result.url)

        Taro.hideLoading()
        Taro.showToast({
          title: '上传成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('上传图片失败:', error)
        Taro.hideLoading()
        Taro.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    }

    return {
      imageUrl,
      handleChooseImage
    }
  }
})
</script>

