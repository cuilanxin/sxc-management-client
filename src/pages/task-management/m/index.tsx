import React, { useEffect, useRef, useState } from 'react'
import {
  Selector,
  Tag,
  Empty,
  PullToRefresh,
  InfiniteScroll,
  Toast,
  Dialog
} from 'antd-mobile';
import { ACTION_TYPE, Task, TASK_STATUS, taskStatusOptions } from '@/api/types';

import style from './index.module.less'
import { deleteTask, getTasks } from '@/api/task-management';
import TaskDetailPopup from './TaskDetailPopup';

const username = localStorage.getItem('username')

function TaskManagement() {
  const [taskDetial, setTaskDetial] = useState<Task | null>(null)
  const [actionType, setActionType] = useState<ACTION_TYPE | null>(null)
  const [selectorValue, setSelectorValue] = useState(['all'])
  const [dataSource, setDataSource] = useState<Task[]>([])
  const pagination = useRef({
    total: 0,
    current: 1,
    pageSize: 10,
  })

  useEffect(() => {
    onSelector()
  }, [])


  const getData = (value: string = selectorValue[0]) => {

    return getTasks({
      page: pagination.current.current,
      pageSize: pagination.current.pageSize,
      createOwnerId: value === 'createOwnerId' ? username! : undefined,
      recipientId: value === 'recipientId' ? username! : undefined
    }).then((val) => {
      setDataSource(val.tasks)
      pagination.current.total = val.total!;
    }, err => {
      Toast.show({
        content: err.message || '网络异常稍后重试！'
      })
    })
  }

  const onDelete = (id: string) => {
    Dialog.confirm({
      content: '确定删除？',
      onConfirm: async () => {
        return deleteTask({ id }).then(() => {
          Toast.show({
            content: '删除成功！',
            duration: 1000,
            afterClose: () => {
              onSelector()
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
    setTaskDetial(null)
    setActionType(null)
  }

  const onSelector = (arr: string[] = selectorValue) => {
    if (!arr?.length) return
    pagination.current = {
      total: 0,
      current: 1,
      pageSize: 10,
    }
    setSelectorValue(arr)
    return getData(arr[0])
  }

  return (
    <PullToRefresh
      // @ts-ignore
      onRefresh={onSelector}
    >

      <span
        onClick={() => {
          setActionType(ACTION_TYPE.CREATE)
        }}
        className={style['task-management-popup']}
      >
        新增
      </span>

      <div className={style['task-management-search']}>
        <Selector
          options={[
            {
              label: '全部',
              value: 'all',
            },
            {
              label: '我创建的',
              value: 'createOwnerId',
            },
            {
              label: '我接收的',
              value: 'recipientId',
            },
          ]}
          value={selectorValue}
          onChange={onSelector}
        />
      </div>


      <TaskDetailPopup
        visible={!!actionType}
        actionType={actionType}
        onSearch={onSelector}
        taskDetial={taskDetial}
        onClose={onDrawerClose}
      />

      <div className={style['task-management-body']}>

        {dataSource?.length ? (
          dataSource?.map(item => {
            const statusItem = taskStatusOptions.find(it => it.value === item.taskStatus)

            return (
              <div className={style['task-management-card']}>
                <div className={[
                  style['task-management-card-title'],
                  style['task-management-card-bg-' + statusItem?.color],
                ].join(' ')}>
                  <span className={style['font-weight500']}>{item.taskName}</span>

                  <span
                    className={[
                      style['task-management-card-text-' + statusItem?.color],
                      style['task-management-card-title-status'],
                    ].join(' ')}
                  >{statusItem?.label}</span>
                </div>

                <div className={style['task-management-card-content']}>
                  <div className={style['task-management-card-content-line']}>
                    <div>
                      <span>创建时间：</span>
                      <span>{item.createdAt}</span>
                    </div>
                    <div>
                      <span>创建人：</span>
                      <span>{item.createOwner}</span>
                    </div>
                  </div>

                  <div className={style['task-management-card-content-line']}>
                    {item.taskStatus === TASK_STATUS.COMPLETED ? (
                      <div>
                        <span>完成时间：</span>
                        <span>{item.downAt}</span>
                      </div>
                    ) : (
                      <div>
                        <span>截止时间：</span>
                        <span>{item.deadlineAt}</span>
                      </div>
                    )}

                    <div>
                      <span>接收人：</span>
                      <span>{item.recipient}</span>
                    </div>
                  </div>
                </div>

                <div className={style['task-management-card-footer']}>
                  <Tag
                    color='default'
                    onClick={() => {
                      setTaskDetial(item)
                      setActionType(ACTION_TYPE.VIEW)
                    }}
                  >
                    查看
                  </Tag>
                  <Tag
                    color='warning'
                    onClick={() => {
                      setTaskDetial(item)
                      setActionType(ACTION_TYPE.EDIT)
                    }}
                  >
                    编辑
                  </Tag>
                  <Tag color='red' onClick={() => onDelete(item.id!)}>
                    删除
                  </Tag>
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

export default TaskManagement

