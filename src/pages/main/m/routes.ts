import { createBrowserRouter } from "react-router";
import NotFound from '@/NotFound'
import Layout from '@/component/Layout/m'
import Login from '@/pages/login/m'
import TaskManagement from '@/pages/task-management/m'


const router = createBrowserRouter([
  {
    path: "/login",
    handle: {
      title: "登录",
    },
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
            handle: {
              title: "任务管理",
            },
            Component: TaskManagement
          },
          {
            handle: {
              title: "任务管理",
            },
            path: "/task-management",
            Component: TaskManagement
          },
          // {
          //   handle: {
          //     title: "人员管理",
          //   },
          //   path: "/personnel-management",
          //   Component: PersonnelManagement
          // },
          // {
          //   handle: {
          //     title: "权限管理",
          //   },
          //   path: "/permission-management",
          //   Component: PermissionManagement
          // },
          // { path: ":pid/edit", Component: EditProject },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
    // no path on this parent route, just the component
    // Component: MarketingLayout,
    // children: [
    //   { index: true, Component: Home },
    //   { path: "contact", Component: Contact },
    // ],
  },
]);


export default router