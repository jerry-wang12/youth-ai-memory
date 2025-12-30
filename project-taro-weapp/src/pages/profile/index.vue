<template>
  <view class="profile-page">
    <PageBackground />
    
    <view class="content">
      <view class="profile-header">
        <view class="avatar">
          <text class="avatar-text">T</text>
        </view>
        <view class="user-info">
          <text class="user-name">Taro 用户</text>
          <text class="user-desc">欢迎使用 Taro Vue3 模板</text>
        </view>
      </view>
      
      <view class="menu-list card">
        <view class="menu-item">
          <text class="menu-icon">🌐</text>
          <text class="menu-text">语言设置</text>
          <text class="menu-value">{{ localeName }}</text>
          <view class="arrow-right"></view>
        </view>
        
        <view class="menu-item" @tap="toggleTheme">
          <text class="menu-icon">🎨</text>
          <text class="menu-text">主题设置</text>
          <text class="menu-value">{{ currentTheme === 'blue' ? '蓝色' : '红色' }}</text>
          <view class="arrow-right"></view>
        </view>
        
        <view class="menu-item">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于模板</text>
          <text class="menu-value">v1.0.0</text>
          <view class="arrow-right"></view>
        </view>
      </view>
    </view>
    
    <CustomTabBar :current="2" :tab-items="tabItems" />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useDidShow } from '@tarojs/taro'
import { PageBackground, CustomTabBar } from '@/components'
import { toggleTheme, themeState } from '@/store/theme'
import { useLocaleStore } from '@/stores/locale'
import type { TabBarItem } from '@/components/CustomTabBar/types'
import './index.scss'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    PageBackground,
    CustomTabBar
  },
  setup() {
    const localeStore = useLocaleStore()
    const currentTheme = ref(themeState.currentTheme)
    
    const localeName = computed(() => localeStore.currentLocaleName)

    const tabItems: TabBarItem[] = [
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

    useDidShow(() => {
      currentTheme.value = themeState.currentTheme
    })

    const handleToggleTheme = () => {
      toggleTheme()
      currentTheme.value = themeState.currentTheme
    }

    return {
      currentTheme,
      localeName,
      tabItems,
      toggleTheme: handleToggleTheme
    }
  }
})
</script>

