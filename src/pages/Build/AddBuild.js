import {
    Form,
    Input,
    Select,
  } from 'antd';
  import React, { useState } from 'react';
  

  const AddBuild = () => {
  
    return (
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 14,
        }}
      >
        <Form.Item label="Organization Name">
          <Input placeholder='Organization Name'/>
        </Form.Item>
        <Form.Item label="E-mail Contributor">
        <Input placeholder='E-mail Contributor'/>
        </Form.Item>
        <Form.Item label="Password Contributor">
        <Input.Password placeholder='Password Contributor'/>
        </Form.Item>

        
      </Form>
    );
  };
  
  export default AddBuild;