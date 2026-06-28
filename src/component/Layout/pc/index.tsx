import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { Alert, Button, Dropdown, Layout, Menu, message, Popconfirm,  theme } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import {
  Link,
  Outlet,
} from 'react-router'

import { useNavigate } from 'react-router';
import { apiFetch } from '@/api/utils';

const { Header, Sider } = Layout;

function App(props: any) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [token, setToken] = useState<string>();
  const [userInfo, setUserInfo] = useState<{}>();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(['/task-management'])

  useEffect(() => {
    setSelectedKeys([window.location.pathname])
  }, [])

  useEffect(() => {
    const cacheToken = localStorage?.getItem('token')
    const username = localStorage?.getItem('username')
    setToken(cacheToken as string)

    apiFetch('/api/auth/getUserInfo', { username }).then((val) => {
      setUserInfo(val.usersInfo)
    }, err => {
      message.error(err.message || '网络异常稍后重试！')
    })

    const isLoginInPage = window.location.href.includes('login-in')

    if (!cacheToken && !isLoginInPage) {
      navigate('login-in');
    }
  }, [])


  if (!token) return


  const onExit = () => {
    return apiFetch('/api/auth/exitUser', {}).then((val) => {
      message.success('退出成功', () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username');

        navigate('login-in', { replace: true });
      })
    }, err => {
      message.error(err.message || '网络错误')
      return Promise.reject(err)
    })
  }

  return (
    <Layout style={{
      minHeight: '100vh',
      // minWidth: '100vw',
    }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SmileOutlined style={{ color: 'yellow', fontSize: 30 }} />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onSelect={(val) => { setSelectedKeys(val.selectedKeys) }}
          items={[
            {

              key: '/task-management',
              icon: <FileSearchOutlined />,
              isShwo: true,
              label: <Link to="task-management">任务管理</Link>,
            },
            {
              key: '/personnel-management',
              icon: <UserOutlined />,
              // isShwo: userInfo?.permission,
              label: <Link to="personnel-management">人员管理</Link>,
            },
            // {
            //   key: '/permission-management',
            //   icon: <UploadOutlined />,
            //   label: <Link to="permission-management">权限管理</Link>,
            // },
          ].filter(item => item.isShwo)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            paddingRight: 16,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          {/* <Alert
            title={`
              任务总数：${userInfo?.taskNum || 0}，
              未完成任务数量：${userInfo?.taskUnfinishedNum || 0}，
              待确认任务数量：${userInfo?.taskUnConfirmedNum || 0}
            `}
            type="info"
            variant="filled"
          /> */}

          <Dropdown
            arrow
            trigger={['click']}
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <div>
                      <Popconfirm
                        title="确定退出登录？"
                        onConfirm={onExit}
                      >
                          退出登录
                      </Popconfirm>
                    </div>
                  ),
                },
              ]
            }}
          >
            <a onClick={(e) => e.preventDefault()} >
                {/* <span style={{ color: '#4096ff' }}>{userInfo?.name || ''}</span> */}
                <DownOutlined />
            </a>
          </Dropdown>
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default App;