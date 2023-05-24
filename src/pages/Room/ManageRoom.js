import React, { useEffect, useState, useContext } from "react";
import EditRoom from "./EditRoom";
import ManageBuilding from "./ManageBuilding";
import ManageRoomtype from "./ManageRoomtype";
import { Col, Row, Image, Button, Collapse } from "antd";

import { Modal, Table, Input, Form, Select, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../../user-context";

const { Title } = Typography;

const { Search } = Input;
const { Panel } = Collapse;

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
    filterForm.resetFields(["BuildingID", "RoomTypeID"]);
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
  const [ContributorList, setContributorList] = useState([]);
  function getsetContributorList(id) {
    axios.get("/org/roomtype/" + id).then((response) => {
      setContributorList(response.data);
    });
  }
  function getManageRooms(optionIn = {}) {
    let option = {
      ...form.getFieldsValue(),
      ...optionIn,
    }
    if (user.role === "Room Contributor") {
      option["ContributorID"] = user._id;
    } else if (user.role === "Contributor") {
      option["OrgID"] = user.org.id;
    }
    axios.get("/rooms/searchby", { params: option }).then((response) => {
      setDataSource(response.data);
    });
  }
  const [SearchroomsList, setSearchRoomsList] = useState([]);
  function getSearchRoom(id) {
    axios.get("/rooms/search/" + id).then((response) => {
      setSearchRoomsList(response.data);
    });
  }
  const canNotusebutton = ["Room Contributor"].includes(user.role);

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
  function reloadRooms() {
    getManageRooms(filterForm.getFieldsValue());
  }
  const onFilterChange = (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('Name')) return;
    if (changedValues.hasOwnProperty('Seat')) return;
    if (changedValues.hasOwnProperty('Size')) return;

    if (changedValues.hasOwnProperty("OrgID")) {
      onChangeorg(changedValues.OrgID);
      allValues.BuildingID = undefined;
      changedValues.BuildingID = undefined;
      allValues.RoomTypeID = undefined;
      changedValues.RoomTypeID = undefined;
    }
    getManageRooms(allValues);
  };

  const onClickSearch = (field) => (value, event) => {
    let formValue = {
      ...form.getFieldsValue(),
      [field]: value,
    }
    onFilterChange({}, formValue);
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
      dataIndex: ["Building", "name"],
    },
    {
      key: "4",
      title: "Roomtype",
      dataIndex: ["RoomType", "name"],
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
            {!canNotusebutton ? (
              <DeleteOutlined
                onClick={() => {
                  onDeleteRoom(record);
                }}
                style={{ color: "red", marginLeft: 12 }}
              />
            ) : null}
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


  let userObjecteOption = [
    {
      value: "พัดลม/แอร์",
      label: "พัดลม/แอร์",
    },
    {
      value: "ปลั๊กไฟ",
      label: "ปลั๊กไฟ",
    },
    {
      value: "เครื่องเสียง/ไมค์",
      label: "เครื่องเสียง/ไมค์",
    },
    {
      value: "คอมพิวเตอร์",
      label: "คอมพิวเตอร์",
    },
    {
      value: "โปรเจคเตอร์",
      label: "โปรเจคเตอร์",
    },
  ];

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
                reloadRooms()
              }}
            />
          </Space>
        </Col>
      </Row>

      <br />
      <Form form={filterForm} onValuesChange={onFilterChange} layout="horizontal" labelCol={8} >
        <Row justify="start" gutter={16}>
          <Col span={8}>
            <Form.Item label="Organization" name="OrgID" initialValue={user.canNotChangeOrg ? user.org.id : null}>
              <Select
                style={{ width: '100%' }}
                allowClear
                showSearch
                placeholder="หน่วยงาน"
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
          </Col>

          <Col span={8}>
            <Form.Item label="Building" name="BuildingID">
              <Select
                style={{ width: '100%' }}
                allowClear
                showSearch
                placeholder="อาคาร/สถานที่"
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={buildingList}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="Name">
              <Search
                placeholder="Search Room"
                allowClear
                // value={selectedItems}
                // onChange={setSelectedItems}
                // options={filteredOptions.map((item) => ({
                //   value: item._id,
                //   label: [item.Name, item.Seat],
                // }))}
                style={{ width: '100%' }}
                onSearch={onClickSearch('Name')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Collapse ghost>
          <Panel header="Advance option" key="1">
            <Row justify="start" gutter={16}>
              <Col span={8}>
                <Form.Item label="Roomtype" name="RoomTypeID">
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    placeholder="ประเภทห้อง"
                    filterOption={(input, option) =>
                      (option?.name ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    fieldNames={{ label: "name", value: "_id" }}
                    options={RoomtypeList}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Object" name="Object">
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    mode="multiple"
                    placeholder="อุปกรณ์ภายในห้อง"
                    filterOption={(input, option) =>
                      (option?.value ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={userObjecteOption}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Seat" name="Seat">
                  <Search
                    placeholder="Search Seat"
                    allowClear
                    // value={selectedItems}
                    // onChange={setSelectedItems}
                    // options={filteredOptions.map((item) => ({
                    //   value: item._id,
                    //   label: item.Seat,
                    // }))}
                    style={{ width: '100%' }}
                    onSearch={onClickSearch('Seat')}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Size" name="Size">
                  <Search
                    placeholder="Search Size"
                    allowClear
                    // value={selectedItems}
                    // onChange={setSelectedItems}
                    // options={filteredOptions.map((item) => ({
                    //   value: item._id,
                    //   label: item.Seat,
                    // }))}
                    // style={{
                    //   width: 200,
                    // }}
                    style={{ width: '100%' }}
                    onSearch={onClickSearch('Size')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </Form>
      <br />
      <Table columns={columns} dataSource={dataSource} rowKey="_id"></Table>
    </div>
  );
};

export default ManageRoom;
