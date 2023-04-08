import React, { useEffect, useRef, useState } from "react";
import AddRoom from "./AddRoom";
import ManageBuilding from "./ManageBuilding";
import ManageRoomtpye from "./ManageRoomtype";
import { Checkbox, Col, Row, Image } from "antd";

import { Modal, Table, Input, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const onChange = (checkedValues) => {
  console.log("checked = ", checkedValues);
};
const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const { Search } = Input;
const onSearch = (value) => console.log(value);

const ManageRoom = () => {
  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  function getManageRooms() {
    axios.get("/rooms/room", { crossdomain: true }).then((response) => {
      console.log(response);
      setDataSource(
        response.data.map((item) => {
          return {
            ...item,
            Building: item.Building.name,
            RoomType: item.RoomType.name,
          };
        })
      );
    });
  }
  useEffect(() => {
    getManageRooms();
  }, []);

  // function deleteRoom(id) {
  //   axios.delete("/rooms/room/" + id).then((res) => {
  //     getManageRooms();
  //   });
  // }

  const [isEditingRoom, setIsEditingroom] = useState(false);
  const [editingdataRoom, setEditingdataRoom] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      key: "2",
      title: "ImageRoom",
      render: (record) => {
        return (
          <Image
            className="imgprofilebor"
            width={60}
            height={60}
            src={record.image?.url}
          />
        );
      },
    },
    {
      key: "3",
      title: "Building",
      dataIndex: "Building",
    },
    {
      key: "4",
      title: "Roomtype",
      dataIndex: "RoomType",
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
  const onEditRoom = (record) => {
    setIsEditingroom(true);
    setEditingdataRoom({ ...record });
  };
  const resetEditingRoom = () => {
    setIsEditingroom(false);
    setEditingdataRoom(null);
  };

  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  const handleOk1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  return (
    <div>
      <div className="Heard-ManageUser">
        <h5>ManageRoom</h5>

        <div className="button-manageroom">
          <button
            className="button-room"
            type="primary"
            size={20}
            onClick={showModal1}
          >
            ManageBuilding
          </button>
          <div className="managestatus">
            <Modal
              title="ManageBuilding"
              open={isModalOpen1}
              onOk={handleOk1}
              onCancel={handleCancel1}
              footer={[]}
            >
              <ManageBuilding />
            </Modal>
          </div>

          {/* ButtonManageRoomtpye */}
          <ManageRoomtpye />

          {/* ButtonAddRoom */}
          <AddRoom onSuccess={getManageRooms} />
        </div>
      </div>
      <div className="searchroom">
        <div className="searchstatus">
          Organization:{" "}
          <Select placeholder="Select a Building" onChange={handleChange}>
            <Option value="student">ECC</Option>
            <Option value="teacher">โรงแอล</Option>
            <Option value="athlete">ห้องประชุมพันปี</Option>
          </Select>
        </div>
        <div className="searchstatus">
          Building:{" "}
          <Select placeholder="Select a Building" onChange={handleChange}>
            <Option value="student">ECC</Option>
            <Option value="teacher">โรงแอล</Option>
            <Option value="athlete">ห้องประชุมพันปี</Option>
          </Select>
        </div>
        <div className="searchstatus">
          Roomtype:{" "}
          <Select placeholder="Select a Roomtype">
            <Select.Option value="1">ห้องเรียน</Select.Option>
            <Select.Option value="2">ห้องปฏิบัติการ</Select.Option>
            <Select.Option value="3">อื่นๆ</Select.Option>
          </Select>
        </div>
        <div className="searchstatus">
          <Search
            placeholder="Search Room"
            allowClear
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
        </div>
      </div>
      <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columns} dataSource={dataSource}></Table>
          <Modal
            title="Edit Room"
            visible={isEditingRoom}
            okText="Save"
            onCancel={() => {
              resetEditingRoom();
            }}
            onOk={() => {
              setDataSource((pre) => {
                return pre.map((student) => {
                  if (student.id === editingdataRoom.id) {
                    return editingdataRoom;
                  } else {
                    return student;
                  }
                });
              });
              resetEditingRoom();
            }}
          >
            <Form
              labelCol={{
                span: 6,
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
              <Form.Item
                label="อาคาร"
                value={editingdataRoom?.building}
                onChange={(e) => {
                  setEditingdataRoom((pre) => {
                    return { ...pre, building: e.target.value };
                  });
                }}
              >
                <Select placeholder="Select a Building" defaultValue="student">
                  <Option value="student">ECC</Option>
                  <Option value="teacher">โรงแอล</Option>
                  <Option value="athlete">ห้องประชุมพันปี</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="ประเภทห้อง"
                value={editingdataRoom?.roomtype}
                onChange={(e) => {
                  setEditingdataRoom((pre) => {
                    return { ...pre, roomtype: e.target.value };
                  });
                }}
              >
                <Select placeholder="Select a Roomtype">
                  <Select.Option value="1">ห้องเรียน</Select.Option>
                  <Select.Option value="2">ห้องปฏิบัติการ</Select.Option>
                  <Select.Option value="3">อื่นๆ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="ชื่อห้อง">
                <Input
                  value={editingdataRoom?.room}
                  onChange={(e) => {
                    setEditingdataRoom((pre) => {
                      return { ...pre, room: e.target.value };
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="จำนวนที่จอง">
                <Input
                  value={editingdataRoom?.noempty}
                  onChange={(e) => {
                    setEditingdataRoom((pre) => {
                      return { ...pre, noempty: e.target.value };
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="ขนาดห้อง">
                <Input
                  value={editingdataRoom?.width}
                  onChange={(e) => {
                    setEditingdataRoom((pre) => {
                      return { ...pre, width: e.target.value };
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="อุปกรณ์ภายในห้อง">
                <Checkbox.Group
                  style={{
                    width: "100%",
                  }}
                  onChange={onChange}
                >
                  <Row>
                    <Col span={12}>
                      <Checkbox value="A">พัดลม/แอร์</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="B">ปลั๊กไฟ</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="C">เครื่องเสียง/ไมค์</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="D">คอมพิวเตอร์</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="E">โปรเจคเตอร์</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item label="รายละเอียด">
                <Input
                  value={editingdataRoom?.noempty}
                  onChange={(e) => {
                    setEditingdataRoom((pre) => {
                      return { ...pre, noempty: e.target.value };
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Contributor"
                value={editingdataRoom?.contri}
                onChange={(e) => {
                  setEditingdataRoom((pre) => {
                    return { ...pre, contri: e.target.value };
                  });
                }}
              >
                <Select
                  showSearch
                  placeholder="Search to Select"
                  defaultValue="1"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  <Option value="1">Admin1</Option>
                  <Option value="2">Admin2</Option>
                  <Option value="3">Admin3</Option>
                  <Option value="4">Admin4</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </header>
      </div>
    </div>
  );
};

export default ManageRoom;
