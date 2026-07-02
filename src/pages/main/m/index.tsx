import 'antd-mobile/es/global'; 
import {
  RouterProvider,
} from "react-router";
import router from './routes'
import './index.css';

// import 'antd-mobile/umd/antd-mobile'




function Main() {
  return (
    <RouterProvider router={router} />
  )
}

export default Main
