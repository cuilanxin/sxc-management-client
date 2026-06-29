import { useEffect, useState } from 'react'
import { Drawer, Row, Col, Button, DatePicker, Form, Input, Select, message, type DrawerProps } from 'antd';
// import UploadComponent from '@/component/UploadComponent';
import moment from 'moment';
import { Task, taskStatusOptions } from '@/api/types';
import { DefaultOptionType } from 'antd/es/select';
import { createTask, updateTask } from '@/api/task-management';





interface TaskDetailDrawerProps extends DrawerProps {
  taskDetial: Task | null,
  userList: DefaultOptionType[],
  onTableChange: (...params: any) => void
}


function TaskDetailDrawer(props: TaskDetailDrawerProps) {
  const { userList, taskDetial, onTableChange, ...drawerProps } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (drawerProps.open && taskDetial) {
      form?.setFieldsValue({
        ...taskDetial,
        deadlineAt: moment(taskDetial.deadlineAt)
      })
    }
    return () => {
      form.resetFields()
    }
  }, [drawerProps.open])

  const onSubmit = (e: any) => {
    form.validateFields().then(formValues => {
      const params = {
        ...(taskDetial || {}),
          recipient: userList.find(item => item.value === formValues.recipientId)?.label,
          ...formValues,
          deadlineAt: moment(formValues.deadlineAt).format('YYYY-MM-DD HH:mm:ss')
      };
      setLoading(true);
      (taskDetial ? updateTask(params) : createTask(params)).then(() => {
          message.success(taskDetial ? '编辑成功' : '创建成功')
          drawerProps.onClose!(e)
          onTableChange()
        }, err => {
          message.error(err.message || '网络异常稍后重试！')
        }).finally(() => {
          setLoading(false)
        })
    }, (err) => {

    })
  }

  return (
    <Drawer
      title={taskDetial ? "编辑任务" : "新建任务"}
      width="65%"
      footer={(
        <div style={{ textAlign: 'end' }}>
          <Button
            style={{ marginRight: 8 }}
            onClick={drawerProps.onClose}
          >
            取消
          </Button>

          <Button loading={loading} onClick={onSubmit} type="primary">提交</Button>
        </div>
      )}
      {...drawerProps}
    >
      <Form
        // {...layout}
        form={form}
        labelCol={{ flex: '0 0 120px' }}
        name="TaskDetailDrawer"
      // style={{ maxWidth: 600 }}
      >

        <Row>
          <Col span={8}>
            <Form.Item name="taskName" label="任务名称" rules={[{ required: true, }]}>
              <Input placeholder='请输入' allowClear />
            </Form.Item>
          </Col>

          {taskDetial && (
            <Col span={8}>
              <Form.Item name="taskStatus" label="任务状态" rules={[{ required: true, }]}>
                <Select placeholder='请选择' options={taskStatusOptions} allowClear />
              </Form.Item>
            </Col>
          )}

          <Col span={8}>
            <Form.Item name="recipientId" label="接收人" rules={[{ required: true, }]}>
              <Select
                options={userList}
                placeholder='请输入'
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="deadlineAt" label="截止时间" rules={[{ required: true, }]}>
              <DatePicker disabled={!!taskDetial} style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </Col>

          {/* <Col span={8}>
            <Form.Item extra="敬请期待" name="f" label="附件">
              <UploadComponent />
            </Form.Item>
          </Col> */}

          <Col span={24}>
            <Form.Item rules={[{ required: true, }]} labelCol={{ flex: '0 0 120px' }} name="taskInfo" label="任务介绍">
              <Input.TextArea placeholder='请输入' allowClear></Input.TextArea>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item labelCol={{ flex: '0 0 120px' }} name="taskProgress" label="任务进度">
              <Input.TextArea placeholder='请输入' allowClear></Input.TextArea>
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Drawer>
  )
}


export default TaskDetailDrawer