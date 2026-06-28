import { PERMISSION_ENUM } from "@/api/types";

/**
 * 是否显示人员管理菜单
 * @param permission 权限
 */
export function isPersonnelManagementMenu(permission?: string,) {
  return PERMISSION_ENUM.ADMIN === permission
}


/**
 * 是否显示任务管理 搜索条件（部分）
 * @param permission 权限
 */
export function isTaskManagementSearchForm(permission?: string,) {
  return PERMISSION_ENUM.ADMIN === permission
}