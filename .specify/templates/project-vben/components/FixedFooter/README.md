# FixedFooter 固定底部栏

固定在页面底部的操作栏，通过 `leftOffset` 控制左侧偏移（可与侧边栏宽度联动，由调用方传入）。无业务依赖。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| leftOffset | number \| string | 0 | 左侧偏移（数字为 px） |
| zIndex | number | 100 | z-index |
| padding | string | '16px 24px' | 内边距 |
| maxWidth | string | '100%' | 内容最大宽度 |

## 使用示例

```vue
<FixedFooter :left-offset="sidebarWidth">
  <a-button type="primary">提交</a-button>
</FixedFooter>
```
