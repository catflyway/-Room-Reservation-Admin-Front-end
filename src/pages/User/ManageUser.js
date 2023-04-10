import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Input,
  Form,
  Image,
  Select,
  Row,
  Col,
  Space,
  Typography,
  Button,
} from "antd";
import EditUser from "./EditUser";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const { Search } = Input;
const { Option } = Select;

const ManageUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    org: "",
  });
  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      console.log("org", response.data);
      setOrgList(response.data);
    });
  }
  const [dataUsers, setDataUsers] = useState([]);
  const [status, setstatus] = useState([]);
  function getStatus(id) {
    axios.get("/org/status/" + id, { crossdomain: true }).then((response) => {
      console.log("org", "status", id, response.data);
      setstatus(response.data);
    });
  }
  useEffect(() => {
    getOrg();
  }, []);
  const [idOrg, setIdorg] = useState();
  const onChangeorg = (value) => {
    console.log(`selected ${value}`);
    setFormData({ ...formData, org: value });
    setIdorg(value);
    getStatus(value);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  function getAllUser() {
    axios.get("/users", { crossdomain: true }).then((response) => {
      console.log("users", response.data);
      setDataUsers(
        response.data.map((value) => ({
          ...value,
          statusName: value.status?.name,
        }))
      );
    });
  }
  useEffect(() => {
    getAllUser();
  }, []);
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      key: "1",
      title: "Profile",
      render: (record) => {
        return (
          <Image
            className="imgprofilebor"
            width={80}
            height={80}
            src={record.image.url}
          />
        );
      },
      fixed: "left",
      align: "center",
    },
    {
      key: "2",
      title: "Username",
      dataIndex: "username",
      fixed: "left",
    },
    {
      key: "3",
      title: "Name",
      dataIndex: "firstname",
    },
    {
      key: "4",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "5",
      title: "Status",
      dataIndex: "statusName",
    },
    {
      key: "6",
      title: "Role",
      dataIndex: "role",
    },
    {
      key: "7",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditUser(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteUser(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
      fixed: "right",
      align: "center",
    },
  ];
  const columnsstatus = [
    {
      key: "1",
      title: "Status",
      dataIndex: "name",
    },
    {
      key: "2",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditUser(record);
              }}
              style={{ color: "blue", marginLeft: 12 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteUser(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onDeleteUser = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this user record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((users) => users.id !== record.id);
        });
      },
    });
  };
  const [isEditing, setIsEditing] = useState(false);
  // const [editingUser, setEditingUser] = useState(null);
  const [editingData, setEditingdata] = useState(null);
  const onEditUser = (record) => {
    setIsEditing(true);
    setEditingdata({ ...record });
  };

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [AddStatusU, setIsAddStatusUser] = useState(false);

  const openaddstatus = () => {
    setIsAddStatusUser(true);
  };
  const Canceladdstatus = () => {
    setIsAddStatusUser(false);
  };

  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  const handleOk1 = () => {
    setIsModalOpen1(false);
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const handleSubmit = () => {
    console.log(formData);
    axios
      .post("/users/status", formData)
      .then((res) => {
        getStatus(idOrg);
      })
      .catch((err) => console.log(err));
    setIsAddStatusUser(false);
  };

  return (
    <div className="ManageUser">
      <Row justify="space-between" align="middle">
        <Col>
          <Title style={{ color: " #3F478D" }}>ManageUser</Title>
        </Col>
        <Col>
          <Space wrap>
            <Button type="primary" size="large" onClick={showModal1}>
              ManageStatus
            </Button>
            <EditUser
              value={editingData}
              openEdit={isEditing}
              onCancel={() => {
                setIsEditing(false);
              }}
              onSuccess={() => {
                setIsEditing(false);
                getAllUser();
              }}
            />
          </Space>
        </Col>
      </Row>

      <br />
      <Row justify="center">
        <Space wrap>
          <Form.Item label="Organization">
            <Select placeholder="Select a Building">
              <Option value="student">ECC</Option>
              <Option value="teacher">โรงแอล</Option>
              <Option value="athlete">ห้องประชุมพันปี</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status">
            <Select placeholder="Select a Status">
              <Option value="student">Student</Option>
              <Option value="teacher">Teacher</Option>
              <Option value="athlete">Athlete</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Role">
            <Select placeholder="Select a Role">
              <Select.Option value="User">User</Select.Option>
              <Select.Option value="Room Contributor">
                Room Contributor
              </Select.Option>
              <Select.Option value="Contributor">Contributor</Select.Option>
              <Select.Option value="Administrator">Administrator</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Search
              placeholder="Search Users"
              allowClear
              onSearch={onSearch}
              style={{
                width: 200,
              }}
            />
          </Form.Item>
        </Space>
      </Row>

      <br />
      <Table
        columns={columns}
        dataSource={dataUsers}
        rowKey={(record) => record._id}
      ></Table>

      <Modal
        title="ManageStatus"
        open={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel1}
        footer={[]}
      >
        <button
          className="button-submit1"
          id="1"
          type="primary"
          onClick={openaddstatus}
        >
          AddStatus
        </button>
        <Form.Item label="หน่วยงาน">
          <Select
            showSearch
            placeholder="หน่วยงาน"
            optionFilterProp="children"
            onChange={onChangeorg}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
            }
            fieldNames={{ label: "name", value: "_id" }}
            options={orgList}
          />
        </Form.Item>
        <Modal
          title="AddStatus"
          open={AddStatusU}
          onOk={handleSubmit}
          onCancel={Canceladdstatus}
        >
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
            <Form.Item label="Statusname">
              <Input
                placeholder="Statusname"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                value={formData.name}
              />
            </Form.Item>
          </Form>
        </Modal>
        <header className="User-list-heard">
          <Table
            columns={columnsstatus}
            dataSource={status}
            pagination={false}
          ></Table>
        </header>
      </Modal>
    </div>
  );
};

export default ManageUser;
