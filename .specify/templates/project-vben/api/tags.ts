/**
 * 标签管理 API 模块
 *
 * TODO 列表：
 * 1. 修改 requestClient 导入，使用您项目的请求客户端
 * 2. 根据实际后端 API 调整接口路径
 * 3. 根据实际需求调整数据类型定义
 * 4. 添加错误处理和类型守卫
 */

// TODO: 替换为您项目中的实际请求客户端
// 示例：import { request } from '@/utils/request';
// const requestClient = request;
declare const requestClient: {
  delete: (url: string) => Promise<any>;
  get: (url: string, config?: any) => Promise<any>;
  patch: (url: string, data?: any) => Promise<any>;
  post: (url: string, data?: any) => Promise<any>;
};

/**
 * 标签数据结构
 */
export interface Tag {
  color: string;
  description: string;
  enabled: boolean;
  icon: string;
  name: string;
  objectId: string;
  students: any[];
  type: 'CUSTOM' | 'SYS';
  version: number;
}

/**
 * 分页信息
 */
export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * 标签列表响应
 */
export interface TagListResponse {
  content: Tag[];
  page: PageInfo;
}

/**
 * 创建标签参数
 */
export interface CreateTagParams {
  color: string;
  description?: string;
  icon?: string;
  name: string;
  type: 'CUSTOM' | 'SYS';
}

/**
 * 标签查询参数
 */
export interface TagQueryParams {
  keyword?: string;
  page?: number;
  size?: number;
  type?: 'CUSTOM' | 'SYS';
}

/**
 * 更新标签参数
 */
export interface UpdateTagParams {
  color?: string;
  description?: string;
  enabled?: boolean;
  icon?: string;
  name?: string;
  objectId?: string;
  type?: 'CUSTOM' | 'SYS';
}

/**
 * 获取标签列表
 * @param params 查询参数
 * @returns 标签列表和分页信息
 *
 * @example
 * ```ts
 * const result = await getTags({
 *   keyword: '测试',
 *   type: 'CUSTOM',
 *   page: 0,
 *   size: 10
 * });
 * ```
 */
export async function getTags(
  params?: TagQueryParams,
): Promise<TagListResponse> {
  return requestClient.get('/tags', { params });
}

/**
 * 创建标签
 * @param tagData 标签数据
 * @returns 创建的标签对象
 *
 * @example
 * ```ts
 * const tag = await createTag({
 *   name: '重要',
 *   type: 'CUSTOM',
 *   color: '#FF0000',
 *   icon: 'MdiFlag',
 *   description: '重要的学生标签'
 * });
 * ```
 */
export async function createTag(tagData: CreateTagParams): Promise<Tag> {
  return requestClient.post('/tags', tagData);
}

/**
 * 更新标签
 * @param tagData 标签数据（必须包含 objectId）
 * @returns 更新后的标签对象
 *
 * @example
 * ```ts
 * const tag = await updateTag({
 *   objectId: '123',
 *   name: '重要（已修改）',
 *   enabled: true
 * });
 * ```
 */
export async function updateTag(tagData: UpdateTagParams): Promise<Tag> {
  return requestClient.patch('/tags', tagData);
}

/**
 * 删除标签
 * @param tagId 标签ID
 * @returns 删除是否成功
 *
 * @example
 * ```ts
 * const success = await deleteTag('123');
 * if (success) {
 *   console.log('删除成功');
 * }
 * ```
 */
export async function deleteTag(tagId: number | string): Promise<boolean> {
  return requestClient.delete(`/tags/${tagId}`);
}

/**
 * 获取学生标签列表
 * @param id 学生ID
 * @returns 学生的标签列表
 *
 * @example
 * ```ts
 * const tags = await getStudentTagList('student-123');
 * tags.forEach(tag => {
 *   console.log(tag.name, tag.color);
 * });
 * ```
 */
export async function getStudentTagList(id: string): Promise<
  Array<{
    color: string;
    createdAt: string;
    description: string;
    icon: string;
    id: string;
    isActive: boolean;
    name: string;
    type: 'custom' | 'system';
    updatedAt: string;
  }>
> {
  return requestClient.get(`/students/${id}/tags`);
}

/**
 * 修改学生标签，全量覆盖
 * @param id 学生ID
 * @param data 标签ID数组
 * @returns 更新后的学生标签列表
 *
 * @example
 * ```ts
 * const updatedTags = await modifyStudentTags('student-123', [
 *   'tag-1',
 *   'tag-2',
 *   'tag-3'
 * ]);
 * ```
 */
export async function modifyStudentTags(
  id: string,
  data: string[],
): Promise<
  Array<{
    color: string;
    createdAt: string;
    description: string;
    icon: string;
    id: string;
    isActive: boolean;
    name: string;
    type: 'custom' | 'system';
    updatedAt: string;
  }>
> {
  return requestClient.patch(`/students/${id}/tags`, data);
}

/**
 * 删除学生的某个标签
 * @param id 学生ID
 * @param tagId 标签ID
 * @returns 操作结果
 *
 * @example
 * ```ts
 * await removeStudentTags('student-123', 'tag-456');
 * ```
 */
export async function removeStudentTags(
  id: string,
  tagId: string,
): Promise<any> {
  return requestClient.delete(`/students/${id}/tags/${tagId}`);
}
