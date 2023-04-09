import React, { useEffect, useState } from "react";
import EditRoom from "./EditRoom";
import ManageBuilding from "./ManageBuilding";
import ManageRoomtpye from "./ManageRoomtype";
import { Col, Row, Image } from "antd";

import { Modal, Table, Input, Form, Select, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const { Search } = Input;
const onSearch = (value) => console.log(value);

const ManageRoom = ({ onSuccess }) => {
  const onChangebuild = (buildingID) => {
    console.log(`selected ${buildingID}`);
  };
  const onChangeroomtype = (roomtypeID) => {
    console.log(`selected ${roomtypeID}`);
  };

  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      console.log(response);
      setOrgList(response.data);
    });
  }
  const [buildingList, setBuildingList] = useState([]);
  function getBuildingInOrgID(id) {
    axios.get("/org/building/" + id).then((response) => {
      console.log(response);
      setBuildingList(response.data);
    });
  }
  const [roomsList, setRoomsList] = useState([]);
  function getRoomtpye(id) {
    axios.get("/org/roomtype/" + id, { crossdomain: true }).then((response) => {
      console.log(response);
      setRoomsList(response.data);
    });
  }
  const [usersList, setUsersList] = useState([]);
  function getUsersInOrgID(id) {
    axios.get("/org/user/" + id).then((response) => {
      console.log(response);
      setUsersList(response.data);
    });
  }
  function getManageRooms() {
    axios.get("/rooms/room", { crossdomain: true }).then((response) => {
      console.log(response);
      setDataSource(
        response.data.map((item) => {
          return {
            ...item,
            BuildingName: item.Building.name,
            RoomTypeName: item.RoomType.name,
          };
        })
      );
    });
  }
  useEffect(() => {
    getManageRooms();
    getOrg();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingdata] = useState(null);
  const onEditRoom = (record) => {
    setIsEditing(true);
    setEditingdata({ ...record });
  };

  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      key: "2",
      title: "ImageRoom",
      render: (record) => {
        return (
          <Image
            className="imgprofilebor"
            width={100}
            height={100}
            src={record.image?.url}
          />
        );
      },
    },
    {
      key: "3",
      title: "Building",
      dataIndex: "BuildingName",
    },
    {
      key: "4",
      title: "Roomtype",
      dataIndex: "RoomTypeName",
    },
    {
      key: "5",
      title: "Room",
      dataIndex: "Name",
    },
    {
      key: "6",
      title: "จำนวนที่นั่งในห้อง",
      dataIndex: "Seat",
    },
    {
      key: "7",
      title: "ขนาดห้อง",
      dataIndex: "Size",
    },
    {
      key: "8",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditRoom(record);
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
    },
  ];
  const onDeleteRoom = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this room record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        // deleteRoom(record._id);
      },
    });
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Title style={{ color: " #3F478D" }}>ManageRoom</Title>
        </Col>
        <Col>
          <Space wrap>
            {/* ButtonManageBuilding */}
            <ManageBuilding />

            {/* ButtonManageRoomtpye */}
            <ManageRoomtpye />

            {/* ButtonAddRoom */}
            <EditRoom
              value={editingData}
              openEdit={isEditing}
              onCancel={() => {
                setIsEditing(false);
              }}
              onSuccess={() => {
                getManageRooms();
                setIsEditing(false);
              }}
            />
          </Space>
        </Col>
      </Row>

      <br />
      <Row justify="center" gutter={[16, 16]}>
        <Space wrap>
          <Form.Item label="Organization">
            <Select placeholder="Select a Building" onChange={handleChange}>
              <Option value="student">ECC</Option>
              <Option value="teacher">โรงแอล</Option>
              <Option value="athlete">ห้องประชุมพันปี</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Building">
            <Select placeholder="Select a Building" onChange={handleChange}>
              <Option value="student">ECC</Option>
              <Option value="teacher">โรงแอล</Option>
              <Option value="athlete">ห้องประชุมพันปี</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Roomtype">
            <Select placeholder="Select a Roomtype">
              <Select.Option value="1">ห้องเรียน</Select.Option>
              <Select.Option value="2">ห้องปฏิบัติการ</Select.Option>
              <Select.Option value="3">อื่นๆ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Search
              placeholder="Search Room"
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
        dataSource={dataSource}
        rowKey={(record) => record._id}
      ></Table>
    </div>
  );
};

export default ManageRoom;
