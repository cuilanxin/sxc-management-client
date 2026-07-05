// Login.tsx
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Toast,
  Button
} from 'antd-mobile';

import style from './index.module.less';
import { login, register } from "@/api/login";
import { LoginResponse, RegisterParams } from '@/api/types';
import { useNavigate } from 'react-router';

const prefix = 'login-container'

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false)
  const [form] = Form.useForm<RegisterParams>();
  const [loading, setLoading] = useState(false)
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
    const messageClose = Toast.show({
      content: '登录中...',
      duration: 0
    })
    form.validateFields().then(values => {


      (isRegister ? register(values) : login(values)).then(val => {
        if (isRegister) {
          localStorage.removeItem('register')
          Toast.show({
            content: '注册成功！请在页面刷新后登录。',
            duration: 1,
            afterClose: () => {
              window.location.reload()
            }
          });
        } else {
          localStorage.setItem('token', (val as LoginResponse).token);
          localStorage.setItem('username', (val as LoginResponse).username);
          // localStorage.setItem('permission', val.permission);
          Toast.show({
            content: '登录成功！',
            duration: 1,
            afterClose: () => {
              navigate('/');
            }
          });
          // cookieStore.set('token', val.token)
        }
      }, err => {
        Toast.show({
          content: err.message || '网络异常稍后重试！'
        })
      }).finally(() => {
        messageClose.close()
        setLoading(false);
      })
    }, err => {
      messageClose.close()

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
        mode='card'
        form={form}
        style={{
          '--prefix-width': "50px"
        }}
        // colon={false}
        layout='horizontal'
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
            <Input placeholder='请输入名字...' />
          </Form.Item>
        )}

        <Form.Item
          className={style[prefix + '-form-item']}
          name="username"
          label="账号"
          rules={[{ required: true }]}
        >
          <Input
            placeholder='请输入账号...'
          />
        </Form.Item>

        <Form.Item
          rules={[{ required: true }]}
          className={style[prefix + '-form-item']}
          name="password"
          label="密码"
        >
          <Input
            placeholder='请输入密码...'
            type="password"
          />
        </Form.Item>

        {isRegister && (
          <Form.Item
            hidden={!isRegister}
            // rules={[{ required: true }]}
            className={style[prefix + '-form-item']}
            name="permission"
            label="账号权限"
          >
            <Input
              placeholder='请输入权限...'
            />
          </Form.Item>
        )}

        <Form.Item className={style[prefix + '-form-submit']}>

          <Button
            size='large'
            // className={style[prefix + '-form-submit']}
            // style={{ height: 58 }}
            block
            color="primary"
            loading={loading}
            onClick={onFinish}
          >
            {isRegister ? 'Register' : 'Login In'}
          </Button>
        </Form.Item>


        <div className={style["social"]}>
          <span
            color="primary"
          >
            忘记密码？
          </span>

          <span
            color="primary"
          >
            联系网管！
          </span>
        </div>
      </Form>
    </div>
  )
};

export default Login;