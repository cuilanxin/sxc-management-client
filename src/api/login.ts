import { LoginParams, LoginResponse, RegisterParams } from "./types";
import { apiFetch } from "./utils";



/**
 * 注册
 * @returns 
 */
export function register(params: RegisterParams): Promise<void> {
  return apiFetch('/api/auth/register', params)
}


/**
 * 登录
 * @returns 
 */
export function login(params: LoginParams): Promise<LoginResponse> {
  return apiFetch('/api/auth/login', params)
}


/**
 * 退出
 * @returns 
 */
export function exitUser(): Promise<void> {
  return apiFetch('/api/auth/exitUser', { })
}
