# DetailModal 参考

## Props

- `visible` / `v-model:visible`
- `header`: DetailHeader
- `layout`: 'flat' | 'tabs'
- `tabs`: Tab 配置（tabs 布局时）
- `width`: 弹窗宽度
- `loading`: 加载状态

## Slots

- `#content`: flat 布局内容
- `#tab-{key}`: tabs 布局各 Tab 内容
- `#footer`: 固定底部操作区

## 样式类

| 类名 | 作用 |
|------|------|
| detail-form-container | 主容器，padding 32px |
| detail-field-group | 字段组，网格布局 |
| detail-field | 单字段容器 |
| detail-field-full | 占满整行 |
| detail-field-label | 标签（13px 灰色） |
| detail-field-value | 值（15px） |
| detail-field-text | 长文本 |
| detail-tag | 胶囊标签 |
| detail-attachment-image | 图片 |

## 完整样式块（复制到页面 scoped style）

```css
.detail-form-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px;
  background: hsl(var(--card));
}
.detail-field-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid hsl(var(--border));
}
.detail-field-group:last-child { border-bottom: none; }
.detail-field { display: flex; flex-direction: column; gap: 8px; }
.detail-field-full { grid-column: 1 / -1; }
.detail-field-label {
  font-size: 13px; font-weight: 500; color: hsl(var(--muted-foreground));
}
.detail-field-value { font-size: 15px; color: hsl(var(--foreground)); }
.detail-field-text { line-height: 1.6; white-space: pre-wrap; }
.detail-tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 13px;
  color: hsl(var(--primary));
  background: hsl(var(--primary) / 10%);
  border-radius: 6px;
}
@media (max-width: 768px) {
  .detail-field-group { grid-template-columns: 1fr; }
}
```

## DetailDrawer

用法与 DetailModal 类似，从右侧滑出，默认 `width="70vw"`，适合复杂详情。
