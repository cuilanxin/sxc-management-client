import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd'
import React from 'react'

function UploadComponent() {
  return (
    <Upload action="/upload.do" listType="picture-card">
      <button
        style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
        type="button"
      >
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    </Upload>
  )
}

export default UploadComponent
