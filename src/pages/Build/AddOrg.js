import { Form, Input, message, Button, Modal } from "antd";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddOrganization = ({ value, openEdit, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const formRef = useRef(form);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    form.resetFields();
    setLoading(false);
    setIsModalOpen(true);
  };

  const onCancelAdd = () => {
    if (onCancel) {
      onCancel();
    }
    setIsModalOpen(false);
  };
  const onAddOrg = (e) => {
    form.submit();
  };
  useEffect(() => {
    if (openEdit) {
      setLoading(false);
      setIsModalOpen(true);
    }
  }, [openEdit]);

  useEffect(() => {
    formRef.current.resetFields();
    if (value) {
      formRef.current.setFieldsValue({
        ...value,
        org: value.name?._id,
      });
    }
  }, [value]);
  const [loading, setLoading] = useState(false);
  const onFormFinish = (formValue) => {
    console.log("Finish", formValue);
    setLoading(true);

    let req;
    if (openEdit) {
      req = axios.put("/org/" + value._id, formValue);
    } else {
      req = axios.post("org", formValue);
    }

    req
      .then((response) => {
        console.log("res", response);
        setLoading(false);
        setIsModalOpen(false);
        if (typeof onSuccess === "function") {
          onSuccess();
        }
        if (openEdit) {
          message.success("แก้ไขหน่วยงานสำเร็จ");
        } else {
          message.success("เพิ่มหน่วยงานสำเร็จ");
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
      <Button
        className="button-user"
        type="primary"
        size="large"
        onClick={showModal}
      >
        AddOrganization
      </Button>
      <Modal
        title={openEdit ? "Edit " + value.name : "AddOrganization"}
        open={openEdit || isModalOpen}
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
            onClick={onAddOrg}
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
