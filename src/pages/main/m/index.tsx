import {
  RouterProvider,
} from "react-router";
import router from './routes'
import 'antd-mobile/dist/antd-mobile.css'




function Main() {
  return (
    <RouterProvider router={router} />
  )
}

export default Main
