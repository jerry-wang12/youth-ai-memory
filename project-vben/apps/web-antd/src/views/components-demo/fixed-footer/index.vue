<script setup lang="ts">
import { FixedFooter } from '#/components/FixedFooter';
</script>

<template>
  <div class="page-container">
    <div class="p-6 content-area">
      <h1 class="mb-4 text-2xl font-bold">FixedFooter 演示</h1>
      <p class="mb-6 text-gray-600">
        底部固定操作条，内容区已预留 <code>padding-bottom</code> 避免被遮挡。
        <br />
        <span class="text-sm text-amber-600">
          注：在真实项目中，为避免被侧边栏覆盖，可传入 <code>:left-offset="210"</code> 等值来指定左侧偏移量。
        </span>
      </p>

      <section class="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">长内容区域演示 1</h2>
        <div class="flex h-40 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-gray-400">
          请向下滚动页面，查看底部固定效果
        </div>
      </section>

      <section class="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">长内容区域演示 2</h2>
        <div class="flex h-64 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-gray-400">
          内容块 2
        </div>
      </section>

      <section class="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 class="mb-4 text-lg font-semibold">长内容区域演示 3</h2>
        <div class="flex h-64 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-gray-400">
          内容块 3
        </div>
      </section>
    </div>

    <!-- 使用 w-full 和 justify-end 将按钮推到右侧 -->
    <FixedFooter :left-offset="0">
      <div class="flex w-full items-center justify-end gap-3">
        <a-button>重置</a-button>
        <a-button type="primary">保存更改</a-button>
      </div>
    </FixedFooter>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.content-area {
  padding-bottom: 24px;
}
</style>
