import { Drawer, DrawerProps, Menu } from 'antd'
import { useEffect, useState } from 'react'
import {
  UserOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { isPersonnelManagementMenu } from '@/commen';
import { Link } from 'react-router';
import { UserInfo } from '@/api/types';
import style from './index.module.less'

// import { createStaticStyles } from 'antd-style';

interface MenuDrawerProps extends DrawerProps {
  userInfo?: UserInfo
}

function MenuDrawer(props: MenuDrawerProps) {
  const { userInfo, ...drawerProps } = props;
  const [selectedKeys, setSelectedKeys] = useState<[string]>()

  useEffect(() => {
    const pathname = window.location.pathname
    if (pathname === '/') {
      setSelectedKeys(['/task-management'])

    } else {
      setSelectedKeys([pathname])
    }
  }, [drawerProps.open])

  return (
    <Drawer
      {...drawerProps}
      title="菜单导航"
      placement='left'
      size={'50%'}
      classNames={{
        body: style['menu-drawer-body']
      }}
      extra={
        null
      }
    >
      <Menu
        // theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        onSelect={(val) => { setSelectedKeys(val.selectedKeys as [string]) }}
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
            isShwo: isPersonnelManagementMenu(userInfo?.permission),
            label: <Link to="personnel-management">人员管理</Link>,
          },
          // {
          //   key: '/permission-management',
          //   icon: <UploadOutlined />,
          //   label: <Link to="permission-management">权限管理</Link>,
          // },
        ].filter(item => item.isShwo)}
      />
    </Drawer>
  )
}


export default MenuDrawer
