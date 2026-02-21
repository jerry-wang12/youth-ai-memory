# 图标参考

## 常用图标（src/icons/index.ts）

```typescript
// 通用
MdiMagnify, MdiRefresh, MdiClose, MdiFilter
// 操作
MdiPlus, MdiPencil, MdiDelete, MdiEye, MdiExport, MdiImport
// 状态
MdiCheck, MdiAlert, MdiInformation, MdiCloseCircle
// 导航
MdiHome, MdiMenu, MdiArrowLeft, MdiArrowRight
```

## 最佳实践

- 优先 outline 风格：`mdi:account-outline` 而非 `mdi:account`
- 添加 JSDoc：`/** 搜索图标 */ export const MdiMagnify = ...`
- 按功能分组（通用/操作/状态/导航）

## 大小与颜色

图标继承父元素 font-size 和 color，可用 Tailwind：`<MdiMagnify class="text-lg text-blue-500" />`
