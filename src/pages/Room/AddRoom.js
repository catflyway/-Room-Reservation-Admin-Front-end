import React, { useEffect, useRef, useState } from "react";
import { Tag, Input, Form, Select,  Checkbox, Col, Row } from "antd";
import { PlusOutlined,LoadingOutlined } from "@ant-design/icons";
import {
  message, 
  Upload,
} from 'antd';
const onChange = (checkedValues) => {
  console.log('checked = ', checkedValues);
};
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

const AddRoom = () => {
  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const { Search } = Input;

const [loading, setLoading] = useState(false);
const [imageUrl, setImageUrl] = useState();
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
  const [tags, setTags] = useState([ ]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }

    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };
  return (
    <Form
      labelCol={{
        span: 6,
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
      <Form.Item label="อาคาร"> 
        <Select placeholder="Select a Building">
          <Select.Option value="student">ECC</Select.Option>
          <Select.Option value="teacher">โรงแอล</Select.Option>
          <Select.Option value="athlete">ห้องประชุมพันปี</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="ประเภทห้อง">
        <Select placeholder="Select a Status">
          <Select.Option value="student">ECC</Select.Option>
          <Select.Option value="teacher">โรงแอล</Select.Option>
          <Select.Option value="athlete">ห้องประชุมพันปี</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="ชื่อห้อง">
        <Input placeholder="ชื่อห้อง" />
      </Form.Item>
      <Form.Item label="จำนวนที่จอง">
        <Input placeholder="จำนวนที่จอง" />
      </Form.Item>
      <Form.Item label="ขนาดของห้อง">
        <Input placeholder="ขนาดห้อง" />
      </Form.Item>
      <Form.Item label="อุปกรณ์ภายในห้อง">
      <Checkbox.Group
    style={{
      width: '100%',
    }}
    onChange={onChange}
  >
    <Row>
      <Col span={12}>
        <Checkbox value="A">พัดลม/แอร์</Checkbox>
      </Col>
      <Col span={12}>
        <Checkbox value="B">ปลั๊กไฟ</Checkbox>
      </Col>
      <Col span={12}>
        <Checkbox value="C">เครื่องเสียง/ไมค์</Checkbox>
      </Col>
      <Col span={12}>
        <Checkbox value="D">คอมพิวเตอร์</Checkbox>
      </Col>
      <Col span={12}>
        <Checkbox value="E">โปรเจคเตอร์</Checkbox>
      </Col>
    </Row>
  </Checkbox.Group>
      </Form.Item>
      <Form.Item label="รายละเอียด">
        <Input placeholder="รายละเอียด" />
      </Form.Item>
      <Form.Item label="Contributor">
        <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value="1">โรงพยาบาลA</Option>
            <Option value="2">โรงเรียนA</Option>
            <Option value="3">โรงเรียนB</Option>
            <Option value="4">ตึกB</Option>
          </Select>
      </Form.Item>
    </Form>
  );
};

export default AddRoom;
