import { CreateParams, GetTasksParams, GetTasksResponse, UpdateTaskParams } from "./types";
import { apiFetch } from "./utils";


/**
 * 获取任务
 * @returns 
 */
export function getTasks(params: GetTasksParams): Promise<GetTasksResponse> {
  return apiFetch('/api/task/getTasks', params)
}


/**
 * 删除任务
 * @returns 
 */
export function deleteTask(params: {id: string}): Promise<GetTasksResponse> {
  return apiFetch('/api/task/deleteTask', params)
}


/**
 * 新增任务
 * @returns 
 */
export function createTask(params: CreateParams): Promise<void> {
  return apiFetch('/api/task/createTask', params)
}


/**
 * 更新任务
 * @returns 
 */
export function updateTask(params: UpdateTaskParams): Promise<void> {
  return apiFetch('/api/task/updateTask', params)
}