export enum ACTION_TYPE {
  'CREATE' = 'CREATE',
  'EDIT' = 'EDIT',
  'VIEW' = 'VIEW'
} 


export interface Page {
  page?: number;
  pageSize?: number;
  total?: number,
}

export enum PERMISSION_ENUM {
  /**
   * 超级管理员
   */
  'ADMIN' = 'ADMIN',
  /**
   * 默认
   */
  'DEFAULT' = 'DEFAULT'
}

export enum GENDER_ENUM {
  '男' = '男',
  '女' = '女'
}


export interface UserInfo {
  /**
   * 名字
   */
  name: string;
  /**
   * 权限
   */
  permission: PERMISSION_ENUM;
  taskInfo: {
    /**
     * 任务总数：
     */
    taskNum: number
    /**
     * 未完成任务数量：
     */
    taskUnfinishedNum: number
    /**
     * 待确认任务数量：
     */
    taskUnConfirmedNum: number
  }
  /**
   * 账号
   */
  username: string;
  /**
   * 创建时间
   */
  registerAt: string;
  /**
   * 是否注销
   */
  isLogout?: boolean;
}


export interface LoginParams {
  /**
   * 账号
   */
  username?: string;
  /**
   * 密码
   */
  password?: string;
}

export interface LoginResponse extends UserInfo {
  token: string
}


export interface RegisterParams extends LoginParams{
  /**
   * 名字
   */
  name?: string;
  /**
   * 权限
   */
  permission?: string;
}



export interface GetUsersParams {
  /**
   * 姓名
   */
  name?: string;
  /**
   * 账号
   */
  username?: string;
  /**
   * 创建时间
   */
  registerAt?: string;
  /**
   * 是否注销
   */
  isLogout?: boolean;
}

export enum TASK_STATUS {
  /**
   * 未完成
   */
  UNFINISHED = 'UNFINISHED',
  /**
   * 已完成
   */
  COMPLETED = 'COMPLETED',
  /**
   * 未确认
   */
  UNCONFIRMED = 'UNCONFIRMED',
  /**
   * 废弃 abolish
   */
  ABOLISH = 'ABOLISH',
}

export const taskStatusOptions = [
  { label: '未确认', value: TASK_STATUS.UNCONFIRMED, color: 'warning' },
  { label: '已完成', value: TASK_STATUS.COMPLETED, color: 'success' },
  { label: '未完成', value: TASK_STATUS.UNFINISHED, color: 'red' },
  { label: '已废弃', value: TASK_STATUS.ABOLISH, color: 'default' },
]


export interface GetTasksParams extends Page{
  /**
   * 任务ID
   */
  id?: string;
  /**
   * 任务名称
   */
  taskName?: string;
  /**
   * 任务状态
   */
  taskStatus?: TASK_STATUS;
  /**
   * 创建人Id
   */
  createOwnerId?: string;
  /**
   * 接收人Id
   */
  recipientId?: string;
  /**
   * 创建时间
   */
  createdAt?: [string, string];
  /**
   * 完成时间
   */
  downAt?: [string, string];
  /**
   * 截止时间
   */
  deadlineAt?: [string, string];
}

export interface Task extends Omit<GetTasksParams, 'createdAt' | 'downAt' | 'deadlineAt'> {
  /**
   * 创建人名字
   */
  createOwner?: string;
  /**
   * 接收人名字
   */
  recipient?: string;
  /**
   * 任务介绍
   */
  taskInfo?: string;
    /**
   * 创建时间
   */
  createdAt?: string;
  /**
   * 完成时间
   */
  downAt?: string;
  /**
   * 截止时间
   */
  deadlineAt?: string;
  /**
   * 任务进度
   */
  taskProgress?: string
}

export interface GetTasksResponse extends Page {
  tasks: Task[]
}

export interface CreateParams extends Pick<Task, 'taskName' | 'taskStatus' | 'recipientId' | 'taskInfo' | 'taskProgress' | 'deadlineAt'>{

}

export interface UpdateTaskParams extends CreateParams, Pick<Task, 'id'> {
  
}