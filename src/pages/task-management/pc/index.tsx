import { useState } from 'react'
import { Row, Col, Card, Button, Popconfirm, DatePicker, Tag, Form, Input, Select, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TaskDetailDrawer from './TaskDetailDrawer';
import { useGetUsers, useGetTasks, FormValues } from '../useTaskManagementHook';
import { ACTION_TYPE, Task, taskStatusOptions } from '@/api/types';
import { isTaskManagementSearchForm } from '@/commen';
import { deleteTask } from '@/api/task-management';


const layout = {
  labelCol: { span: 8 },
  // wrapperCol: { span: 16 },
};



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


  const onDrawerOpen = () => {
    setActionType(ACTION_TYPE.CREATE)
  }

  const onDrawerClose = () => {
    setActionType(null)
    setTaskDetial(null)
  }

  const onDelete = (id: string) => {
    return deleteTask({ id }).then((val) => {
      message.success('删除成功！')
      onSearch()
    }, err => {
      message.error(err.message || '网络错误')
      // return Promise.reject(err)
    })
  }

  const columns: TableProps<Task>['columns'] = [
    { title: '任务ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 100 },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      width: 100,
      render: (key) => {
        const item = taskStatusOptions.find(it => it.value === key)
        return (
          <Tag color={item?.color}>
            {item?.label || '-'}
          </Tag>
        )
      }
    },
    {
      title: '创建人信息',
      dataIndex: 'createOwner',
      key: 'createOwner',
      width: 100,
      render: (_, record) => (
        <div>
          <div>姓名：{record.createOwner}</div>
          <div>ID：{record.createOwnerId}</div>
        </div>
      )
    },
    {
      title: '接收人信息',
      dataIndex: 'recipient',
      key: 'recipient',
      width: 100,
      render: (_, record) => (
        <div>
          <div>姓名：{record.recipient}</div>
          <div>ID：{record.recipientId}</div>
        </div>
      )
    },
    { title: '任务介绍', dataIndex: 'taskInfo', key: 'taskInfo', width: 100 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 100 },
    { title: '完成时间', dataIndex: 'downAt', key: 'downAt', width: 100 },
    // { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 100 },
    { title: '截止时间', dataIndex: 'deadlineAt', key: 'deadlineAt', width: 100 },
    {
      title: '操作',
      fixed: true,
      width: 100,
      key: 'action',
      render: (_, record) => (
        <Space size="medium">
          {/* {(
            <Popconfirm title='确认删除？' onConfirm={() => onDelete(record.id as string)}>
              <a>彻底删除</a>
            </Popconfirm>
          )} */}
          <a href="#JavaScript" onClick={() => {
            setActionType(ACTION_TYPE.VIEW)
            setTaskDetial(record)
          }}>查看</a>

          <a onClick={() => {
            setActionType(ACTION_TYPE.EDIT)
            setTaskDetial(record)
          }}>编辑</a>

          <Popconfirm title='确认删除？' onConfirm={() => onDelete(record.id as string)}>
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const isShowSearchForm = isTaskManagementSearchForm(currentUser?.permission);

  return (
    <div>
      <Card style={{ margin: '24px 16px', }}>
        <Form
          {...layout}
          labelCol={{ flex: '0 0 120px' }}
          form={form}
          colon={false}

          name="TaskManagement"
        // style={{ maxWidth: 600 }}
        >
          <Row>
            <Col span={8}>
              <Form.Item name="id" label="任务ID">
                <Input placeholder='请输入' allowClear />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="taskName" label="任务名称">
                <Input placeholder='请输入' allowClear />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="taskStatus" label="任务状态">
                <Select placeholder='请选择' options={taskStatusOptions} allowClear />
              </Form.Item>
            </Col>

            {isShowSearchForm && (
              <Col span={8}>
                <Form.Item name="createOwnerId" label="创建人账号">
                  <Select
                    options={users}
                    loading={usersLoading}
                    placeholder='请输入'
                    allowClear
                  />
                </Form.Item>
              </Col>
            )}

            {isShowSearchForm && (
              <Col span={8}>
                <Form.Item name="recipientId" label="接收人账号">
                  <Select
                    options={users}
                    loading={usersLoading}
                    placeholder='请输入'
                    allowClear
                  />
                </Form.Item>
              </Col>
            )}

            <Col span={8}>
              <Form.Item name="createdAt" label="创建时间">
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="downAt" label="完成时间">
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="deadlineAt" label="截止时间">
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>

            <Col span={8} offset={isShowSearchForm ? 0 : 16}>
              <Form.Item style={{ textAlign: 'end' }}>
                <Button
                  onClick={onReset}>重置</Button>
                <Button
                  type='primary'
                  loading={getTaskLoading}
                  onClick={onSearch}
                  style={{ marginLeft: 8 }}
                >查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <TaskDetailDrawer
        open={!!actionType}
        actionType={actionType}
        userList={users}
        onSearch={onSearch}
        taskDetial={taskDetial}
        onClose={onDrawerClose}
      />

      <Card style={{ margin: '24px 16px', }}>
        <div style={{ textAlign: 'end', marginBottom: 16 }}>
          <Button type="primary" onClick={onDrawerOpen}>新建任务</Button>
        </div>

        <Table<Task>
          // scroll={{ y: 55 * 10 }}
          columns={columns}
          rowKey={'id'}
          dataSource={dataSource}
          pagination={{
            onChange: getData,
            ...pagination,
          }}
          // pagination={tableParams.pagination}
          loading={getTaskLoading}
        />
      </Card>
    </div>
  )
}

export default TaskManagement
