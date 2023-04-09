import React, { useEffect, useState, useRef } from "react";
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
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const EditRoom = ({ value, open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const formRef = useRef(form);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      console.log("orgList", response.data);
      setOrgList(response.data);
    });
  }
  const [buildingList, setBuildingList] = useState([]);
  function getBuildingInOrgID(id) {
    axios.get("/org/building/" + id).then((response) => {
      console.log("buildingList", response.data);
      setBuildingList(response.data);
    });
  }
  const [roomsList, setRoomsList] = useState([]);
  function getRoomtpye(id) {
    axios.get("/org/roomtype/" + id, { crossdomain: true }).then((response) => {
      console.log("roomsList", response.data);
      setRoomsList(response.data);
    });
  }
  const [usersList, setUsersList] = useState([]);
  function getUsersInOrgID(id) {
    axios.get("/org/user/" + id).then((response) => {
      console.log("usersList", response.data);
      setUsersList(response.data);
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
  const onChangebuild = (buildingID) => {
    console.log(`selected ${buildingID}`);
  };
  const onChangeroomtype = (roomtypeID) => {
    console.log(`selected ${roomtypeID}`);
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
    getBuildingInOrgID(orgID);
    getRoomtpye(orgID);
    getUsersInOrgID(orgID);
  };
  useEffect(() => {
    getOrg();
  }, []);

  useEffect(() => {
    if (open) {
      setLoading(false);
      setIsModalOpen(true);
    }
  }, [open]);

  useEffect(() => {
    formRef.current.resetFields();
    if (value) {
      setImageUrl(value.image.url);
      const dimention = value.Size.match(/(\d+) x (\d+)/);
      formRef.current.setFieldsValue({
        ...value,
        Org: value.Org.id,
        Building: value.Building.id,
        RoomType: value.RoomType.id,
        Contributor: value.Contributor.id,
        image: [{
          originFileObj: null
        }],
        width: Number(dimention[1]), // match index 0 will all of match eg. '55 x 55'
        long: Number(dimention[2]),
      });

      onChangeorg(value.Org.id)
    }
  }, [value]);

  const onFormFinish = (formValue) => {
    formValue = {
      ...formValue,
      image: formValue.image[0].originFileObj,
      Size: formValue.width + " x " + formValue.long + " เมตร",
    };

    delete formValue.width;
    delete formValue.long;

    console.log("Finish", formValue);

    setLoading(true);

    axios
      .putForm("/rooms/room/" + value._id, formValue)
      .then((response) => {
        console.log("res", response);
        setLoading(false);
        setIsModalOpen(false);
        message.success("เพิ่มห้องสำเร็จ");
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
      {/* <Button
        className="button-room"
        type="primary"
        onClick={showModal}
        size="large"
      >
        EditRoom
      </Button> */}
      <Modal
        title="Edit Room"
        open={open || isModalOpen}
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
            name="Org"
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
            />
          </Form.Item>
          <Form.Item
            label="อาคาร/สถานที่"
            name="Building"
            rules={[{ required: true, whitespace: true }]}
          >
            <Select
              showSearch
              placeholder="อาคาร/สถานที่"
              optionFilterProp="children"
              onChange={onChangebuild}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={buildingList}
            />
          </Form.Item>
          <Form.Item
            label="ประเภทห้อง"
            name="RoomType"
            rules={[{ required: true, whitespace: true }]}
          >
            <Select
              showSearch
              placeholder="ประเภทห้อง"
              optionFilterProp="children"
              onChange={onChangeroomtype}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={roomsList}
            />
          </Form.Item>
          <Form.Item
            label="ชื่อห้อง"
            name="Name"
            rules={[{ min: 4, max: 25, required: true, whitespace: true }]}
          >
            <Input placeholder="ชื่อห้อง" />
          </Form.Item>
          <Form.Item
            label="ความจุห้อง"
            name="Seat"
            rules={[{ type: "integer", min: 1, required: true }]}
          >
            <InputNumber
              placeholder="ความจุห้อง"
              addonAfter="ที่นั่ง"
              type="number"
              min={1}
            />
          </Form.Item>
          <Form.Item label="ขนาดของห้อง" required={true}>
            <Space.Compact>
              <Form.Item
                name="width"
                style={{ marginBottom: 0 }}
                rules={[{ type: "number", min: 0.01, required: true }]}
              >
                <InputNumber
                  addonAfter="x"
                  placeholder="ความกว้าง"
                  type="number"
                  min={0.01}
                />
              </Form.Item>
              <Form.Item
                name="long"
                style={{ marginBottom: 0 }}
                rules={[{ type: "number", min: 0.01, required: true }]}
              >
                <InputNumber
                  addonAfter="เมตร"
                  placeholder="ความยาว"
                  type="number"
                  min={0.01}
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item label="อุปกรณ์ภายในห้อง" name="Object">
            <Checkbox.Group
              style={{
                width: "100%",
              }}
            >
              <Row>
                <Col span={12}>
                  <Checkbox value="พัดลม/แอร์">พัดลม/แอร์</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="ปลั๊กไฟ">ปลั๊กไฟ</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="เครื่องเสียง/ไมค์">
                    เครื่องเสียง/ไมค์
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="คอมพิวเตอร์">คอมพิวเตอร์</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="โปรเจคเตอร์">โปรเจคเตอร์</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="รายละเอียด" name="Detail">
            <Input.TextArea placeholder="รายละเอียด" />
          </Form.Item>
          <Form.Item
            label="Room Contributor"
            name="Contributor"
            rules={[{ required: true, whitespace: true }]}
          >
            <Select
              showSearch
              placeholder="ผู้ดูแล"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.email ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              fieldNames={{ label: "email", value: "_id" }}
              options={usersList}
            />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default EditRoom;