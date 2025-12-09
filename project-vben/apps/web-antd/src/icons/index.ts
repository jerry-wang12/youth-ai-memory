/**
 * 应用图标管理
 *
 * 使用 createIconifyIcon 创建图标组件
 * 图标来源：https://icon-sets.iconify.design/
 *
 * 命名规范：
 * - PascalCase 命名
 * - 格式：{IconSet}{IconName}
 * - 示例：MdiMagnify, LucideSearch
 *
 * 优先使用 outline 风格图标
 *
 * ⚠️ 禁止使用 emoji 图标
 */

import { createIconifyIcon } from '@vben/icons';

// ==================== 通用图标 ====================

/** 搜索 */
export const MdiMagnify = createIconifyIcon('mdi:magnify');

/** 刷新 */
export const MdiRefresh = createIconifyIcon('mdi:refresh');

/** 关闭 */
export const MdiClose = createIconifyIcon('mdi:close');

/** 筛选 */
export const MdiFilter = createIconifyIcon('mdi:filter-outline');

/** 下拉展开 */
export const MdiChevronDown = createIconifyIcon('mdi:chevron-down');

/** 上拉收起 */
export const MdiChevronUp = createIconifyIcon('mdi:chevron-up');

/** 回车键 */
export const MdiKeyboardReturn = createIconifyIcon('mdi:keyboard-return');

// ==================== 操作图标 ====================

/** 新增/添加 */
export const MdiPlus = createIconifyIcon('mdi:plus');

/** 减少/缩小 */
export const MdiMinus = createIconifyIcon('mdi:minus');

/** 编辑 */
export const MdiPencil = createIconifyIcon('mdi:pencil-outline');

/** 删除 */
export const MdiDelete = createIconifyIcon('mdi:delete-outline');

/** 查看/眼睛 */
export const MdiEye = createIconifyIcon('mdi:eye-outline');

/** 导出 */
export const MdiExport = createIconifyIcon('mdi:export');

/** 导入 */
export const MdiImport = createIconifyIcon('mdi:import');

// ==================== 状态图标 ====================

/** 成功/对号 */
export const MdiCheck = createIconifyIcon('mdi:check');

/** 警告 */
export const MdiAlert = createIconifyIcon('mdi:alert-outline');

/** 信息 */
export const MdiInformation = createIconifyIcon('mdi:information-outline');

/** 错误 */
export const MdiCloseCircle = createIconifyIcon('mdi:close-circle-outline');

// ==================== 文件类型图标 ====================

/** 文档 */
export const MdiFileDocumentOutline = createIconifyIcon('mdi:file-document-outline');

/** PDF */
export const MdiFilePdfBox = createIconifyIcon('mdi:file-pdf-box');

/** Word 文档 */
export const VscodeIconsFileTypeWord = createIconifyIcon('vscode-icons:file-type-word');

/** Excel 文档 */
export const VscodeIconsFileTypeExcel = createIconifyIcon('vscode-icons:file-type-excel');

/** PowerPoint 文档 */
export const VscodeIconsFileTypePowerpoint = createIconifyIcon('vscode-icons:file-type-powerpoint');

// ==================== 其他常用图标 ====================

/** 设置 */
export const MdiCog = createIconifyIcon('mdi:cog-outline');

/** 用户 */
export const MdiAccount = createIconifyIcon('mdi:account-outline');

/** 用户（别名） */
export const MdiUser = createIconifyIcon('mdi:account-outline');

/** 旗帜 */
export const MdiFlag = createIconifyIcon('mdi:flag-outline');

/** 日历 */
export const MdiCalendar = createIconifyIcon('mdi:calendar-outline');

/** 时钟 */
export const MdiClock = createIconifyIcon('mdi:clock-outline');

/** 标签 */
export const MdiTag = createIconifyIcon('mdi:tag-outline');

/** 文件夹 */
export const MdiFolder = createIconifyIcon('mdi:folder-outline');

/** 文件 */
export const MdiFile = createIconifyIcon('mdi:file-outline');

/** 下载 */
export const MdiDownload = createIconifyIcon('mdi:download');

/** 上传 */
export const MdiUpload = createIconifyIcon('mdi:upload');

// ==================== 导航图标 ====================

/** 首页 */
export const MdiHome = createIconifyIcon('mdi:home-outline');

/** 菜单 */
export const MdiMenu = createIconifyIcon('mdi:menu');

/** 返回 */
export const MdiArrowLeft = createIconifyIcon('mdi:arrow-left');

/** 前进 */
export const MdiArrowRight = createIconifyIcon('mdi:arrow-right');

/**
 * 如何添加新图标：
 *
 * 1. 访问 https://icon-sets.iconify.design/
 * 2. 搜索需要的图标（推荐使用 Material Design Icons - mdi）
 * 3. 复制图标名称（如 account-outline）
 * 4. 使用 createIconifyIcon 创建：
 *    export const MdiAccountOutline = createIconifyIcon('mdi:account-outline');
 * 5. 添加 JSDoc 注释说明图标用途
 *
 * 推荐图标集：
 * - mdi: Material Design Icons (最全面)
 * - lucide: Lucide Icons (简洁美观)
 * - carbon: Carbon Icons (IBM设计)
 * - heroicons: Heroicons (Tailwind官方)
 * - vscode-icons: VS Code Icons (文件类型图标)
 */

