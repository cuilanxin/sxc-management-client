import { useEffect, useState } from 'react';
import {
  ExclamationCircleOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Alert, Dropdown, Layout, message, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  Outlet,
} from 'react-router'

import { useNavigate, useMatches } from 'react-router';
import { getUserInfo } from '@/api/personnel-management';
import { UserInfo } from '@/api/types';
import { exitUser } from '@/api/login';

import style from './index.module.less'
import MenuDrawer from './MenuDrawer';


const { Header } = Layout;

function App(props: any) {
  const [token, setToken] = useState<string>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [openDrawer, setOpenDrawer] = useState(false);
  // const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];


  useEffect(() => {
    const cacheToken = localStorage?.getItem('token')
    setToken(cacheToken as string)

    getUserInfo().then((val) => {
      setUserInfo(val?.usersInfo)
    }, err => {
      message.error(err.message || '网络异常稍后重试！')
    })

    const isLoginInPage = window.location.href.includes('login')

    if (!cacheToken && !isLoginInPage) {
      navigate('login');
    }
  }, [])


  if (!token) return null


  const onExit = () => {
    Modal.confirm({
      title: '确定退出登录？',
      icon: <ExclamationCircleOutlined />,
      // content: 'Bla bla ...',
      okText: '确认',
      onOk: () => exitUser().then(() => {
        message.success('退出成功', 1, () => {
          localStorage.removeItem('token')
          localStorage.removeItem('username');

          navigate('login', { replace: true });
        })
      }, err => {
        message.error(err.message || '网络错误')
        return Promise.reject(err)
      }),
      cancelText: '取消',
      centered: true,
    });
  }


  return (
    <Layout style={{
      minHeight: '100vh',
      // minWidth: '100vw',
    }}>
      <Layout>
        <Header
          className={style['layout-header']}
        >
          <MenuUnfoldOutlined
            onClick={() => setOpenDrawer(true)}
            style={{ fontSize: 26, }}
          />

          <MenuDrawer
            userInfo={userInfo}
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
          />

          <div>{(currentMatch?.handle as any)?.title}</div>

          <Dropdown
            arrow
            trigger={['click']}
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <div onClick={onExit}>
                      退出登录
                    </div>
                  ),
                },
              ]
            }}
          >
            <a onClick={(e) => e.preventDefault()} style={{ lineHeight: 'normal' }} >
              <span style={{ color: '#4096ff' }}>{userInfo?.name || ''}</span>
              <DownOutlined />
            </a>
          </Dropdown>
        </Header>
        
        <Alert
          title={`
              任务总数：${userInfo?.taskInfo?.taskNum || 0}，
              未完成任务数：${userInfo?.taskInfo?.taskUnfinishedNum || 0}，
              待确认任务数：${userInfo?.taskInfo?.taskUnConfirmedNum || 0}
            `}
          type="info"
          variant="filled"
          // style={{ marginBottom: 16 }}
        />

        <Outlet />
        
      </Layout>
    </Layout>
  );
};

export default App;