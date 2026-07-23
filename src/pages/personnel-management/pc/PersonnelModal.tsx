import { useEffect, useState } from 'react'
import { Modal, Button, Form, Input, type ModalProps, message } from 'antd';
import { register } from '@/api/login';
import { updateUser } from '@/api/personnel-management';
// import UploadComponent from '@/component/UploadComponent';



const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface PersonnelDrawerProps extends ModalProps {
  personnel: any
  onTableChange: (...params: any) => void
}


function PersonnelModal(props: PersonnelDrawerProps) {
  const { personnel, onTableChange, ...modalProps } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(modalProps.open && personnel) {
      form?.setFieldsValue({
        username: personnel.username, 
        name: personnel.name
      })
    }
    return () => {
      form.resetFields()
    }
  }, [modalProps.open])
  
  const onSubmit = (e: any) => {
    
    form.validateFields().then(formValues => {
      const params = {
        ...formValues,
        password: formValues.password || '123456', 
      };
      (personnel ? updateUser(params) : register(params)).then(() => {
        message.success(personnel ? '更新成功！' : '创建成功！')
        modalProps.onCancel!(e)
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
    <Modal
      title={personnel ? "编辑人员" : "新建人员"}
      // width="65%"
      // loading={true}
      footer={(
        <div style={{ textAlign: 'end' }}>
          <Button
            style={{ marginRight: 8 }}
            // @ts-ignore
            onClick={modalProps.onCancel}
          >
            取消
          </Button>

          <Button onClick={onSubmit} loading={loading} type="primary">提交</Button>
        </div>
      )}
      {...modalProps}
    >
      <Form
        {...layout}
        form={form}
        // labelCol={{ flex: '0 0 120px' }}
        name="PersonnelModal"
      // style={{ maxWidth: 600 }}
      >
        <Form.Item name="name" label="姓名" rules={[{required: true}]}>
          <Input disabled={!!personnel} placeholder='请输入' allowClear />
        </Form.Item>

        <Form.Item name="username" label="账号"  rules={[{required: true}]}>
          <Input disabled={!!personnel} placeholder='请输入' allowClear />
        </Form.Item>

        <Form.Item name="password" label="密码" extra="默认：123456">
          <Input placeholder='请输入' allowClear />
        </Form.Item>
      </Form>
    </Modal>
  )
}


export default PersonnelModal