import {
  RouterProvider,
} from "react-router";
import router from './routes'
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';
import './index.css';


dayjs.locale('zh-cn');

function Main() {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
    
  )
}

export default Main
