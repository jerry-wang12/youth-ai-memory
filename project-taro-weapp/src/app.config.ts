/**
 * 应用全局配置
 * 定义页面路由、TabBar、窗口样式等
 */

export default defineAppConfig({
  // 主包页面
  pages: [
    'pages/home/index',
    'pages/docs/index',
    'pages/profile/index'
  ],

  // 子包配置（按需添加）
  subPackages: [
    // {
    //   root: 'subPages/other',
    //   pages: ['about/index']
    // }
  ],

  // 窗口样式
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro Template',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F5F7FA'
  },

  // TabBar 配置（使用自定义 TabBar）
  tabBar: {
    custom: true,
    color: '#666666',
    selectedColor: '#326292',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/docs/index',
        text: '文档'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  },

  // 启用暗黑模式支持
  darkmode: false,

  // 懒加载分包
  lazyCodeLoading: 'requiredComponents'
})
