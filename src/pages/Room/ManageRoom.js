import React, { useEffect, useState, useContext } from "react";
import EditRoom from "./EditRoom";
import ManageBuilding from "./ManageBuilding";
import ManageRoomtype from "./ManageRoomtype";
import { Col, Row, Image } from "antd";

import { Modal, Table, Input, Form, Select, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../../user-context";

const { Title } = Typography;

const { Search } = Input;

const ManageRoom = () => {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    if (orgID) {
      getBuildingInOrgID(orgID);
      getRoomtype(orgID);
    }
    form.resetFields(["BuildingID", "RoomTypeID"]);
  };

  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      setOrgList(response.data);
    });
  }
  const [buildingList, setBuildingList] = useState([]);
  function getBuildingInOrgID(id) {
    axios.get("/org/building/" + id).then((response) => {
      setBuildingList(response.data);
    });
  }
  const [RoomtypeList, setRoomtypeList] = useState([]);
  function getRoomtype(id) {
    axios.get("/org/roomtype/" + id).then((response) => {
      setRoomtypeList(response.data);
    });
  }
  function getManageRooms(option) {
    axios.get("/rooms/searchby", { params: option }).then((response) => {
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
    axios.get("/rooms/search/" + id).then((response) => {
      setSearchRoomsList(response.data);
    });
  }

  useEffect(() => {
    getOrg();

    if (user.canNotChangeOrg) {
      onChangeorg(user.org.id);
      form.setFieldValue("OrgID", user.org.id);
      getManageRooms({ OrgID: user.org.id });
    } else {
      getManageRooms();
    }
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

  function reloadBuilding() {
    getBuildingInOrgID(filterForm.getFieldValue("Org"));
  }
  function reloadRoomtype() {
    getRoomtype(filterForm.getFieldValue("Org"));
  }
  const onFilterChange = (changedValues, allValues) => {
    if (changedValues.hasOwnProperty("OrgID")) {
      onChangeorg(changedValues.OrgID);
      allValues.BuildingID = undefined;
      changedValues.BuildingID = undefined;
      allValues.RoomTypeID = undefined;
      changedValues.RoomTypeID = undefined;
    }
    getManageRooms(allValues);
  };

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

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Title style={{ color: " #3F478D" }}>ManageRoom</Title>
        </Col>
        <Col>
          <Space wrap>
            <ManageBuilding
              onChange={(orgId) => {
                if (orgId !== filterForm.getFieldValue("Org")) {
                  return;
                }
                reloadBuilding();
              }}
              orgList={orgList}
            />

            <ManageRoomtype
              onChange={(orgId) => {
                if (orgId !== filterForm.getFieldValue("Org")) {
                  return;
                }
                reloadRoomtype();
              }}
              orgList={orgList}
            />

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
        <Form form={form} onValuesChange={onFilterChange}>
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

            <Form.Item label="Building" name="BuildingID">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="อาคาร/สถานที่"
                optionFilterProp="children"
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
                  label: [item.Name, item.Seat],
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
      <Table columns={columns} dataSource={dataSource} rowKey="_id"></Table>
    </div>
  );
};

export default ManageRoom;
