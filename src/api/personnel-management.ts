import { GetUsersParams, UserInfo } from "./types";
import { apiFetch } from "./utils";

/**
 * 当前用户信息
 * @returns 
 */
export function getUserInfo(): Promise<{
  usersInfo: UserInfo
}> {
  return apiFetch('/api/auth/getUserInfo', {  })
}

/**
 * 获取所有用户
 * @returns 
 */
export function getUsers(params?: GetUsersParams): Promise<{
  users: UserInfo[]
}> {
  return apiFetch('/api/auth/getUsers', params || { })
}


/**
 * 注销用户
 * @returns 
 */
export function logoutUser(params: { username: string }): Promise<void> {
  return apiFetch('/api/auth/logoutUser', params)
}


/**
 * 删除用户
 * @returns 
 */
export function deleteUser(params: { username: string }): Promise<void> {
  return apiFetch('/api/auth/deleteUser', params)
}

/**
 * 更新用户
 * @returns 
 */
export function updateUser(params: { username: string }): Promise<void> {
  return apiFetch('/api/auth/updateUser', params)
}