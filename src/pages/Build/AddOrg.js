import { Form, Input, message, Button, Modal } from "antd";
import React, { useState } from "react";
import axios from "axios";

const AddOrganization = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    form.resetFields();
    setLoading(false);
    setIsModalOpen(true);
  };

  const onCancelAdd = () => {
    setIsModalOpen(false);
  };
  const onAddUser = (e) => {
    form.submit();
  };
  const [loading, setLoading] = useState(false);
  const onFormFinish = (value) => {
    console.log("finish", value);
    setLoading(true);
    axios
      .post("/org", value)
      .then((response) => {
        console.log("res", response);
        setLoading(false);
        setIsModalOpen(false);
        message.success("เพิ่มหน่วยงานสำเร็จ");
        if (typeof onSuccess === "function") {
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
        AddOrganization
      </button>
      <Modal
        title="AddOrganization"
        open={isModalOpen}
        onCancel={onCancelAdd}
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
            ตกลง
          </Button>,
        ]}
      >
        <Form
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          onFinish={onFormFinish}
          disabled={loading}
        >
          <Form.Item
            label="Organization Name"
            name="name"
            rules={[{ min: 6, max: 25, required: true, whitespace: true }]}
          >
            <Input placeholder="Organization Name" />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AddOrganization;
