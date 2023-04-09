import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Input, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const ManageBuilding = () => {
  const [dataSource, setDataSource] = useState([]);
  function getBuildtype(id) {
    axios.get("/org/building/" + id, { crossdomain: true }).then((response) => {
      console.log(response);
      setDataSource(response.data);
    });
  }
  useEffect(() => {
    getOrg();
  }, []);
  const [dataOrg, setDataOrg] = useState([]);
  function getOrg() {
    axios.get("/org", { crossdomain: true }).then((response) => {
      console.log(response);
      setDataOrg(response.data);
    });
  }
  const [idOrg, setIdorg] = useState();
  const onChangeorg = (value) => {
    console.log(`selected ${value}`);
    setFormData({ ...formData, org: value });
    setIdorg(value);
    getBuildtype(value);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
  const [isEditingBuild, setIsEditingbuild] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    org: "",
  });
  const handleSubmit = () => {
    console.log(formData);
    axios
      .post("/rooms/building", formData)
      .then((res) => {
        getBuildtype(idOrg);
      })
      .catch((err) => console.log(err));
    setIsModalOpen(false);
  };
  const [editingDatabuild, setEditingDatabuild] = useState(null);
  const columnsEdit = [
    {
      key: "1",
      title: "Building",
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
                onEditBuild(record1);
              }}
              style={{ color: "blue", marginLeft: 12 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteBuild(record1);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  const onDeleteBuild = (record1) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this build record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((name) => name._id !== record1._id);
        });
      },
    });
  };
  const onEditBuild = (record1) => {
    setIsEditingbuild(true);
    setEditingDatabuild({ ...record1 });
  };
  const resetEditingbuild = () => {
    setIsEditingbuild(false);
    setEditingDatabuild(null);
  };
  return (
    <React.Fragment>
      <Button
        className="button-room"
        type="primary"
        onClick={showModal1}
        size="large"
      >
        ManageBuilding
      </Button>
      <Modal
        title="ManageBuilding"
        open={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel1}
        footer={[]}
      >
        <button
          className="button-submit1"
          key="submit"
          type="primary"
          loading={loading}
          disabled={dataSource.length > 20 ? true : false}
          onClick={showModal}
        >
          AddBuild
        </button>
        <Form.Item label="หน่วยงาน">
          <Select
            showSearch
            placeholder="หน่วยงาน"
            optionFilterProp="children"
            onChange={onChangeorg}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
            }
            fieldNames={{ label: "name", value: "_id" }}
            options={dataOrg}
          />
        </Form.Item>
        <Modal
          title="AddBuild"
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
        >
          <Input
            placeholder="AddBuild"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
          />
        </Modal>
        <Table
          columns={columnsEdit}
          dataSource={dataSource}
          pagination={false}
        ></Table>
      </Modal>

      <Modal
        title="EditBuilding"
        open={isEditingBuild}
        okText="Save"
        onCancel={() => {
          resetEditingbuild();
        }}
        onOk={() => {
          setDataSource((pre) => {
            return pre.map((student) => {
              if (student._id === editingDatabuild._id) {
                return editingDatabuild;
              } else {
                return student;
              }
            });
          });
          resetEditingbuild();
        }}
      >
        <Input
          placeholder="Buildiding"
          value={editingDatabuild?.name}
          onChange={(e) => {
            setEditingDatabuild((pre) => {
              return { ...pre, name: e.target.value };
            });
          }}
        />
      </Modal>
    </React.Fragment>
  );
};
export default ManageBuilding;
