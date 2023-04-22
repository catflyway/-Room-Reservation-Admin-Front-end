import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Table, Input, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../../user-context";

const ManageBuilding = () => {
  const user = useContext(UserContext);
  const [dataSource, setDataSource] = useState([]);
  function getBuildtype(id) {
    axios.get("/org/building/" + id).then((response) => {
      setDataSource(response.data);
    });
  }
  const canNotChangeOrg = ["Room Contributor", "Contributor"].includes(
    user.role
  );
  const canNotusebutton = ["Room Contributor"].includes(user.role);
  let initialValues = {};
  if (canNotChangeOrg) {
    initialValues["Org"] = user.org.id;
  }
  useEffect(() => {
    if (canNotChangeOrg) {
      onChangeorg(user.org.id);
    }
    getOrg();
  }, []);
  const [dataOrg, setDataOrg] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
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
      getBuildtype(idOrg);
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
        disabled={canNotusebutton}
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
          // disabled={dataSource.length > 20 ? true : false}
          disabled={canNotusebutton & (dataSource.length > 20 === false)}
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

        <Form initialValues={initialValues}>
          <Form.Item label="หน่วยงาน" name="Org">
            <Select
              showSearch
              placeholder="หน่วยงาน"
              optionFilterProp="children"
              onChange={onChangeorg}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={dataOrg}
              disabled={canNotChangeOrg}
            />
          </Form.Item>
        </Form>

        <Table
          columns={columnsEdit}
          dataSource={dataSource}
          pagination={false}
          rowKey="_id"
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
