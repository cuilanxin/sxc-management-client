import React, { useState } from 'react'
import { Collapse, Empty, Row, Col, Card, Button, Popconfirm, DatePicker, Tag, Form, Input, Select, Space, Table, message, Spin, Modal } from 'antd';
import { FormValues, useGetTasks, useGetUsers } from '../useTaskManagementHook';
import { ACTION_TYPE, Task, TASK_STATUS, taskStatusOptions } from '@/api/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import style from './index.module.less'
import { deleteTask } from '@/api/task-management';
import TaskDetailDrawer from './TaskDetailDrawer';

function TaskManagement() {
  const [form] = Form.useForm<FormValues>();
  const [taskDetial, setTaskDetial] = useState<Task | null>(null)
  const [actionType, setActionType] = useState<ACTION_TYPE | null>(null)
  const { usersLoading, users, currentUser } = useGetUsers();
  const { getTaskLoading, dataSource, pagination, getData } = useGetTasks()


  const onSearch = () => {
    getData(1, 10, form.getFieldsValue())
  };

  const onReset = () => {
    form.resetFields();
  };


  const onDelete = (id: string) => {
    Modal.confirm({
      title: '确定删除？',
      icon: <ExclamationCircleOutlined />,
      // content: 'Bla bla ...',
      okText: '确认',
      onOk: () => deleteTask({ id }).then((val) => {
        message.success('删除成功！')
        onSearch()
      }, err => {
        message.error(err.message || '网络错误')
        return Promise.reject(err)
      }),
      cancelText: '取消',
      centered: true,
    });
  }

  const onDrawerClose = () => {
    setTaskDetial(null)
    setActionType(null)
  }

  return (
    <div>
      <Collapse
        style={{ padding: '0px 4px' }}
        items={[{
          key: '1',
          extra: (<a href="#javascript" onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            setActionType(ACTION_TYPE.CREATE)
          }}>
            新建任务
          </a>),
          label: '点击展开/折叠筛选条件',
          children: (
            <Form
              // {...layout}
              labelCol={{ flex: '0 0 70px' }}
              colon={false}
              labelAlign='right'
              layout='horizontal'
              // layout='inline'
              // labelCol={{ span: 10 }}
              // wrapperCol={{ span: 14 }}
              // layout='inline'

              form={form}
              name="TaskManagement"
            // style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="id"
                label="任务ID"
                className={style['form-item-nowarp']}
              >
                <Input placeholder='请输入' allowClear />
              </Form.Item>

              <Form.Item
                name="taskName"
                label="任务名称"
                className={style['form-item-nowarp']}
              >
                <Input placeholder='请输入' style={{ width: '100%' }} allowClear />
              </Form.Item>

              <Form.Item
                name="taskStatus"
                label="任务状态"
                className={style['form-item-nowarp']}
              >
                <Select placeholder='请选择' style={{ width: '100%' }} options={taskStatusOptions} allowClear />
              </Form.Item>


              <Form.Item className={style['form-item-margin-bottom0']}>
                <Button onClick={onReset}>重置</Button>
                <Button loading={getTaskLoading} type='primary' onClick={onSearch} style={{ marginLeft: 8 }}>查询</Button>
              </Form.Item>
            </Form>
          )
        }]}
      />

      <TaskDetailDrawer
        open={!!actionType}
        actionType={actionType}
        userList={users}
        onSearch={onSearch}
        taskDetial={taskDetial}
        onClose={onDrawerClose}
      />

      <Spin spinning={getTaskLoading} className={style['task-management-body']}>
        <InfiniteScroll
          dataLength={dataSource?.length}
          next={() => getData(pagination.current! + 1, 10)}
          hasMore={false}
          // hasMore={pagination?.total! / pagination?.pageSize! < pagination?.current!}
          loader={<h4>加载中...</h4>}
          // endMessage={<p>没有更多数据了</p>}
        // 如果是固定高度容器，需要传入 scrollableTarget
        // scrollableTarget="scrollableDiv"
        >
          {/*  */}
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
          ) : <Empty />}
        </InfiniteScroll>

      </Spin>
    </div>
  )
}

export default TaskManagement

