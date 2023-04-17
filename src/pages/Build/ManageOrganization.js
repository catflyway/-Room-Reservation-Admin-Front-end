import React, { useState, useEffect } from "react";
import AddOrganization from "./AddOrg";
import { Button, Modal, Table, Input, Form, Row, Col, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const ManageOrganization = () => {
  const [isEditing, setIsEditing] = useState(null);
  const [editingOrg, setEditingOrg] = useState(false);

  const [OrgID, setOrgID] = useState([]);
  function getOrg() {
    axios.get("/org", { crossdomain: true }).then((response) => {
      console.log(response);
      setOrgID(
        response.data.map((item) => {
          return {
            ...item,
            member: item.userID.length,
            building: item.buildingID.length,
            room: item.roomID.length,
          };
        })
      );
    });
  }
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
      dataIndex: "building",
      align: "right",
    },
    {
      key: "3",
      title: "Room",
      dataIndex: "room",
      align: "right",
    },
    {
      key: "4",
      title: "Member",
      dataIndex: "member",
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
                onDeleteStudent(record);
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
  const onDeleteStudent = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this organization record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setOrgID((pre) => {
          return pre.filter((student) => student.id !== record.id);
        });
      },
    });
  };
  const onEditOrg = (record) => {
    setEditingOrg(true);
    setIsEditing({ ...record });
  };
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
        <Table columns={columns} dataSource={OrgID} rowKey="_id"></Table>
      </div>
    </div>
  );
};

export default ManageOrganization;
