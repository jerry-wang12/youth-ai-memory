# 图标示例

## 基础使用

```vue
<MdiMagnify class="text-lg" />
<MdiDelete style="color: hsl(var(--primary))" />
```

## TableLayout actionButtons

```typescript
const actionButtons: ActionButton[] = [
  { text: '新增', icon: MdiPlus, type: 'primary', onClick: showCreate },
  { text: '导出', icon: MdiDownload, onClick: handleExport },
];
```

## 新增图标

```typescript
/** 下载图标 */
export const MdiDownload = createIconifyIcon('mdi:download-outline');
```
