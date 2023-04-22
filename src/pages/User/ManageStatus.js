import React, { useState, useContext, Fragment } from "react";
import {
  Modal,
  Table,
  Input,
  Form,
  Select,
  Row,
  Col,
  Space,
  Button,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../../user-context";

const ManageStatus = ({ onChange = () => {}, orgList = [] }) => {
  const user = useContext(UserContext);
  const [orgForm] = Form.useForm();
  const defaultOrg = user.canNotChangeOrg ? user.org.id : orgList[0]?._id;

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

  const [isManageStatusOpen, setManageStatusOpen] = useState(false);
  function openManageStatus() {
    setManageStatusOpen(true);
    orgForm.resetFields();
    getStatus(defaultOrg);
  }

  function onChangeStatus() {
    const orgId = orgForm.getFieldValue("org");
    onChange(orgId);
    getStatus(orgId);
  }

  /********** Add **********/
  const [AddStatusForm] = Form.useForm();
  const [isOpenAddStatus, setOpenAddStatus] = useState(false);
  const openAddStatus = () => {
    AddStatusForm.resetFields();
    setOpenAddStatus(true);
  };

  const onAddStatusFinish = (formData) => {
    const data = {
      ...formData,
      org: orgForm.getFieldValue("org"),
    };
    axios
      .post("/users/status", data)
      .then((res) => {
        onChangeStatus();
        setOpenAddStatus(false);
      })
      .catch((err) => console.log(err));
  };

  /********** Edit **********/
  const [editForm] = Form.useForm();
  const [editingDatastatus, setEditingDatastatus] = useState(null);
  const [isEditingstatus, setIsEditingstatus] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const onEditstatus = (record) => {
    setIsEditingstatus(true);
    setEditingDatastatus(record);
    editForm.setFieldsValue(record);
  };
  const onCancelEditingBuild = () => {
    setIsEditingstatus(false);
    setEditingDatastatus(null);
  };
  const onEditFinish = (formData) => {
    setIsEditingLoading(true);
    axios
      .put(`/users/status/${editingDatastatus._id}`, formData)
      .then((res) => {
        onChangeStatus();

        setIsEditingLoading(false);
        setIsEditingstatus(false);
      })
      .catch((err) => {
        console.log("/users/status/", err);
        setIsEditingLoading(false);
      });
  };

  /********** Delete **********/
  function deleteStatus(statusId) {
    axios.delete(`/users/status/${statusId}`).then((res) => {
      onChangeStatus();
    });
  }

  const onDeleteStatus = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this status record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteStatus(record._id);
      },
    });
  };

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
          <Space size={"middle"}>
            <EditOutlined
              onClick={() => onEditstatus(record)}
              style={{ color: "blue" }}
            />
            <DeleteOutlined
              onClick={() => onDeleteStatus(record)}
              style={{ color: "red" }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Button type="primary" size="large" onClick={openManageStatus}>
        ManageStatus
      </Button>

      <Modal
        title="ManageStatus"
        open={isManageStatusOpen}
        onCancel={() => setManageStatusOpen(false)}
        footer={false}
      >
        <Form form={orgForm}>
          <Form.Item name="org" label="หน่วยงาน" initialValue={defaultOrg}>
            <Select
              showSearch
              placeholder="หน่วยงาน"
              optionFilterProp="children"
              onChange={getStatus}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={orgList}
              disabled={user.canNotChangeOrg}
            />
          </Form.Item>
        </Form>

        <Row align={"end"}>
          <Col>
            <Button
              className="button-submit1"
              type="primary"
              onClick={openAddStatus}
            >
              <span>
                <PlusOutlined />
                Add Status
              </span>
            </Button>
          </Col>
        </Row>

        <br />
        <Table
          columns={columnsstatus}
          dataSource={statusList}
          pagination={false}
          rowKey="_id"
        ></Table>
      </Modal>

      <Modal
        title="Add Status"
        open={isOpenAddStatus}
        onOk={AddStatusForm.submit}
        onCancel={() => setOpenAddStatus(false)}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          form={AddStatusForm}
          onFinish={onAddStatusFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input placeholder="Statusname" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="EditStatus"
        open={isEditingstatus}
        okText="Save"
        onCancel={() => onCancelEditingBuild()}
        onOk={editForm.submit}
        okButtonProps={{ loading: isEditingLoading }}
      >
        <Form
          form={editForm}
          onFinish={onEditFinish}
          disabled={isEditingLoading}
        >
          <Form.Item name="name" rules={[{ required: true, whitespace: true }]}>
            <Input placeholder="Status" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ManageStatus;
