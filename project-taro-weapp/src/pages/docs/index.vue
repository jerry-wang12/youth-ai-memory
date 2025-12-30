<template>
  <view class="docs-page">
    <PageBackground />
    
    <view class="content">
      <view class="header">
        <text class="title">文档中心</text>
      </view>
      
      <view class="doc-list card">
        <view class="doc-item" @tap="navigateTo('/subPages/docs/markdown/index')">
          <view class="doc-icon">📖</view>
          <view class="doc-info">
            <text class="doc-name">Markdown 组件演示</text>
            <text class="doc-desc">查看 MarkdownView 组件渲染效果</text>
          </view>
          <view class="arrow-right"></view>
        </view>
        
        <view class="doc-item">
          <view class="doc-icon">🧩</view>
          <view class="doc-info">
            <text class="doc-name">组件使用指南</text>
            <text class="doc-desc">了解各组件的使用方法</text>
          </view>
          <view class="arrow-right"></view>
        </view>
        
        <view class="doc-item">
          <view class="doc-icon">⚙️</view>
          <view class="doc-info">
            <text class="doc-name">开发规范</text>
            <text class="doc-desc">项目开发规范说明</text>
          </view>
          <view class="arrow-right"></view>
        </view>
      </view>
    </view>
    
    <CustomTabBar :current="1" :tab-items="tabItems" />
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Taro from '@tarojs/taro'
import { PageBackground, CustomTabBar } from '@/components'
import type { TabBarItem } from '@/components/CustomTabBar/types'
import './index.scss'

export default defineComponent({
  name: 'DocsPage',
  components: {
    PageBackground,
    CustomTabBar
  },
  setup() {
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

    const navigateTo = (url: string) => {
      Taro.navigateTo({ url })
    }

    return {
      tabItems,
      navigateTo
    }
  }
})
</script>

