import { useEffect, useState } from 'react';
import { Badge, NavBar, TabBar, Toast } from 'antd-mobile';
import {
  Outlet,
} from 'react-router'

import { useNavigate, useMatches } from 'react-router';
import { getUserInfo } from '@/api/personnel-management';
import { UserInfo } from '@/api/types';
import { exitUser } from '@/api/login';
import {
  FileOutline,
  UserAddOutline,
  // MessageOutline,
  // MessageFill,
  UserOutline,
} from 'antd-mobile-icons'

import style from './index.module.less'
import React from 'react';



function App(props: any) {
  const [token, setToken] = useState<string>();
  const [actived, setActived] = useState('/task-management');
  // const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  useEffect(() => {
    
    setActived(window.location.pathname)
    const cacheToken = localStorage?.getItem('token')
    setToken(cacheToken as string)

    const isLoginInPage = window.location.href.includes('login')

    if (!cacheToken && !isLoginInPage) {
      navigate('/login');
    }
  }, [])


  if (!token) return null


  const onTabBarChange = (key: string) => {
    navigate(key)
    setActived(key);
  }

  const tabs = [
    {
      key: '/task-management',
      title: '任务管理',
      icon: <FileOutline />,
      badge: Badge.dot,
    },
    {
      key: '/personnel-management',
      title: '人员管理',
      icon: <UserAddOutline />,
      badge: '5',
    },
    // {
    //   key: 'message',
    //   title: '消息',
    //   icon: (active: boolean) =>
    //     active ? <MessageFill /> : <MessageOutline />,
    //   badge: '99+',
    // },
    {
      key: '/personal-center',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  return (
    <div className={style['layout']}>
      <NavBar
        className={style['layout-navbar']}
        back={null}
        // onBack={back}
        // back='返回'
        // left='关闭'
      >
        {(currentMatch?.handle as any)?.title || '加载失败'}
      </NavBar>

      <div className={style['layout-concent']}>
        <Outlet />
      </div>

      <TabBar
        className={style['layout-tabbar']}
        safeArea
        activeKey={actived}
        onChange={onTabBarChange}
      >
        {tabs.map(item => (
          <TabBar.Item
            key={item.key}
            icon={item.icon}
            title={item.title}
          />
        ))}
      </TabBar>
    </div>
  );
};

export default App;