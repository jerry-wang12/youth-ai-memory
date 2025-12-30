<template>
  <view class="custom-tabbar">
    <view class="tabbar-container">
      <view v-for="(item, index) in finalTabItems" :key="item.key"
        :class="['tabbar-item', { active: current === index }]" @tap="handleTabClick(index, item.pagePath)">
        <view class="tab-icon-wrapper">
          <image :src="current === index ? item.selectedIconPath : item.iconPath" class="tab-icon" mode="aspectFit" />
          <!-- 角标数字 -->
          <view v-if="item.badge && item.badge > 0" class="tab-badge">
            <text>{{ item.badge > 99 ? '99+' : item.badge }}</text>
          </view>
          <!-- 红点 -->
          <view v-if="item.dot && !item.badge" class="tab-dot"></view>
        </view>
        <text class="tab-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import Taro from '@tarojs/taro'
import type { TabBarItem } from './types'
import './index.scss'

// 默认 TabBar 配置（示例）
const DEFAULT_TAB_ITEMS: TabBarItem[] = [
  {
    key: 'home',
    text: '首页',
    pagePath: '/pages/home/index',
    iconPath: '/assets/tabbar/home.png',
    selectedIconPath: '/assets/tabbar/home-active.png'
  },
  {
    key: 'docs',
    text: '文档',
    pagePath: '/pages/docs/index',
    iconPath: '/assets/tabbar/docs.png',
    selectedIconPath: '/assets/tabbar/docs-active.png'
  },
  {
    key: 'profile',
    text: '我的',
    pagePath: '/pages/profile/index',
    iconPath: '/assets/tabbar/profile.png',
    selectedIconPath: '/assets/tabbar/profile-active.png'
  }
]

export default defineComponent({
  name: 'CustomTabBar',
  props: {
    current: {
      type: Number as PropType<number>,
      required: true,
      default: 0
    },
    tabItems: {
      type: Array as PropType<TabBarItem[]>,
      default: () => DEFAULT_TAB_ITEMS
    }
  },
  setup(props) {
    // 计算最终的 TabBar 配置
    const finalTabItems = computed(() => {
      return props.tabItems || DEFAULT_TAB_ITEMS
    })

    // 处理 Tab 点击
    const handleTabClick = (index: number, pagePath: string) => {
      if (index === props.current) {
        return
      }

      Taro.switchTab({
        url: pagePath
      }).catch((err) => {
        console.error('TabBar 切换失败:', err)
      })
    }

    return {
      finalTabItems,
      handleTabClick
    }
  }
})
</script>

