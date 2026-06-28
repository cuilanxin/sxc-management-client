import { createBrowserRouter } from "react-router";
import NotFound from '@/NotFound'
import Layout from '@/component/Layout/pc'

import Login from '@/pages/login/pc'
import TaskManagement from '@/pages/task-management/pc'
import PersonnelManagement from '@/pages/personnel-management/pc'
import PermissionManagement from '@/pages/permission-management/pc'


const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
    // no path on this parent route, just the component
    // Component: MarketingLayout,
    // children: [
    //   { index: true, Component: Home },
    //   { path: "contact", Component: Contact },
    // ],
  },

  {
    children: [
      {
        Component: Layout,
        children: [
          { 
            index: true,  // 👈 添加这行，访问 / 时默认显示
            Component: TaskManagement 
          },
          { 
            // 任务管理
            path: "/task-management", 
            Component: TaskManagement 
          },
          { 
            // 人员管理
            path: "/personnel-management", 
            Component: PersonnelManagement 
          },
          { 
            // 权限管理
            path: "/permission-management", 
            Component: PermissionManagement 
          },
          // { path: ":pid/edit", Component: EditProject },
        ],
      },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);

export default router