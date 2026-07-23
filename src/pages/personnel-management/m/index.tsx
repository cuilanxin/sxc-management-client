import React, { useEffect, useRef, useState } from 'react'
import {
  Tag,
  Empty,
  PullToRefresh,
  InfiniteScroll,
  Toast,
  SearchBar,
  Dialog
} from 'antd-mobile';
import { ACTION_TYPE, UserInfo } from '@/api/types';

import style from './index.module.less'
import PersonnelDetailPopup from './PersonnelDetailPopup';
import { deleteUser, getUsers, logoutUser } from '@/api/personnel-management';

const username = localStorage.getItem('username')

function PersonnelManagement() {
  const [personnel, setPersonnel] = useState<UserInfo | null>(null)
  const [actionType, setActionType] = useState<ACTION_TYPE | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [dataSource, setDataSource] = useState<UserInfo[]>([])
  const pagination = useRef({
    total: 0,
    current: 1,
    pageSize: 10,
  })

  useEffect(() => {
    onSearch()
  }, [])


  const getData = (value: string = searchValue) => {
    Toast.show({
      content: '搜索中...'
    })
    return getUsers({
      name: value,
      // page: pagination.current.current,
      // pageSize: pagination.current.pageSize,
    }).then((val) => {
      setDataSource(val.users)
      pagination.current.total = val.users.length! || 0;
    }, err => {
      Toast.show({
        content: err.message || '网络异常稍后重试！'
      })
    })
  }

  const onDelete = (username: string) => {
    Dialog.confirm({
      content: '确定删除？',
      onConfirm: async () => {
        return deleteUser({ username }).then(() => {
          Toast.show({
            content: '删除成功！',
            duration: 1000,
            afterClose: () => {
              onSearch()
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

  const onLogoutUser = (username: string) => {
    Dialog.confirm({
      content: '确定注销？',
      onConfirm: async () => {
        return logoutUser({ username }).then(() => {
          Toast.show({
            content: '注销成功！',
            duration: 1000,
            afterClose: () => {
              onSearch()
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

  const onDrawerClose = () => {
    setPersonnel(null)
    setActionType(null)
  }

  const onSearch = (val: string = searchValue) => {

    pagination.current = {
      total: 0,
      current: 1,
      pageSize: 10,
    }
    return getData(val)
  }

  return (
    <PullToRefresh
      // @ts-ignore
      onRefresh={onSearch}
    >

      <span
        onClick={() => {
          setActionType(ACTION_TYPE.CREATE)
        }}
        className={style['personnel-management-popup']}
      >
        新增
      </span>

      <div className={style['personnel-management-search']}>
        <SearchBar
          placeholder='请输入内容'
          onChange={setSearchValue}
          onSearch={onSearch}
          value={searchValue}
          cancelText={'查询'}
          onCancel={onSearch}
          clearOnCancel={false}
          showCancelButton={() => true}
          style={{
            '--border-radius': '100px',
            '--background': '#ffffff',
            // '--height': '32px',
            '--padding-left': '12px',
          }}
        />
      </div>


      <PersonnelDetailPopup
        visible={!!actionType}
        actionType={actionType}
        onSearch={onSearch}
        personnel={personnel}
        onClose={onDrawerClose}
      />

      <div className={style['personnel-management-body']}>

        {dataSource?.length ? (
          dataSource?.map(item => {
            const isLogout = !!item.isLogout

            return (
              <div key={item.username} className={style['personnel-management-card']}>
                <div className={[
                  style['personnel-management-card-title'],
                  style['personnel-management-card-bg-' + isLogout],
                ].join(' ')}>
                  <span className={style['font-weight500']}>{item.name}</span>

                  <span
                    className={[
                      style['personnel-management-card-text-' + isLogout],
                      style['personnel-management-card-title-status'],
                    ].join(' ')}
                  >{item.isLogout ? '账号异常' : '账号正常'}</span>
                </div>

                <div className={style['personnel-management-card-content']}>
                  <div className={style['personnel-management-card-content-line']}>
                    <div>
                      <span>账号id：</span>
                      <span>{item.username}</span>
                    </div>
                  </div>

                  <div className={style['personnel-management-card-content-line']}>
                    <div>
                      <span>任务数量：</span>
                      <span>{item.taskNum}</span>
                    </div>
                  </div>

                  <div className={style['personnel-management-card-content-line']}>
                    <div>
                      <span>已完成任务数量：</span>
                      <span>{item.taskConfirmedNum}</span>
                    </div>

                  </div>

                  <div className={style['personnel-management-card-content-line']}>
                    <div>
                      <span>未完成任务数量：</span>
                      <span>{item.taskUnfinishedNum}</span>
                    </div>


                  </div>

                  <div className={style['personnel-management-card-content-line']}>
                    <div>
                      <span>未确认任务数量：</span>
                      <span>{item.taskUnConfirmedNum}</span>
                    </div>
                  </div>
                </div>

                <div className={style['personnel-management-card-footer']}>
                  <Tag
                    color='default'
                    onClick={() => {
                      setPersonnel(item)
                      setActionType(ACTION_TYPE.VIEW)
                    }}
                  >
                    查看
                  </Tag>

                  <Tag
                    color='warning'
                    onClick={() => {
                      setPersonnel(item)
                      setActionType(ACTION_TYPE.EDIT)
                    }}
                  >
                    编辑
                  </Tag>
                  {
                    item.isLogout ? (<Tag color='red' onClick={() => onDelete(item.username!)}>
                      删除账号
                    </Tag>) : (
                      <Tag color='red' onClick={() => onLogoutUser(item.username!)}>
                        注销账号
                      </Tag>
                    )
                  }

                </div>
              </div>
            )
          })
        ) : <Empty description='暂无数据' />}

      </div>

      <InfiniteScroll
        loadMore={() => {
          pagination.current.current = pagination.current.current += 1;
          return getData()
        }}
        // hasMore={pagination?.total! / pagination?.pageSize! < pagination?.current!}
        hasMore={false}
      />
    </PullToRefresh>
  )
}


export default PersonnelManagement