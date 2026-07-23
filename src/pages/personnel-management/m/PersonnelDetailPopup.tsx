import { useEffect, useState } from 'react'
import {  Popup, Button, Form, Input,  Toast, PopupProps } from 'antd-mobile'
import { action_label, ACTION_TYPE, UserInfo } from '@/api/types';
import { createTask, updateTask } from '@/api/task-management';
import { getUsers, updateUser } from '@/api/personnel-management';
import style from './index.module.less'
import { register } from '@/api/login';




interface PersonnelDetailPopupProps extends PopupProps {
  personnel: UserInfo | null,
  onSearch: (...params: any) => void
  actionType: ACTION_TYPE | null
}


function PersonnelDetailPopup(props: PersonnelDetailPopupProps) {
  const { personnel, onSearch, actionType, ...popupProps } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (popupProps.visible) {
      personnel && form?.setFieldsValue({
        username: personnel.username, 
        name: personnel.name
        // deadlineAt: moment(taskDetial.deadlineAt)
      })
    }
    return () => {
      form.resetFields()
    }
  }, [popupProps.visible])

  const onSubmit = (e: any) => {
    form.validateFields().then(formValues => {
      const params = {
        ...formValues,
        password: formValues.password || '123456', 
      };
      setLoading(true);
      (personnel ? updateUser(params) : register(params)).then(() => {
        Toast.show({
          content: personnel ? '更新成功！' : '创建成功！'
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
      bodyStyle={{ height: '60vh', overflow: 'hidden' }}
      {...popupProps}
    >
      <div className={style['popup']}>
        <div className={style['popup-title']}>{action_label[actionType!]+"人员"}</div>

        <Form
          // mode='card'
          // {...layout}
          form={form}
          disabled={disabled}
          layout='horizontal'
          name="PersonnelDetailPopup"
        // style={{ maxWidth: 600 }}
        >

          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input disabled={!!personnel} placeholder='请输入' />
          </Form.Item>

          <Form.Item name="username" label="账号" rules={[{ required: true }]}>
            <Input disabled={!!personnel} placeholder='请输入' />
          </Form.Item>

          <Form.Item name="password" label="密码" extra="默认：123456">
            <Input placeholder='请输入' />
          </Form.Item>
        </Form>

        <div className={style['positioning']}></div>
        <div className={style['popup-footer']}>
          <Button
            style={{ marginRight: 8, width: disabled ? '100%' : 'calc(35% - 8px)' }}
            onClick={popupProps.onClose}
            color={disabled ? "primary" : "default"}
          >
            {disabled ? '知道了' : '取消'}
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


export default PersonnelDetailPopup