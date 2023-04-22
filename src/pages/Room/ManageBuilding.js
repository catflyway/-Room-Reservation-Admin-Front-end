import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Table, Input, Form, Select, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../../user-context";

const ManageBuilding = ({ onChange = () => {}, orgList = [] }) => {
  const user = useContext(UserContext);
  const [orgForm] = Form.useForm();
  const defaultOrg = user.canNotChangeOrg ? user.org.id : orgList[0]?._id;

  const [buildingList, setBuildingList] = useState([]);
  function getBuildtype(id) {
    if (id) {
      axios.get("/org/building/" + id).then((response) => {
        setBuildingList(response.data);
      });
    } else {
      setBuildingList([]);
    }
  }

  const canNotusebutton = ["Room Contributor"].includes(user.role);
  let initialValues = {};
  if (user.canNotChangeOrg) {
    initialValues["Org"] = user.org.id;
  }
  useEffect(() => {
    if (user.canNotChangeOrg) {
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
  const onChangeorg = (value) => {
    getBuildtype(value);
  };

  const [isManageBuildingOpen, setManageBuildingOpen] = useState(false);
  function openManageBuilding() {
    setManageBuildingOpen(true);
    orgForm.resetFields();
    getBuildtype(defaultOrg);
  }
  function onChangeBuilding() {
    const orgId = orgForm.getFieldValue("Org");
    onChange(orgId);
    getBuildtype(orgId);
  }
  /********** Add **********/
  const [AddBuildingForm] = Form.useForm();
  const [isOpenAddBuilding, setOpenAddBuilding] = useState(false);
  const openAddBuilding = () => {
    AddBuildingForm.resetFields();
    setOpenAddBuilding(true);
  };

  const onAddBuildingFinish = (formData) => {
    const data = {
      ...formData,
      org: orgForm.getFieldValue("Org"),
    };
    axios
      .post("/rooms/building", data)
      .then((res) => {
        onChangeBuilding();
        setOpenAddBuilding(false);
      })
      .catch((err) => console.log(err));
  };

  /********** Edit **********/
  const [editForm] = Form.useForm();
  const [editingDatabuilding, setEditingDatabuilding] = useState(null);
  const [isEditingbuilding, setIsEditingbuilding] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const onEditBuilding = (record) => {
    setIsEditingbuilding(true);
    setEditingDatabuilding(record);
    editForm.setFieldsValue(record);
  };
  const onCancelEditingBuild = () => {
    setIsEditingbuilding(false);
    setEditingDatabuilding(null);
  };
  const onEditFinish = (formData) => {
    setIsEditingLoading(true);
    axios
      .put(`/rooms/building/${editingDatabuilding._id}`, formData)
      .then((res) => {
        onChangeBuilding();

        setIsEditingLoading(false);
        setIsEditingbuilding(false);
      })
      .catch((err) => {
        console.log("/rooms/building/", err);
        setIsEditingLoading(false);
      });
  };

  /********** Delete **********/
  function deleteBuild(statusId) {
    axios.delete(`/rooms/building/${statusId}`).then((res) => {
      onChangeBuilding();
    });
  }
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
                onEditBuilding(record);
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
      title: "Are you sure, you want to delete this building record?",
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
        onClick={openManageBuilding}
        size="large"
      >
        ManageBuilding
      </Button>
      <Modal
        title="ManageBuilding"
        open={isManageBuildingOpen}
        onCancel={() => setManageBuildingOpen(false)}
        footer={false}
      >
        <Form form={orgForm}>
          <Form.Item label="หน่วยงาน" name="Org" initialValue={defaultOrg}>
            <Select
              showSearch
              placeholder="หน่วยงาน"
              optionFilterProp="children"
              onChange={getBuildtype}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={dataOrg}
              disabled={user.canNotChangeOrg}
            />
          </Form.Item>
        </Form>
        <Row align={"end"}>
          <Button
            className="button-submit1"
            type="primary"
            disabled={canNotusebutton & (buildingList.length > 20 === false)}
            onClick={openAddBuilding}
          >
            AddBuild
          </Button>
        </Row>
        <br />

        <Table
          columns={columnsEdit}
          dataSource={buildingList}
          pagination={false}
          rowKey="_id"
        ></Table>
      </Modal>

      <Modal
        title="AddBuild"
        open={isOpenAddBuilding}
        onOk={AddBuildingForm.submit}
        onCancel={() => setOpenAddBuilding(false)}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          form={AddBuildingForm}
          onFinish={onAddBuildingFinish}
        >
          <Form.Item
            label="Build"
            name="name"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input placeholder="AddBuild" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="EditBuilding"
        open={isEditingbuilding}
        okText="Save"
        onCancel={() => onCancelEditingBuild()}
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
            label="Build"
            name="name"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input placeholder="Buildiding" />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
export default ManageBuilding;
