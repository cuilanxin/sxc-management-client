import { createBrowserRouter } from "react-router";
import NotFound from '@/NotFound'
import Login from '@/pages/pc/login'



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

  // {
  //   // path: "",
  //   children: [
  //     { index: true, Component: ProjectsHome },
  //     {
  //       // again, no path, just a component for the layout
  //       Component: ProjectLayout,
  //       children: [
  //         { path: ":pid", Component: Project },
  //         { path: ":pid/edit", Component: EditProject },
  //       ],
  //     },
  //   ],
  // },

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