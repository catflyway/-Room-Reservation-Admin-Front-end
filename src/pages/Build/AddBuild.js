import {
    Form,
    Input,
    Select,
  } from 'antd';
  import React, { useState } from 'react';
  
  const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};

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
        <Form.Item label="Organizationtype">
        <Select
          placeholder="Select a Organizationtype"
          defaultValue="student"
          onChange={handleChange}
        >
          <Option value="student">โรงพยาบาล</Option>
          <Option value="teacher">โรงเรียน</Option>
          <Option value="athlete">อื่นๆ</Option>
        </Select>
        </Form.Item>
        <Form.Item label="E-mail">
        <Input placeholder='E-mail'/>
        </Form.Item>
        <Form.Item label="Password">
        <Input.Password placeholder='Password'/>
        </Form.Item>

        
      </Form>
    );
  };
  
  export default AddBuild;