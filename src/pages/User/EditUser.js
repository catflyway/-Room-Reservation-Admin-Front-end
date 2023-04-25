import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Modal,
  Input,
  InputNumber,
  Form,
  Select,
  Checkbox,
  Col,
  Row,
  message,
  Upload,
  Button,
  Space,
} from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../../user-context";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const EditUser = ({ value, openEdit, onCancel, onSuccess }) => {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const formRef = useRef(form);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const [orgList, setOrgList] = useState([]);
  const [orgLoading, setOrgLoading] = useState(false);
  function getOrg() {
    setOrgLoading(true);
    axios
      .get("/org")
      .then((response) => {
        setOrgLoading(false);
        setOrgList(response.data);
      })
      .catch((err) => {
        setOrgLoading(false);
      });
  }
  const [userStatusLoading, setUserStatusLoading] = useState(false);
  const [status, setstatus] = useState([]);
  function getStatus(id) {
    form.resetFields(["status"]);
    setUserStatusLoading(true);
    axios
      .get("/org/status/" + id)
      .then((response) => {
        setUserStatusLoading(false);
        setstatus(response.data);
      })
      .catch((err) => {
        setUserStatusLoading(false);
      });
  }
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

  const onAddUser = (e) => {
    form.submit();
  };
  const onCancelAdd = () => {
    if (onCancel) {
      onCancel();
    }
    setIsModalOpen(false);
  };

  const showModal = () => {
    form.resetFields();
    setImageUrl(undefined);
    setLoading(false);
    setIsModalOpen(true);
  };

  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    getStatus(orgID);
  };

  const onChangestatus = (statusID) => {
    console.log(`selected ${statusID}`);
  };
  let userRoleOption = [
    {
      value: "User",
      label: "User",
    },
    {
      value: "Room Contributor",
      label: "Room Contributor",
    },
    {
      value: "Contributor",
      label: "Contributor",
    },
  ];
  if (user.role == "Administrator") {
    userRoleOption.push({
      value: "Administrator",
      label: "Administrator",
    });
  }

  const [initialValues, setInitialValues] = useState(() => {
    let value = {};
    if (user.canNotChangeOrg) {
      value["org"] = user.org.id;
    }
    return value;
  });
  useEffect(() => {
    formRef.current.resetFields();
  }, [initialValues]);
  useEffect(() => {
    if (user.canNotChangeOrg) {
      onChangeorg(user.org.id);
    }
    getOrg();
  }, []);

  useEffect(() => {
    if (openEdit) {
      setLoading(false);
      setIsModalOpen(true);
    }
  }, [openEdit]);

  useEffect(() => {
    if (value) {
      setImageUrl(value.image.url);
      setInitialValues({
        ...value,
        org: value.org?.id,
        status: value.status?.id,
        image: [
          {
            originFileObj: null,
          },
        ],
        password: null,
      });

      if (value.org) onChangeorg(value.org.id);
    }
  }, [value]);

  const onFormFinish = (formValue) => {
    formValue = {
      ...formValue,
      image: formValue.image[0].originFileObj,
      password: formValue.password === "" ? null : formValue.password,
    };
    console.log("Finish", formValue);

    setLoading(true);

    let req;
    if (openEdit) {
      req = axios.putForm("/users/" + value._id, formValue);
    } else {
      req = axios.postForm("/users", formValue);
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
          message.success("แก้ไขผู้ใช้สำเร็จ");
        } else {
          message.success("เพิ่มผู้ใช้สำเร็จ");
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
        className="button-room"
        type="primary"
        onClick={showModal}
        size="large"
      >
        AddUser
      </Button>
      <Modal
        title={openEdit ? "Edit " + value.username : "Add User"}
        open={openEdit || isModalOpen}
        onOk={onAddUser}
        onCancel={onCancelAdd}
        confirmLoading={loading}
      >
        <Form
          form={form}
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 19,
          }}
          layout="horizontal"
          onFinish={onFormFinish}
          disabled={loading}
          initialValues={initialValues}
        >
          <Form.Item
            name="image"
            rules={[{ required: true }]}
            label=""
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
              disabled={user.canNotChangeOrg}
            />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ min: 6, max: 12, required: true, whitespace: true }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Firstname"
            name="firstname"
            rules={[{ min: 6, max: 25, required: true, whitespace: true }]}
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
                  if (openEdit) {
                    return Promise.resolve();
                  }
                  return new Promise((resolve, reject) => {
                    axios
                      .get("/users/searchby", { params: { email: value } })
                      .then((response) => {
                        if (response.data.filter((record) => record.email === value).length) {
                          reject();
                        } else {
                          resolve();
                        }
                      })
                  })
                }
              },


            ]}
          >
            <Input placeholder="E-mail" disabled={openEdit} />
          </Form.Item>
          {!["Room Contributor"].includes(user.role) ? (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  min: 6,
                  max: 25,
                  required: openEdit ? false : true,
                  whitespace: true,
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, whitespace: true }]}
          >
            <Select
              showSearch
              placeholder="Status"
              optionFilterProp="children"
              onChange={onChangestatus}
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
          // disabled={["Contributor"].includes(user.role)}
          >
            <Select
              style={{
                width: "200px",
              }}
              allowClear
              showSearch
              placeholder="Role"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.value ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              // disabled={["Contributor"].includes(user.role)}
              options={userRoleOption}
            />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default EditUser;
