import { Form, Input, Select, message, Upload, Button, Modal } from "antd";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

function delay(fn, ms) {
  let timer = 0
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(fn.bind(this, ...args), ms || 0)
  }
}

const Usermem = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const [orgList, setOrgList] = useState([]);
  const [orgLoading, setOrgLoading] = useState(false);
  function getOrg() {
    setOrgLoading(true);
    axios
      .get("/org")
      .then((response) => {
        setOrgLoading(false);
        console.log(response);
        setOrgList(response.data);
      })
      .catch((err) => {
        setOrgLoading(false);
      });
  }

  const [userStatusLoading, setUserStatusLoading] = useState(false);
  const [status, setstatus] = useState([]);
  function getStatus(id) {
    setUserStatusLoading(true);
    axios
      .get("/org/status/" + id, { crossdomain: true })
      .then((response) => {
        setUserStatusLoading(false);
        console.log(response);
        setstatus(response.data);

        form.resetFields(["status"])
      })
      .catch((err) => {
        setUserStatusLoading(false);
      });
  }

  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    getStatus(orgID);
  };

  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isLt10M) {
      message.error("Image must smaller than 10MB!");
      return false;
    }

    getBase64(file, (url) => {
      setImageUrl(url);
    });
    return false;
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const showModal = () => {
    form.resetFields();
    setImageUrl(undefined);
    setLoading(false);
    setIsModalOpen(true);
    getOrg();
  };

  const onAddUser = (e) => {
    form.submit();
  };

  const onCancelAdd = () => {
    setIsModalOpen(false);
  };

  const onFormFinish = (value) => {
    console.log("finish", value);
    value = { ...value, image: value.image[0].originFileObj };

    setLoading(true);

    // setTimeout(() => {
    //   onSendFinish();
    // }, 3000);

    axios
      .postForm("/users", value)
      .then((response) => {
        console.log("res", response);
        setLoading(false);
        setIsModalOpen(false);
        message.success("เพิ่มผู้ใช้สำเร็จ");
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
        message.error("ERROR");
      });
  };

  return (
    <React.Fragment>
      <button
        className="button-user"
        type="primary"
        size={20}
        onClick={showModal}
      >
        AddUser
      </button>

      <Modal
        open={isModalOpen}
        onCancel={onCancelAdd}
        onOk={onAddUser}
        title="เพิ่มผู้ใช้"
        footer={[
          <Button className="button-back" key="back" onClick={onCancelAdd}>
            ยกเลิก
          </Button>,

          <Button
            className="button-submit"
            key="submit"
            type="primary"
            loading={loading}
            onClick={onAddUser}
          >
            เพิ่มผู้ใช้
          </Button>,
        ]}
      >
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          onFinish={onFormFinish}
          disabled={loading}
        >
          <Form.Item
            name="image"
            label=""
            rules={[
              {
                required: true,
                message: "Please upload your picture!",
              },
            ]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            wrapperCol={{ span: 24 }}
          >
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={beforeUpload}
              maxCount={1}
              className="form-upload-picture"
            >
              {imageUrl ? (
                <div style={{ width: "100%" }}>
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      maxHeight: "150px",
                      marginBottom: "8px",
                    }}
                  />
                </div>
              ) : null}
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="หน่วยงาน"
            name="org"
            rules={[{ required: true, whitespace: true }]}
          >
            <Select
              showSearch
              placeholder="หน่วยงาน"
              optionFilterProp="children"
              onChange={onChangeorg}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={orgList}
              loading={orgLoading}
            />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ min: 6, max: 12, required: true, whitespace: true }]}
            hasFeedback
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Firstname"
            name="firstname"
            rules={[{ min: 4, max: 25, required: true, whitespace: true }]}
          >
            <Input placeholder="Firstname" />
          </Form.Item>
          <Form.Item
            label="Lastname"
            name="lastname"
            rules={[{ min: 6, max: 25, required: true, whitespace: true }]}
          >
            <Input placeholder="Lastname" />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            validateFirst={true}
            rules={[
              {
                min: 6,
                max: 25,
                required: true,
                type: "email",
                whitespace: true,
              },
              {
                validator: (_, value) => {
                  console.log(value)
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      console.log(value, "ok")
                      resolve();
                    }, 1000);
                  })
                },

                message: "มีคนใช้แล้ว นะจ่ะ"
              },
            ]}
            hasFeedback
          >
            <Input placeholder="E-mail" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ min: 6, max: 25, required: true, whitespace: true }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, whitespace: true }]}
          >
            <Select
              showSearch
              placeholder="Status"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={status}
              loading={userStatusLoading}
            />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, whitespace: true }]}
          >
            <Select placeholder="Select a Role">
              <Select.Option value="User">User</Select.Option>
              <Select.Option value="Room Contributor">Room Contributor</Select.Option>
              <Select.Option value="Contributor">Contributor</Select.Option>
              <Select.Option value="Administrator">Administrator</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Usermem;
