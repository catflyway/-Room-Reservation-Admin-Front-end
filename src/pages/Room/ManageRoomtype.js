import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Input, Form, Select, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const ManageRoomtpye = () => {
  const [orgList, setOrgList] = useState([]);
  const [orgLoading, setOrgLoading] = useState(false);
  function getOrg() {
    setOrgLoading(true);
    axios
      .get("/org")
      .then((response) => {
        setOrgLoading(false);
        console.log(response);
        setOrgList(response.data);
      })
      .catch((err) => {
        setOrgLoading(false);
      });
  }
  // const [dataOrg, setDataOrg] = useState([]);
  // function getOrg() {
  //   axios.get("/org", { crossdomain: true }).then((response) => {
  //     console.log(response);
  //     setDataOrg(response.data);
  //   });
  // }
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
  useEffect(() => {
    if (isEditingroomtype) {
      setLoading(false);
      setIsModalOpen(true);
    }
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

  const columnsEdit = [
    {
      key: "1",
      title: "Roomtype",
      dataIndex: "name",
    },
    {
      key: "2",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditRoomtype(record);
              }}
              style={{ color: "blue", marginLeft: 12 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteRoomtype(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  const onDeleteRoomtype = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this roomtype record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        // setDatastatusSource((pre) => {
        //   return pre.filter((student) => student.id !== record1.id);
        // });
      },
    });
  };
  const [isEditingroomtype, setIsEditingroomtype] = useState(false);
  const [editingdataRoomtype, setEditingdataRoomtype] = useState(null);
  const onEditRoomtype = (record) => {
    setIsEditingroomtype(true);
    setEditingdataRoomtype({ ...record });
  };
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFormFinish = (formValue) => {
    console.log("Finish", formValue);

    // setLoading(true);

    // let req;
    // if (isEditingroomtype) {
    //   req = axios.putForm("/rooms/roomtype/" + value._id, formValue);
    // } else {
    //   req = axios.postForm("/rooms/roomtype/" + value._id, formValue);
    // }

    // req
    //   .then((response) => {
    //     console.log("res", response);
    //     setLoading(false);
    //     setIsModalOpen(false);
    //     if (typeof onSuccess === "function") {
    //       onSuccess();
    //     }
    //     if (isEditingroomtype) {
    //       message.success("แก้ไขประเภทห้องสำเร็จ");
    //     } else {
    //       message.success("เพิ่มประเภทห้องสำเร็จ");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //     setLoading(false);
    //     message.error("ERROR");
    //   });
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
                options={orgList}
              />
            </Form.Item>
            <Modal
              title="AddRoomtype"
              open={isModalOpen}
              onOk={handleSubmit}
              onCancel={handleCancel}
            >
              <Form
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 14,
                }}
                layout="horizontal"
                onFinish={onFormFinish}
                disabled={loading}
              >
                <Form.Item
                  label="หน่วยงาน"
                  name="org"
                  rules={[{ required: true, whitespace: true }]}
                >
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
                    options={orgList}
                    loading={orgLoading}
                  />
                </Form.Item>
                <Form.Item
                  label="Roomtype"
                  name="name"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="AddRoomtype" />
                </Form.Item>
              </Form>
            </Modal>

            <Table
              columns={columnsEdit}
              dataSource={dataSource}
              pagination={false}
            ></Table>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default ManageRoomtpye;
