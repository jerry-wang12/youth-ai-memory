<template>
  <view class="home-page">
    <PageBackground />
    
    <view class="content">
      <view class="header">
        <text class="title">Taro Vue3 模板</text>
        <text class="subtitle">开箱即用的小程序开发模板</text>
      </view>
      
      <view class="features card">
        <view class="section-title">特性展示</view>
        
        <view class="feature-list">
          <view class="feature-item" @tap="showImageUploader">
            <view class="feature-icon">📷</view>
            <view class="feature-info">
              <text class="feature-name">ImageUploader</text>
              <text class="feature-desc">图片上传组件</text>
            </view>
            <view class="arrow-right"></view>
          </view>
          
          <view class="feature-item" @tap="showBottomSheet">
            <view class="feature-icon">📋</view>
            <view class="feature-info">
              <text class="feature-name">BottomSheet</text>
              <text class="feature-desc">底部弹窗组件</text>
            </view>
            <view class="arrow-right"></view>
          </view>
          
          <view class="feature-item" @tap="toggleTheme">
            <view class="feature-icon">🎨</view>
            <view class="feature-info">
              <text class="feature-name">主题切换</text>
              <text class="feature-desc">当前: {{ currentTheme }}</text>
            </view>
            <view class="arrow-right"></view>
          </view>
        </view>
      </view>
      
      <view class="demo-section card">
        <view class="section-title">ImageLoader 示例</view>
        <view class="image-demo">
          <ImageLoader 
            src="https://picsum.photos/300/200" 
            mode="aspectFill"
            custom-class="demo-image"
          />
        </view>
      </view>
    </view>
    
    <CustomTabBar :current="0" :tab-items="tabItems" />
    
    <!-- BottomSheet 弹窗 -->
    <BottomSheet v-model:visible="sheetVisible" title="底部弹窗示例">
      <view class="sheet-content">
        <text class="sheet-text">这是 BottomSheet 组件的演示内容</text>
        <text class="sheet-text">支持自定义内容和底部操作区</text>
      </view>
      <template #footer>
        <button class="btn btn-primary" @tap="sheetVisible = false">确定</button>
      </template>
    </BottomSheet>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDidShow } from '@tarojs/taro'
import { PageBackground, CustomTabBar, ImageLoader, BottomSheet } from '@/components'
import { toggleTheme, themeState } from '@/store/theme'
import type { TabBarItem } from '@/components/CustomTabBar/types'
import './index.scss'

export default defineComponent({
  name: 'HomePage',
  components: {
    PageBackground,
    CustomTabBar,
    ImageLoader,
    BottomSheet
  },
  setup() {
    const sheetVisible = ref(false)
    const currentTheme = ref(themeState.currentTheme)

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

    const showImageUploader = () => {
      // 导航到图片上传演示页面
    }

    const showBottomSheet = () => {
      sheetVisible.value = true
    }

    const handleToggleTheme = () => {
      toggleTheme()
      currentTheme.value = themeState.currentTheme
    }

    return {
      sheetVisible,
      currentTheme,
      tabItems,
      showImageUploader,
      showBottomSheet,
      toggleTheme: handleToggleTheme
    }
  }
})
</script>

