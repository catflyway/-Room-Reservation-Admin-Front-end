import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Input, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useForm } from "antd/es/form/Form";

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
  const onAddCancel = () => {
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

  const [formData, setFormData] = useState({
    name: "",
    org: "",
  });
  const onAddOk = () => {
    console.log(formData);
    axios
      .post("/rooms/building", formData)
      .then((res) => {
        getBuildtype(idOrg);
      })
      .catch((err) => console.log(err));
    setIsModalOpen(false);
  };
  function deleteBuild(id) {
    axios.delete("/rooms/building/" + id).then((res) => {
      getBuildtype();
    });
  }

  const [editForm] = Form.useForm();
  const [editingDatabuild, setEditingDatabuild] = useState(null);
  const [isEditingBuild, setIsEditingbuild] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const onEditBuild = (record) => {
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
      .put("/rooms/building/" + editingDatabuild._id, formData)
      .then((res) => {
        console.log("/rooms/building/", res.data);
        getBuildtype(idOrg);
        setIsEditingLoading(false);
        setIsEditingbuild(false);
      })
      .catch((err) => {
        console.log("/rooms/building/", err);
        setIsEditingLoading(false);
      });
  };

  const columnsEdit = [
    {
      key: "1",
      title: "Building",
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
                onEditBuild(record);
              }}
              style={{ color: "blue", marginLeft: 12 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteBuild(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onDeleteBuild = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this build record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteBuild(record._id);
      },
    });
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
          disabled={dataSource.length > 20 ? true : false}
          onClick={showModal}
        >
          AddBuild
        </button>
        <Modal
          title="AddBuild"
          open={isModalOpen}
          onOk={onAddOk}
          onCancel={onAddCancel}
        >
          <Input
            placeholder="AddBuild"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
          />
        </Modal>

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

        <Table
          columns={columnsEdit}
          dataSource={dataSource}
          pagination={false}
          key={(record) => record._id}
        ></Table>
      </Modal>

      <Modal
        title="EditBuilding"
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
          <Form.Item name="name" rules={[{ required: true, whitespace: true }]}>
            <Input placeholder="Buildiding" />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
export default ManageBuilding;
