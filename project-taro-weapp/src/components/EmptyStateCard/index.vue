<template>
  <view class="empty-state-card-wrapper">
    <view class="empty-state-card card">
      <!-- 图标区域 -->
      <view class="empty-icon-wrapper">
        <view class="empty-icon-bg">
          <!-- 优先使用图片，否则用 AtIcon -->
          <image v-if="iconSrc" :src="iconSrc" class="empty-icon-img" mode="aspectFit" />
          <AtIcon v-else :value="icon" :size="64" :color="iconColor" />
        </view>
      </view>

      <!-- 标题 -->
      <view class="empty-title">
        <text class="empty-title-text">{{ title }}</text>
      </view>

      <!-- 描述（可选） -->
      <view v-if="desc" class="empty-desc">
        <text class="empty-desc-text">{{ desc }}</text>
      </view>

      <!-- 刷新按钮（可选） -->
      <view v-if="showAction" class="empty-action">
        <button class="empty-refresh-btn" @tap="handleAction">
          <text>{{ actionText || '刷新' }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AtIcon } from 'taro-ui-vue3'

export default defineComponent({
  name: 'EmptyStateCard',
  components: { AtIcon },
  props: {
    // 图片路径（优先使用）
    iconSrc: {
      type: String,
      default: ''
    },
    // AtIcon 的图标名（备用）
    icon: {
      type: String,
      default: 'file-generic'
    },
    iconColor: {
      type: String,
      default: '#C7C7CC'
    },
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      default: ''
    },
    // 是否显示操作按钮
    showAction: {
      type: Boolean,
      default: false
    },
    actionText: {
      type: String,
      default: '刷新'
    }
  },
  emits: ['action'],
  setup(_props, { emit }) {
    const handleAction = () => {
      emit('action')
    }

    return {
      handleAction
    }
  }
})
</script>

<style lang="scss">
/* EmptyStateCard 组件样式 - 不使用 scoped（Taro 小程序不支持） */
.empty-state-card-wrapper {
  padding: 60rpx 0 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600rpx;

  .empty-state-card {
    width: 100%;
    max-width: 640rpx;
    padding: 96rpx 56rpx 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
    border-radius: 32rpx;
    box-shadow: none;
  }

  .empty-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;
  }

  .empty-icon-bg {
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    background: var(--color-bg-secondary, #eeeeee);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-icon-img {
    width: 96rpx;
    height: 96rpx;
  }

  .empty-title {
    text-align: center;
    margin-bottom: 16rpx;

    .empty-title-text {
      font-size: 34rpx;
      font-weight: 500;
      color: var(--color-text-secondary, #555555);
      line-height: 1.3;
    }
  }

  .empty-desc {
    text-align: center;
    padding: 0 32rpx;
    margin-top: 8rpx;

    .empty-desc-text {
      font-size: 28rpx;
      color: var(--color-text-tertiary, #999999);
      line-height: 1.7;
    }
  }

  .empty-action {
    width: 100%;
    margin-top: 40rpx;
    padding: 0 32rpx;
  }

  .empty-refresh-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: var(--color-primary, #326292);
    color: #ffffff;
    font-size: 30rpx;
    font-weight: 600;
    border: none;
    border-radius: 44rpx;
    box-shadow: 0 8rpx 24rpx rgba(50, 98, 146, 0.3);

    text {
      color: #ffffff;
    }
  }

  .empty-refresh-btn::after {
    border: none;
  }
}
</style>
