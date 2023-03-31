import {
    Form,
    Input,
    Select,
    message, 
    Upload,
  } from 'antd';
  import React, { useState } from 'react';
  import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
  
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
  
    const isLt2M = file.size / 1024 / 1024 < 2;
  
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
  
    return isJpgOrPng && isLt2M;
  };

  const Usermem = () => {
    const [componentSize, setComponentSize] = useState('default');
  
    const onFormLayoutChange = ({ size }) => {
      setComponentSize(size);
    };
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
  
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
  
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
        });
      }
    };
  
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div
          style={{
            marginTop: 8,
          }}
        >
          Upload
        </div>
      </div>
    );
   

  
    return (
        
      <Form
      
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
      >
        <div className='picture'>
        <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{
            width: '100%',
          }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
    </div>
        <Form.Item label="Username">
          <Input placeholder='Username'/>
        </Form.Item>
        <Form.Item label="Name">
          <Input placeholder='Name'/>
        </Form.Item>
        <Form.Item label="Lastname">
        <Input placeholder='Lastname'/>
        </Form.Item>
        <Form.Item label="E-mail">
        <Input placeholder='E-mail'/>
        </Form.Item>
        <Form.Item label="Password">
        <Input.Password placeholder='Password'/>
        </Form.Item>
        
        <Form.Item label="Status">
          <Select placeholder="Select a Status">
            <Select.Option value="student">Student</Select.Option>
            <Select.Option value="teacher">Teacher</Select.Option>
            <Select.Option value="athlete">Athlete</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Role">
          <Select placeholder="Select a Role">
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    );
  };
  
  export default Usermem;