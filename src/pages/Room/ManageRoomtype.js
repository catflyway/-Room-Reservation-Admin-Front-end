import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Input, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const ManageRoomtpye = () => {
  const [dataOrg, setDataOrg] = useState([]);
  function getOrg() {
    axios.get("/org", { crossdomain: true }).then((response) => {
      console.log(response);
      setDataOrg(response.data);
    });
  }
  const [dataSource, setDataSource] = useState([]);
  function getRoomtpye(id) {
    axios.get("/org/roomtype/" + id, { crossdomain: true }).then((response) => {
      console.log(response);
      setDataSource(response.data);
    });
  }
  const [formData, setFormData] = useState({
    name: "",
    org: "",
  });
  const [idOrg, setIdorg] = useState();
  const onChangeorg = (value) => {
    console.log(`selected ${value}`);
    setFormData({ ...formData, org: value });
    setIdorg(value);
    getRoomtpye(value);
  };
  const handleSubmit = () => {
    console.log(formData);
    axios
      .post("/rooms/roomtype", formData)
      .then((res) => {
        getRoomtpye(idOrg);
      })
      .catch((err) => console.log(err));
    setIsModalOpen(false);
  };
  useEffect(() => {
    getOrg();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleOk2 = () => {
    setIsModalOpen2(false);
  };
  const [isEditingroomtype, setIsEditingroomtype] = useState(false);
  const [editingdataRoomtype, setEditingdataRoomtype] = useState(null);
  const [datastatusSource, setDatastatusSource] = useState([
    {
      id: 1,
      roomtype: "ห้องเรียน",
    },
    {
      id: 2,
      roomtype: "ห้องปฏิบัติการ",
    },
    {
      id: 3,
      roomtype: "อื่นๆ",
    },
  ]);
  const columnsEdit = [
    {
      key: "1",
      title: "Roomtype",
      dataIndex: "name",
    },
    {
      key: "2",
      title: "Actions",
      render: (record1) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditRoomtype(record1);
              }}
              style={{ color: "blue", marginLeft: 12 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteRoomtype(record1);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  const onDeleteRoomtype = (record1) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this roomtype record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDatastatusSource((pre) => {
          return pre.filter((student) => student.id !== record1.id);
        });
      },
    });
  };
  const onEditRoomtype = (record1) => {
    setIsEditingroomtype(true);
    setEditingdataRoomtype({ ...record1 });
  };
  const resetEditingroomtype = () => {
    setIsEditingroomtype(false);
    setEditingdataRoomtype(null);
  };
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAddUser = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
    const randomNumber = parseInt(Math.random() * 1000);
    const newUsers = {
      id: randomNumber,
      roomtype: "Name",
    };
    setDatastatusSource((pre) => {
      return [...pre, newUsers];
    });
  };
  return (
    <React.Fragment>
      <Button
        className="button-room"
        type="primary"
        onClick={showModal2}
        size="large"
      >
        ManageRoomtpye
      </Button>
      <div className="managestatus">
        <Modal
          title="ManageRoomtpye"
          open={isModalOpen2}
          onOk={handleOk2}
          onCancel={handleCancel2}
          footer={[]}
        >
          <div className="User-list">
            <button
              className="button-submit1"
              key="submit"
              type="primary"
              loading={loading}
              onClick={showModal}
            >
              AddRoomtype
            </button>
            <Form.Item label="หน่วยงาน">
              <Select
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
                options={dataOrg}
              />
            </Form.Item>
            <Modal
              title="AddRoomtype"
              open={isModalOpen}
              onOk={handleSubmit}
              onCancel={handleCancel}
            >
              <Input
                placeholder="AddRoomtype"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                value={formData.name}
              />
            </Modal>

            <header className="User-list-heard">
              <Table
                columns={columnsEdit}
                dataSource={dataSource}
                pagination={false}
              ></Table>
              <Modal
                title="EditRoomtype"
                open={isEditingroomtype}
                okText="Save"
                onCancel={() => {
                  resetEditingroomtype();
                }}
                onOk={() => {
                  setDatastatusSource((pre) => {
                    return pre.map((student) => {
                      if (student.id === editingdataRoomtype.id) {
                        return editingdataRoomtype;
                      } else {
                        return student;
                      }
                    });
                  });
                  resetEditingroomtype();
                }}
              >
                <Input
                  placeholder="Buildiding"
                  value={editingdataRoomtype?.roomtype}
                  onChange={(e) => {
                    setEditingdataRoomtype((pre) => {
                      return { ...pre, roomtype: e.target.value };
                    });
                  }}
                />
              </Modal>
            </header>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default ManageRoomtpye;
