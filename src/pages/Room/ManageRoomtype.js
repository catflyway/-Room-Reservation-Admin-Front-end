import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Input, Form, Select, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const ManageRoomtype = () => {
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
  function getRoomtype(id) {
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
    getRoomtype(value);
  };
  const handleSubmit = () => {
    console.log(formData);
    axios
      .post("/rooms/roomtype", formData)
      .then((res) => {
        getRoomtype(idOrg);
      })
      .catch((err) => console.log(err));
    setIsModalOpen(false);
  };
  useEffect(() => {
    getOrg();
  }, []);
  // useEffect(() => {
  //   if (isEditingroomtype) {
  //     setLoading(false);
  //     setIsModalOpen(true);
  //   }
  // }, []);
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

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAddOk = () => {
    console.log(formData);
    axios
      .post("/rooms/roomtype", formData)
      .then((res) => {
        getRoomtype(idOrg);
      })
      .catch((err) => console.log(err));
    setIsModalOpen(false);
  };
  const onAddCancel = () => {
    setIsModalOpen(false);
  };
  const [editForm] = Form.useForm();
  const [editingDatabuild, setEditingDatabuild] = useState(null);
  const [isEditingBuild, setIsEditingbuild] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const onEditRoomtype = (record) => {
    console.log("edit data", record);
    setIsEditingbuild(true);
    setEditingDatabuild(record);
    editForm.setFieldsValue(record);
  };
  const onCancelEditingBuild = () => {
    setIsEditingbuild(false);
    setEditingDatabuild(null);
  };
  const onEditFinish = (formData) => {
    console.log(formData, editingDatabuild);

    setIsEditingLoading(true);
    axios
      .put("/rooms/roomtype/" + editingDatabuild._id, formData)
      .then((res) => {
        console.log("/rooms/roomtype/", res.data);
        getRoomtype(idOrg);
        setIsEditingLoading(false);
        setIsEditingbuild(false);
      })
      .catch((err) => {
        console.log("/rooms/roomtype/", err);
        setIsEditingLoading(false);
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
        ManageRoomtype
      </Button>
      <div className="managestatus">
        <Modal
          title="ManageRoomtype"
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
              title="AddBuild"
              open={isModalOpen}
              onOk={onAddOk}
              onCancel={onAddCancel}
            >
              <Input
                placeholder="AddBuild"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                value={formData.name}
              />
            </Modal>
            {/* <Modal
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
            </Modal> */}

            <Table
              columns={columnsEdit}
              dataSource={dataSource}
              pagination={false}
              rowKey="_id"
            ></Table>
          </div>
        </Modal>

        <Modal
          title="EditRoomtype"
          open={isEditingBuild}
          okText="Save"
          onCancel={() => {
            onCancelEditingBuild();
          }}
          onOk={() => {
            editForm.submit();
          }}
          okButtonProps={{ loading: isEditingLoading }}
        >
          <Form
            form={editForm}
            onFinish={onEditFinish}
            disabled={isEditingLoading}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Buildiding" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default ManageRoomtype;
