import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Input,
  Select,
  Image,
  Button,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import axios from "axios";
import { UserContext } from "./user-context";
import { UploadOutlined } from "@ant-design/icons";

function Profile() {
  const user = useContext(UserContext);
  const [form] = Form.useForm();

  const [imageUrl, setImageUrl] = useState();
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
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
  const [initProfile, setInitProfile] = useState({});
  function getUserprofile() {
    axios.get("/users/userprofile").then((response) => {
      console.log("/users/userprofile", response.data);

      setImageUrl(response.data.image.url);
      setInitProfile({
        ...response.data,
        org: response.data.org?.id,
        status: response.data.status?.id,
        image: [
          {
            originFileObj: null,
          },
        ],
        password: null,
      });
      if (response.data.org) onChangeorg(response.data.org.id);
      form.resetFields();
    });
  }
  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    getStatus(orgID);
  };

  // const [statuslist, setstatuslist] = useState([]);
  // function getStatus() {
  //   axios
  //     .get("/org/status/" + user.org.id, { crossdomain: true })
  //     .then((response) => {
  //       console.log("/org/status/", response.data);
  //       setstatuslist(response.data);
  //     });
  // }
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
  const [status, setstatus] = useState([]);
  function getStatus(id) {
    axios
      .get("/org/status/" + id)
      .then((response) => {
        console.log(response);
        setstatus(response.data);
        form.resetFields(["status"]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getUserprofile();
    getOrg();
  }, []);

  const Logout = () => {
    localStorage.removeItem("userData");
    document.location.reload(true);
  };
  const onEditUser = (e) => {
    form.submit();
  };
  const onFormFinish = (formValue) => {
    setInitProfile(
      (formValue = {
        ...formValue,
        image: formValue.image[0].originFileObj,
        password: formValue.password === "" ? null : formValue.password,
      })
    );
    console.log("Finish", formValue);
    axios
      .putForm("/users/" + user._id, formValue)

      .then((response) => {
        console.log("res", response);
        message.success("แก้ไขโปรไฟล์สำเร็จ");
      })
      .catch((err) => {
        console.log("err", err);
        message.error("ERROR");
      });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="Profile">
      <Row justify="center">
        <Col sm={{ span: 24 }} md={{ span: 18 }} lg={{ span: 12 }}>
          <Form
            form={form}
            className="Profileform"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            layout="horizontal"
            initialValues={initProfile}
            onFinish={onFormFinish}
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
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
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
              rules={[
                {
                  min: 6,
                  max: 25,
                  required: true,
                  type: "email",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="E-mail" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  min: 6,
                  max: 25,
                  required: false,
                  whitespace: true,
                },
              ]}
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
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={status}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>

      <Row justify="center">
        <Col>
          <Button className="button-reset" onClick={onReset}>
            Reset
          </Button>

          <Button className="button-logout" type="primary" onClick={onEditUser}>
            Save
          </Button>
        </Col>
      </Row>

      <Row justify="center">
        <Col>
          <Button className="button-user-mana3" type="danger" onClick={Logout}>
            Logout
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
