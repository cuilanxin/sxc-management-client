// Login.tsx
import React, { useEffect, useState } from 'react';
import {
  message,
  Form,
  Input,
  Button
} from 'antd';

import { useNavigate } from 'react-router';
import { apiFetch } from '@/api/utils';
import style from './index.module.less';


const prefix = 'login-container'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState<Boolean>(false)
  const [form] = Form.useForm();

  const navigate = useNavigate();

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
    setLoading(true);
    const messageClose = message.loading('登录中...', 0)
    form.validateFields().then(values => {
      const registerUrl = 'register'
      const loginUrl = 'login'
      const apiUrl = isRegister ? registerUrl : loginUrl

      apiFetch('/api/auth/' + apiUrl, values).then(val => {
        if (isRegister) {
          localStorage.removeItem('register')
          message.success('注册成功！请在页面刷新后登录。', 2000, () => {
            window.location.reload()
          });
        } else {
          localStorage.setItem('token', val.token);
          localStorage.setItem('username', val.username);
          localStorage.setItem('permission', val.permission);
          message.success('登录成功！', 1000, () => {
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
          <div className={style["go"]}>忘记密码？</div>
          <div className={style["fb"]}>联系网管！</div>
        </div>
      </Form>
    </div>
  )
};

export default Login;