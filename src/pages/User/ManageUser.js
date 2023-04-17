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

const ManageUser = () => {
  const [form] = Form.useForm();
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

  function getManageUsers(option) {
    let query = [];
    for (const [key, value] of Object.entries(option || {})) {
      if (value) {
        query.push(`${key}=${value}`);
      }
    }
    query = query.join("&");

    axios
      .get("/users/searchby?" + query, { crossdomain: true })
      .then((response) => {
        console.log(response);
        setDataUsers(
          response.data.map((item) => {
            return {
              ...item,
              Rolename: item.role,
              statusName: item.status?.name,
            };
          })
        );
      });
  }
  const [idOrg, setIdorg] = useState();
  const onChangeorg = (value) => {
    console.log(`selected ${value}`);
    setFormData({ ...formData, org: value });
    setIdorg(value);
    if (value) {
      getStatus(value);
    }
    form.resetFields(["status"]);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  useEffect(() => {
    getManageUsers();
  }, []);
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
                onEditstatus(record);
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
      onOk: () => {},
    });
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingdata] = useState(null);
  const onEditUser = (record) => {
    setIsEditing(true);
    setEditingdata({ ...record });
  };
  const [editForm] = Form.useForm();
  const [editingDatastatus, setEditingDatastatus] = useState(null);
  const [isEditingstatus, setIsEditingstatus] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const onEditstatus = (record) => {
    console.log("edit data", record);
    setIsEditingstatus(true);
    setEditingDatastatus(record);
    editForm.setFieldsValue(record);
  };
  const onCancelEditingBuild = () => {
    setIsEditingstatus(false);
    setEditingDatastatus(null);
  };
  const onEditFinish = (formData) => {
    console.log(formData, editingDatastatus);

    setIsEditingLoading(true);
    axios
      .put("/users/status/" + editingDatastatus._id, formData)
      .then((res) => {
        console.log("/users/status/", res.data);
        getStatus(idOrg);
        setIsEditingLoading(false);
        setIsEditingstatus(false);
      })
      .catch((err) => {
        console.log("/users/status/", err);
        setIsEditingLoading(false);
      });
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
  const onChangestatus = (buildingID) => {
    console.log(`selected ${buildingID}`);
  };

  const [SearchUserList, setSearchUserList] = useState([]);
  function getSearchuser(id) {
    axios.get("/users/search/" + id, { crossdomain: true }).then((response) => {
      console.log(response);
      setSearchUserList(response.data);
    });
  }
  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = SearchUserList.filter(
    (o) => !selectedItems.includes(o)
  );
  const onFilterChange = (changedValues, allValues) => {
    console.log(changedValues, allValues);
    getManageUsers(allValues);
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
                getManageUsers();
              }}
            />
          </Space>
        </Col>
      </Row>

      <br />
      <Row justify="center" gutter={[16, 16]}>
        <Form form={form} onValuesChange={onFilterChange}>
          <Space wrap>
            <Form.Item label="Organization" name="org">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="Organization"
                optionFilterProp="children"
                onChange={onChangeorg}
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={orgList}
              />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="Status"
                optionFilterProp="children"
                onChange={onChangestatus}
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={status}
              />
            </Form.Item>

            <Form.Item label="Role" name="role">
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
                options={[
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
                  {
                    value: "Administrator",
                    label: "Administrator",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item name="email">
              <Search
                placeholder="Search Email"
                allowClear
                value={selectedItems}
                onChange={setSelectedItems}
                options={filteredOptions.map((item) => ({
                  value: item._id,
                  label: item.email,
                }))}
                style={{
                  width: 200,
                }}
              />
            </Form.Item>
          </Space>
        </Form>
      </Row>

      <br />
      <Table columns={columns} dataSource={dataUsers} rowKey="_id"></Table>

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
        <Modal
          title="EditStatus"
          open={isEditingstatus}
          okText="Save"
          onCancel={() => {
            onCancelEditingBuild();
          }}
          onOk={() => {
            editForm.submit();
          }}
          okButtonProps={{ loading: isEditingLoading }}
        >
          <Form
            form={editForm}
            onFinish={onEditFinish}
            disabled={isEditingLoading}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Status" />
            </Form.Item>
          </Form>
        </Modal>
        <header className="User-list-heard">
          <Table
            columns={columnsstatus}
            dataSource={status}
            pagination={false}
            rowKey="_id"
          ></Table>
        </header>
      </Modal>
    </div>
  );
};

export default ManageUser;
