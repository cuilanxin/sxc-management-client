import { login, register } from "@/api/login";
import { LoginResponse, RegisterParams } from "@/api/types";
import { FormInstance, message } from "antd";
import { useState } from "react";
import { useNavigate } from 'react-router';


export function useLogin(isRegister: boolean) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const onLogin = (form: FormInstance<RegisterParams>) => {
    setLoading(true);
    const messageClose = message.loading('登录中...', 0)
    form.validateFields().then(values => {

      
      (isRegister ? register(values) : login(values)).then(val => {
        if (isRegister) {
          localStorage.removeItem('register')
          message.success('注册成功！请在页面刷新后登录。', 1, () => {
            window.location.reload()
          });
        } else {
          localStorage.setItem('token', (val as LoginResponse).token);
          localStorage.setItem('username', (val as LoginResponse).username);
          // localStorage.setItem('permission', val.permission);
          message.success('登录成功！', 1, () => {
            navigate('/');
          });
          // cookieStore.set('token', val.token)
        }
      }, err => {
        message.error(err.message || '网络异常稍后重试！');
      }).finally(() => {
        messageClose()
        setLoading(false);
      })
    }, err => {
      messageClose()
      setLoading(false);
    })
  };

  return { onLogin, loading }
}