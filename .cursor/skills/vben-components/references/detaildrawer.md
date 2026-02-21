# DetailDrawer 参考

与 DetailModal 类似，以 Drawer 形式从右侧滑出，适合复杂详情。

## 与 DetailModal 差异

- 默认 `width="70vw"`
- 从右侧滑出，保留列表上下文
- 支持水印和自定义 Footer
- Props/Slots 与 DetailModal 相同

## 使用示例

```vue
<DetailDrawer
  v-model:visible="visible"
  :header="header"
  layout="flat"
  width="70vw"
>
  <template #content>
    <div class="p-6">详情内容...</div>
  </template>
</DetailDrawer>
```

样式类用法与 DetailModal 相同，复用 `detail-form-container`、`detail-field-group` 等。
