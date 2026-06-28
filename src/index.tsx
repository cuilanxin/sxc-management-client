import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';

import isMobile from 'is-mobile';
import PcMain from '@/pages/main/pc'
import MMain from '@/pages/main/m'
// import {
//   RouterProvider,
// } from "react-router";


dayjs.locale('zh-cn');




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      {isMobile() ? <MMain /> : <PcMain />}
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
