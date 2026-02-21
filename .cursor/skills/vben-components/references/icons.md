# 图标 (#/icons) 参考

统一从 `#/icons` 导入，禁止 emoji。

## 添加新图标

1. 访问 https://icon-sets.iconify.design/ 查找
2. 在 `src/icons/index.ts` 添加：
   ```typescript
   export const MdiIconName = createIconifyIcon('mdi:icon-name');
   ```
3. 使用：`import { MdiIconName } from '#/icons'`

## 命名

{IconSet}{IconName}，PascalCase。推荐图标集：mdi, lucide, carbon, heroicons

## 常用

MdiMagnify, MdiRefresh, MdiClose, MdiFilter, MdiPlus, MdiPencil, MdiDelete, MdiEye, MdiExport, MdiImport, MdiCheck, MdiAlert, MdiInformation, MdiCloseCircle, MdiHome, MdiMenu, MdiArrowLeft, MdiArrowRight
