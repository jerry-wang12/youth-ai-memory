import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:component',
      order: 10,
      title: $t('page.componentsDemo.title'),
    },
    name: 'ComponentsDemo',
    path: '/components-demo',
    children: [
      {
        name: 'AttachmentPreviewDemo',
        path: '/attachment-preview',
        component: () => import('#/views/components-demo/attachment-preview/index.vue'),
        meta: {
          icon: 'lucide:image',
          title: $t('page.componentsDemo.attachmentPreview'),
        },
      },
      {
        name: 'DetailDrawerDemo',
        path: '/detail-drawer',
        component: () => import('#/views/components-demo/detail-drawer/index.vue'),
        meta: {
          icon: 'lucide:sidebar',
          title: $t('page.componentsDemo.detailDrawer'),
        },
      },
      {
        name: 'EmptyStateDemo',
        path: '/empty-state',
        component: () => import('#/views/components-demo/empty-state/index.vue'),
        meta: {
          icon: 'lucide:inbox',
          title: $t('page.componentsDemo.emptyState'),
        },
      },
      {
        name: 'FilterFormDemo',
        path: '/filter-form',
        component: () => import('#/views/components-demo/filter-form/index.vue'),
        meta: {
          icon: 'lucide:filter',
          title: $t('page.componentsDemo.filterForm'),
        },
      },
      {
        name: 'MediaPreviewDemo',
        path: '/media-preview',
        component: () => import('#/views/components-demo/media-preview/index.vue'),
        meta: {
          icon: 'lucide:play',
          title: $t('page.componentsDemo.mediaPreview'),
        },
      },
      {
        name: 'TimelineDemo',
        path: '/timeline',
        component: () => import('#/views/components-demo/timeline/index.vue'),
        meta: {
          icon: 'lucide:clock',
          title: $t('page.componentsDemo.timeline'),
        },
      },
      {
        name: 'TableLayoutDemo',
        path: '/table-layout',
        component: () => import('#/views/components-demo/table-layout/index.vue'),
        meta: {
          icon: 'lucide:table',
          title: $t('page.componentsDemo.tableLayout'),
        },
      },
      {
        name: 'RichEditorDemo',
        path: '/rich-editor',
        component: () => import('#/views/components-demo/rich-editor/index.vue'),
        meta: {
          icon: 'lucide:file-text',
          title: $t('page.componentsDemo.richEditor'),
        },
      },
      {
        name: 'DetailModalDemo',
        path: '/detail-modal',
        component: () => import('#/views/components-demo/detail-modal/index.vue'),
        meta: {
          icon: 'lucide:square',
          title: $t('page.componentsDemo.detailModal'),
        },
      },
      {
        name: 'CustomTagDemo',
        path: '/custom-tag',
        component: () => import('#/views/components-demo/custom-tag/index.vue'),
        meta: {
          icon: 'lucide:tag',
          title: $t('page.componentsDemo.customTag'),
        },
      },
    ],
  },
];

export default routes;

