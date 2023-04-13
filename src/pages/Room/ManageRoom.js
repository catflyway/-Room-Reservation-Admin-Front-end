import React, { useEffect, useState } from "react";
import EditRoom from "./EditRoom";
import ManageBuilding from "./ManageBuilding";
import ManageRoomtype from "./ManageRoomtype";
import { Col, Row, Image } from "antd";

import { Modal, Table, Input, Form, Select, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const { Search } = Input;

const ManageRoom = () => {
  const [dataSource, setDataSource] = useState([]);
  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    getBuildingInOrgID(orgID);
    getRoomtype(orgID);
  };
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
  const [RoomtypeList, setRoomtypeList] = useState([]);
  function getRoomtype(id) {
    axios.get("/org/roomtype/" + id, { crossdomain: true }).then((response) => {
      console.log(response);
      setRoomtypeList(response.data);
    });
  }
  function getManageRooms(option) {
    let query = [];
    for (const [key, value] of Object.entries(option || {})) {
      if (value) {
        query.push(`${key}=${value}`);
      }
    }
    query = query.join("&");

    axios
      .get("/rooms/searchby?" + query, { crossdomain: true })
      .then((response) => {
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
  const [SearchroomsList, setSearchRoomsList] = useState([]);
  function getSearchRoom(id) {
    axios.get("/rooms/search/" + id, { crossdomain: true }).then((response) => {
      console.log(response);
      setSearchRoomsList(response.data);
    });
  }
  useEffect(() => {
    getManageRooms();
    // getSearchRoom();
    getOrg();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingdata] = useState(null);
  const onEditRoom = (record) => {
    setIsEditing(true);
    setEditingdata({ ...record });
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = SearchroomsList.filter(
    (o) => !selectedItems.includes(o)
  );

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
  function deleteRoom(id) {
    axios.delete("/rooms/room/" + id).then((res) => {
      getManageRooms();
    });
  }
  const onDeleteRoom = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this room record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteRoom(record._id);
      },
    });
  };

  const onFilterChange = (changedValues, allValues) => {
    console.log(changedValues, allValues);
    getManageRooms(allValues);
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

            {/* ButtonManageRoomtype */}
            <ManageRoomtype />

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
        <Form onValuesChange={onFilterChange}>
          <Space wrap>
            <Form.Item label="Organization" name="OrgID">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
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
              />
            </Form.Item>

            <Form.Item label="Building" name="BuildingID">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="อาคาร/สถานที่"
                optionFilterProp="children"
                onChange={onChangebuild}
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={buildingList}
              />
            </Form.Item>

            <Form.Item label="Roomtype" name="RoomTypeID">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="ประเภทห้อง"
                optionFilterProp="children"
                onChange={onChangeroomtype}
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={RoomtypeList}
              />
            </Form.Item>

            <Form.Item name="Name">
              <Search
                placeholder="Search Room"
                allowClear
                value={selectedItems}
                onChange={setSelectedItems}
                options={filteredOptions.map((item) => ({
                  value: item._id,
                  label: item.Name,
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
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record._id}
      ></Table>
    </div>
  );
};

export default ManageRoom;
