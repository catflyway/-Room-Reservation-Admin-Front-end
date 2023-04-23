import React, { useState, useEffect } from "react";
import AddOrganization from "./AddOrg";
import { Button, Modal, Table, Input, Form, Row, Col, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const ManageOrganization = () => {
  const [isEditing, setIsEditing] = useState(null);
  const [editingOrg, setEditingOrg] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [OrgID, setOrgID] = useState([]);
  function getOrg() {
    setLoading(true);
    axios.get("/org/stat").then((response) => {
      setOrgID(response.data);
      setLoading(false);
    });
  }

  function deleteRoom(id) {
    axios.delete(`/org/${id}`).then((res) => {
      getOrg();
    });
  }

  const onEditOrg = (record) => {
    setEditingOrg(true);
    setIsEditing({ ...record });
  };

  const onDeleteRoom = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this organization record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteRoom(record._id);
      },
    });
  };

  useEffect(() => {
    getOrg();
  }, []);

  const columns = [
    {
      key: "1",
      title: "Organization Name",
      dataIndex: "name",
    },
    {
      key: "2",
      title: "Building",
      dataIndex: "buildings",
      align: "right",
    },
    {
      key: "3",
      title: "Room",
      dataIndex: "rooms",
      align: "right",
    },
    {
      key: "4",
      title: "Member",
      dataIndex: "users",
      align: "right",
    },
    {
      key: "5",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditOrg(record);
              }}
              style={{ color: "blue", marginLeft: 12 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteRoom(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
      fixed: "left",
      align: "center",
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Title style={{ color: " #3F478D" }}>ManageOrganization</Title>
        </Col>

        <Col>
          <AddOrganization
            value={isEditing}
            openEdit={editingOrg}
            onCancel={() => {
              setEditingOrg(false);
            }}
            onSuccess={() => {
              getOrg();
              setEditingOrg(false);
            }}
          />
        </Col>
      </Row>

      <div className="User-list">
        <Table columns={columns} dataSource={OrgID} rowKey="_id" loading={isLoading}></Table>
      </div>
    </div>
  );
};

export default ManageOrganization;
