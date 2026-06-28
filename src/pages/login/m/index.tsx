// Login.tsx
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button
} from 'antd';

import style from './index.module.less';
import { useLogin } from '../useLodinHook';
import { RegisterParams } from '@/api/types';


const prefix = 'login-container'

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false)
  const [form] = Form.useForm<RegisterParams>();
  const { onLogin, loading } = useLogin(isRegister)

  useEffect(() => {
    const result = localStorage.getItem('register')
    setIsRegister(!!result)

    return () => {
      if (result) {
        localStorage.removeItem('register')
      }
    }
  }, [])


  // 表单提交处理
  const onFinish = async () => {
    onLogin(form)
  };



  return (
    <div className={style[prefix]}>
      <div className={style[prefix + "-background"]}>
        <div className={style[prefix + "-background-shape"]}></div>
        <div className={style[prefix + "-background-shape"]}></div>
      </div>

      <Form
        className={style[prefix + '-form']}
        // labelCol={{ flex: '0 0 120px' }}
        form={form}
        colon={false}
        layout="vertical"
        name="Login"
      >
        <h3>{isRegister ? 'Register Here' : 'Login Here'}</h3>

        {isRegister && (
          <Form.Item
            className={style[prefix + '-form-item']}
            name="name"
            label="名字"
            rules={[{ required: true }]}
          >
            <Input size='large' style={{ height: 50 }} placeholder='请输入名字...' allowClear />
          </Form.Item>
        )}

        <Form.Item
          className={style[prefix + '-form-item']}
          name="username"
          label="账号"
          rules={[{ required: true }]}
        >
          <Input size='large' style={{ height: 50 }} placeholder='请输入账号...' allowClear />
        </Form.Item>

        <Form.Item
          rules={[{ required: true }]}
          className={style[prefix + '-form-item']}
          name="password"
          label="密码"
        >
          <Input size='large' style={{ height: 50 }} placeholder='请输入密码...' allowClear type="password" />
        </Form.Item>

        {isRegister && (
          <Form.Item
            hidden={!isRegister}
            // rules={[{ required: true }]}
            className={style[prefix + '-form-item']}
            name="permission"
            label="账号权限"
          >
            <Input size='large' style={{ height: 50 }} placeholder='请输入权限...' allowClear />
          </Form.Item>
        )}

        <Button
          size='large'
          className={style[prefix + '-form-button']}
          style={{ height: 58 }}
          block
          type="primary"
          loading={loading}
          onClick={onFinish}
        >
          {isRegister ? 'Register' : 'Login In'}
        </Button>

        <div className={style["social"]}>
          <Button
            block
            disabled
            type="primary"
            className={style["go"]}
          >
            忘记密码？
          </Button>

          <Button
            block
            disabled
            type="primary"
            className={style["fb"]}
          >
            联系网管！
          </Button>
        </div>
      </Form>
    </div>
  )
};

export default Login;