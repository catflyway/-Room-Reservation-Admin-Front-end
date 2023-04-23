import React, { useState, useEffect, useContext, Fragment } from "react";
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
} from "antd";
import EditUser from "./EditUser";
import ManageStatus from "./ManageStatus";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../../user-context";

const { Title } = Typography;
const { Search } = Input;

const ManageUser = () => {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  /********** Get data from API **********/
  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      setOrgList(response.data);
    });
  }

  const [statusList, setStatusList] = useState([]);
  function getStatus(id) {
    if (id) {
      axios.get("/org/status/" + id).then((response) => {
        setStatusList(response.data);
      });
    } else {
      setStatusList([]);
    }
  }

  const [dataUsers, setDataUsers] = useState([]);
  function getManageUsers(option) {
    axios.get("/users/searchby", { params: option }).then((response) => {
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

  /********** Filter callback **********/
  const onChangeOrg = (value) => {
    getStatus(value);
    filterForm.resetFields(["status"]);
  };

  const onFilterChange = (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('email')) return;
    if (changedValues.hasOwnProperty("org")) {
      onChangeOrg(changedValues.org);
      allValues.status = undefined;
      changedValues.status = undefined;
    }
    getManageUsers(allValues);
  };
  const onClickSearch = (field) => (value, event) => {
    let formValue = {
      ...form.getFieldsValue(),
      [field]: value,
    }
    onFilterChange({}, formValue);
  };

  const [SearchUserList, setSearchUserList] = useState([]);
  function getSearchuser(id) {
    axios.get("/users/search/" + id).then((response) => {
      setSearchUserList(response.data);
    });
  }
  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = SearchUserList.filter(
    (o) => !selectedItems.includes(o)
  );

  function reloadUsers() {
    getManageUsers(filterForm.getFieldsValue());
  }

  function reloadStatus() {
    getStatus(filterForm.getFieldValue("org"));
  }

  /********** User table row action **********/
  function deleteUser(id) {
    axios.delete("/users/" + id).then((res) => {
      reloadUsers();
    });
  }

  const onDeleteUser = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this user record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteUser(record._id);
      },
    });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingdata] = useState(null);
  const onEditUser = (record) => {
    setIsEditing(true);
    setEditingdata({ ...record });
  };

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
            <EditOutlined onClick={() => onEditUser(record)} />
            <DeleteOutlined
              onClick={() => onDeleteUser(record)}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
      fixed: "right",
      align: "center",
    },
  ];

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
  if (!user.canNotChangeOrg) {
    userRoleOption.push({
      value: "Administrator",
      label: "Administrator",
    });
  }

  useEffect(() => {
    getOrg();
    if (user.canNotChangeOrg) {
      onChangeOrg(user.org.id);
      getManageUsers({ org: user.org.id });
    } else {
      getManageUsers();
    }
  }, []);

  return (
    <Fragment>
      <Row justify="space-between" align="middle">
        <Col>
          <Title style={{ color: " #3F478D" }}>ManageUser</Title>
        </Col>
        <Col>
          <Space wrap>
            <ManageStatus
              onChange={(orgId) => {
                if (orgId !== filterForm.getFieldValue("org")) {
                  return;
                }
                reloadStatus();
              }}
              orgList={orgList}
            />
            <EditUser
              value={editingData}
              openEdit={isEditing}
              onCancel={() => {
                setIsEditing(false);
              }}
              onSuccess={() => {
                setIsEditing(false);
                reloadUsers();
              }}
            />
          </Space>
        </Col>
      </Row>

      <br />
      <Row justify="center" gutter={[16, 16]}>
        <Form form={filterForm} onValuesChange={onFilterChange}>
          <Space wrap>
            <Form.Item
              label="Organization"
              name="org"
              initialValue={user.canNotChangeOrg ? user.org.id : null}
            >
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="Organization"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={orgList}
                disabled={user.canNotChangeOrg}
              />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                // showSearch
                placeholder="Status"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={statusList}
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
                // disabled={["Contributor"].includes(user.role)}
                options={userRoleOption}
              />
            </Form.Item>

            <Form.Item name={"email"}>
              <Search
                placeholder="Search Email"
                allowClear
                // value={selectedItems}
                // onChange={setSelectedItems}
                // options={filteredOptions.map((item) => ({
                //   value: item._id,
                //   label: [item.email, item.username],
                // }))}
                style={{
                  width: 200,
                }}
                onSearch={onClickSearch('email')}
              />
            </Form.Item>
          </Space>
        </Form>
      </Row>

      <br />
      <Table columns={columns} dataSource={dataUsers} rowKey="_id"></Table>
    </Fragment>
  );
};

export default ManageUser;
