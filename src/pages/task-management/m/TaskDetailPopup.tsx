import { useEffect, useState } from 'react'
import { DatePickerRef, Popup, DatePicker, Button, Form, Input, Picker, TextArea, Toast, PopupProps, PickerRef } from 'antd-mobile'
import moment from 'moment';
import { action_label, ACTION_TYPE, Task, taskStatusOptions } from '@/api/types';
import { createTask, updateTask } from '@/api/task-management';
import { RefObject } from 'react'
import { getUsers } from '@/api/personnel-management';
import dayjs from 'dayjs'
import style from './index.module.less'




interface TaskDetailPopupProps extends PopupProps {
  taskDetial: Task | null,
  onSearch: (...params: any) => void
  actionType: ACTION_TYPE | null
}


function TaskDetailPopup(props: TaskDetailPopupProps) {
  const { taskDetial, onSearch, actionType, ...popupProps } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<{ label: string, value: string }[]>([]);

  useEffect(() => {
    if (popupProps.visible) {
      getUsers({ isLogout: false }).then((allUsersRes) => {
        setUsers(allUsersRes.users.map((item => ({
          value: item.username,
          label: item.name
        }))))
      }, err => {
        Toast.show({
          content: err.message || '网络异常稍后重试！'
        })
      })

      taskDetial && form?.setFieldsValue({
        ...taskDetial,
        deadlineAt: moment(taskDetial.deadlineAt)
      })
    }
    return () => {
      form.resetFields()
    }
  }, [popupProps.visible])

  const onSubmit = (e: any) => {
    form.validateFields().then(formValues => {
      const params = {
        ...(taskDetial || {}),
        recipient: users.find(item => item.value === formValues.recipientId)?.label,
        ...formValues,
        deadlineAt: moment(formValues.deadlineAt).format('YYYY-MM-DD HH:mm:ss')
      };
      setLoading(true);
      (taskDetial ? updateTask(params) : createTask(params)).then(() => {
        Toast.show({
          content: taskDetial ? '编辑成功' : '创建成功',
        })
        popupProps.onClose!()
        onSearch()
      }, err => {
        Toast.show({
          content: err.message || '网络异常稍后重试！'
        })
      }).finally(() => {
        setLoading(false)
      })
    }, (err) => {

    })
  }

  const disabled = actionType === ACTION_TYPE.VIEW

  return (
    <Popup
      bodyStyle={{ height: '80vh', overflow: 'hidden' }}
      {...popupProps}
    >
      <div className={style['popup']}>
        <div className={style['popup-title']}>{action_label[actionType!]+"任务" }</div>

        <Form
          disabled={disabled}
          // mode='card'
          // {...layout}
          form={form}
          layout='horizontal'
          name="TaskDetailPopup"
        // style={{ maxWidth: 600 }}
        >

          <Form.Item name="taskName" label="任务名称" rules={[{ required: true, }]}>
            <Input
              placeholder='请输入'
            />
          </Form.Item>

          {taskDetial && (
            <Form.Item
              label='任务状态'
              name='taskStatus'
              rules={[{ required: true, }]}
              trigger='onConfirm'
              onClick={(_, ref: RefObject<PickerRef>) => ref.current?.open()}
              getValueProps={value => ({ value: value && [value] })}
              normalize={value => (value && value.length > 0 ? value[0] : value)}
            >
              <Picker
                columns={[
                  taskStatusOptions
                ]}
              >
                {value => (value && value.length > 0 ? value[0]?.label : '')}
              </Picker>
            </Form.Item>
          )}

          <Form.Item
            name="recipientId"
            label="接收人"
            rules={[{ required: true, }]}
            trigger='onConfirm'
            onClick={(_, ref: RefObject<PickerRef>) => ref.current?.open()}
            getValueProps={value => ({ value: value && [value] })}
            normalize={value => (value && value.length > 0 ? value[0] : value)}
          >
            <Picker
              columns={[
                users,
              ]}
            >
              {value => (value && value.length > 0 ? value[0]?.label : '')}
            </Picker>
          </Form.Item>

          <Form.Item
            name="deadlineAt"
            label="截止时间"
            // rules={[{ required: true }]}
            trigger='onConfirm'
            
            getValueProps={value => ({ value: value ? new Date(value) : value })}
            normalize={value => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value)}
            onClick={(_, ref: RefObject<DatePickerRef>) => ref.current?.open()}
          >
            <DatePicker precision='minute' >
              {value => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '默认当天23:59:59')}
            </DatePicker>
          </Form.Item>

          {/* <Col span={8}>
            <Form.Item extra="敬请期待" name="f" label="附件">
              <UploadComponent />
            </Form.Item>
          </Col> */}

          <Form.Item rules={[{ required: true, }]} name="taskInfo" label="任务介绍">
            <TextArea rows={4} placeholder='请输入' ></TextArea>
          </Form.Item>

          <Form.Item name="taskProgress" label="任务进度">
            <TextArea rows={4}  placeholder='请输入' ></TextArea>
          </Form.Item>
        </Form>
        
        <div className={style['positioning']}></div>
        <div className={style['popup-footer']}>
          <Button
            style={{ marginRight: 8, width: disabled ? '100%' : 'calc(35% - 8px)' }}
            onClick={popupProps.onClose}
            color={disabled ? "primary" : "default"}
          >
            {disabled ? '知道了' :'取消'}
          </Button>

          {disabled || (
            <Button
              loading={loading}
              style={{ width: '65%' }}
              onClick={onSubmit}
              color="primary"
            >
              提交
            </Button>
          )}
        </div>
      </div>
    </Popup>
  )
}


export default TaskDetailPopup