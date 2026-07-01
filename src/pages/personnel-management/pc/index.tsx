import { useState } from 'react'
import { Row, Col, Card, Button, DatePicker, Form, Input, Space, Table, message, Popconfirm, Select, Tag } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd';
import PersonnelModal from './PersonnelModal';
import { deleteUser, getUsers, logoutUser } from '@/api/personnel-management';
import { GetUsersParams, UserInfo } from '@/api/types';


const layout = {
  labelCol: { span: 8 },
  // wrapperCol: { span: 16 },
};


function PersonnelManagement() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false)
  const [personnel, setPersonnel] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({})
  const [tableParams, setTableParams] = useState({
    pagination: {
      // current: 1,
      // pageSize: 10,
      total: 0,
    },
    data: new Array<UserInfo>(),
  })


  const getTableData = (pageNum: number, pageSize: number, values: GetUsersParams) => {
    setLoading(true)
    getUsers(values).then((val) => {
      setTableParams({
        pagination: {
          //   current: pageNum,
          //   pageSize,
          total: val.users.length || 0,
        },
        data: val.users,
      })
      setFormValues(values)
    }, err => {
      message.error(err.message || '网络异常稍后重试！')
    }).finally(() => {
      setLoading(false)
    })
  }

  const onSubmit = () => {
    const values = form.getFieldsValue()
    getTableData(1, 10, {
      ...values,
      registerAt: values.registerAt ? [values.registerAt[0].format('YYYY-MM-DD'), values.registerAt[1].format('YYYY-MM-DD')] : null
    })
  };

  const onReset = () => {
    form.resetFields();
  };

  const onTableChange = (pagination: TablePaginationConfig = tableParams.pagination) => {
    getTableData(pagination.current!, pagination.pageSize!, formValues)
  };

  const onModalOpen = () => {
    setOpen(true)
  }

  const onModalCancel = () => {
    setOpen(false)
    setPersonnel(null)
  }

  const onLogoutUser = (username: string) => {
    return logoutUser({ username }).then(() => {
      message.success('注销成功！')
      onTableChange()
    }, err => {
      message.error(err.message || '网络错误')
      return Promise.reject(err)
    })
  }

  const onDelete = (username: string) => {
    return deleteUser({ username }).then(() => {
      message.success('删除成功！')
      onTableChange()
    }, err => {
      message.error(err.message || '网络错误')
      return Promise.reject(err)
    })
  }

  const columns: TableProps<UserInfo>['columns'] = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '账号', dataIndex: 'username', key: 'username', width: 100 },
    { title: '任务数量', dataIndex: 'taskNum', key: 'taskNum', width: 100 },
    { title: '已完成任务数量', dataIndex: 'taskConfirmedNum', key: 'taskConfirmedNum', width: 100 },
    { title: '未完成任务数量', dataIndex: 'taskUnfinishedNum', key: 'taskUnfinishedNum', width: 100 },
    { title: '未确认任务数量', dataIndex: 'taskUnConfirmedNum', key: 'taskUnConfirmedNum', width: 100 },
    // { title: '作废任务数量', dataIndex: 'address', key: 'address', width: 100 },
    { title: '创建时间', dataIndex: 'registerAt', key: 'registerAt', width: 100 },
    {
      title: '是否注销',
      dataIndex: 'isLogout',
      key: 'isLogout',
      width: 100,
      render(value) {
        if (value) {
          return (
            <Tag color={'red'}>
              是
            </Tag>
          )
        }
        return (
          <Tag color={'success'}>
            否
          </Tag>
        )
      },
    },
    {
      title: '操作',
      fixed: true,
      width: 100,
      key: 'action',
      render: (_, record) => (
        <Space size="medium">
          {record.isLogout || (<Popconfirm title='确认注销？' onConfirm={() => onLogoutUser(record.username as string)}>
            <a>注销账号</a>
          </Popconfirm>)}
          {record.isLogout && (<Popconfirm title='确认删除？删除后不可找回！' onConfirm={() => onDelete(record.username as string)}>
            <a>删除账号</a>
          </Popconfirm>)}
          <a onClick={() => {
            onModalOpen()
            setPersonnel(record)
          }}>编辑</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ margin: '24px 16px', }}>
        <Form
          {...layout}
          labelCol={{ flex: '0 0 120px' }}
          form={form}
          colon={false}
          name="PersonnelManagement"
        // style={{ maxWidth: 600 }}
        >
          <Row>
            <Col span={8}>
              <Form.Item name="name" label="姓名">
                <Input placeholder='请输入' allowClear />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="username" label="账号">
                <Input placeholder='请输入' allowClear />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="registerAt" label="创建时间">
                <DatePicker.RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="isLogout" label="是否注销">
                <Select
                  placeholder='请选择'
                  allowClear
                  options={[
                    { label: '全部', value: '' },
                    { label: '是', value: true },
                    { label: '否', value: false }
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={8} offset={8}>
              <Form.Item style={{ textAlign: 'end' }}>
                <Button onClick={onReset}>重置</Button>
                <Button type='primary' onClick={onSubmit} style={{ marginLeft: 8 }}>查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <PersonnelModal
        open={open}
        personnel={personnel}
        onCancel={onModalCancel}
        onTableChange={onTableChange}
      />

      <Card style={{ margin: '24px 16px', }}>
        <div style={{ textAlign: 'end', marginBottom: 16 }}>
          <Button type="primary" onClick={onModalOpen}>新建人员</Button>
        </div>

        <Table<UserInfo>
          // scroll={{ y: 55 * 10 }}
          columns={columns}
          rowKey={'username'}
          dataSource={tableParams.data}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={onTableChange}
        />
      </Card>
    </div>
  )
}

export default PersonnelManagement
