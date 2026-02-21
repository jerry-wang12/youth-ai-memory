---
name: vben-detaildrawer-detail-view
description: Implements complex detail view using DetailDrawer with right-side slide-out layout. Use when building detail drawers, complex detail pages, 70vw width, or when DetailModal is insufficient for long content in Vue Vben / Ant Design Vue projects.
---

# DetailDrawer 详情抽屉

在 Vue Vben 项目中，用 DetailDrawer 做复杂详情，从右侧滑出，适合长内容或需保留列表上下文。

## 与 DetailModal 区别

- 从右侧滑出，默认 `width="70vw"`
- 适合复杂详情、权限配置等
- Props/Slots 与 DetailModal 相同

## 基本用法

```vue
<DetailDrawer
  v-model:visible="visible"
  :header="header"
  layout="flat"
  width="70vw"
>
  <template #content>
    <div class="detail-form-container">
      <div class="detail-field-group">
        <div class="detail-field">
          <label class="detail-field-label">字段名</label>
          <div class="detail-field-value">字段值</div>
        </div>
      </div>
    </div>
  </template>
</DetailDrawer>
```

样式类与 DetailModal 相同：`detail-form-container`、`detail-field-group`、`detail-field` 等。

## 参考

- [reference.md](reference.md) - 完整说明
