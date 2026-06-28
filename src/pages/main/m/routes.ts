import { createBrowserRouter } from "react-router";
import NotFound from '@/NotFound'
import Layout from '@/component/Layout/m'
import Login from '@/pages/login/m'



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
          { path: "/task-management", Component: Login },
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