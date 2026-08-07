import React, { useState, useEffect } from 'react'
import style from './index.module.less'
import { Dialog, List, Toast } from 'antd-mobile'
import { getUserInfo } from '@/api/personnel-management'
import { UserInfo } from '@/api/types'
import { exitUser } from '@/api/login'
import { useNavigate } from 'react-router'
import { SmileOutline } from 'antd-mobile-icons'



function PersonalCenter() {
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo().then((val) => {
      setUserInfo(val.usersInfo)
    }, err => {
      Toast.show({
        content: err.message || '网络错误，稍后再试'
      })
    })
  }, [])


  const onExit = () => {
    Dialog.confirm({
      content: '确定退出登录？',
      onConfirm: async () => {
        return exitUser().then(() => {
          Toast.show({
            content: '退出成功',
            duration: 1000,
            afterClose: () => {
              localStorage.removeItem('token')
              localStorage.removeItem('username');

              navigate('/login', { replace: true });
            }
          })
        }, err => {
          Toast.show({
            content: err.message || '网络错误',
          })
          return Promise.reject(err)
        })
      },
    })
  }


  return (
    <div>
      <div className={style['personal-center-header']}>

        <SmileOutline style={{ color: 'yellow', fontSize: 80 }} />
        
        <div className={style['personal-center-header-info']}>
          <div className={style['personal-center-header-info-name']}>{userInfo?.name}</div>
          <div className={style['personal-center-header-info-username']}>{userInfo?.username}</div>
        </div>
      </div>


      <div>

      </div>

      <List header='任务列表'>
        <List.Item extra={userInfo?.taskInfo?.taskNum || userInfo?.taskNum || 0}>任务总数：</List.Item>
        <List.Item extra={userInfo?.taskInfo?.taskUnfinishedNum || userInfo?.taskUnfinishedNum || 0}>未完成任务数：</List.Item>
        <List.Item extra={userInfo?.taskInfo?.taskUnConfirmedNum || userInfo?.taskUnConfirmedNum || 0}>待确认任务数：</List.Item>
      </List>

      <List header='操作'>
        <List.Item onClick={onExit}>退出登录</List.Item>
        {/* <List.Item prefix={<UnorderedListOutline />} onClick={() => {}}>修改密码</List.Item> */}
      </List>
      {/* <Alert
          title={`
              任务总数：${userInfo?.taskInfo?.taskNum || 0}，
              未完成任务数：${userInfo?.taskInfo?.taskUnfinishedNum || 0}，
              待确认任务数：${userInfo?.taskInfo?.taskUnConfirmedNum || 0}
            `}
          type="info"
          variant="filled"
          // style={{ marginBottom: 16 }}
        /> */}
    </div>
  )
}


export default PersonalCenter
