import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Table, Input, Form, Select, message, Row } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../../user-context";

const ManageRoomtype = ({ onChange = () => {}, orgList = [] }) => {
  const user = useContext(UserContext);
  const [orgForm] = Form.useForm();
  const defaultOrg = user.canNotChangeOrg ? user.org.id : orgList[0]?._id;
  
  const [roomtypeList, setRoomtypeList] = useState([]);
  function getRoomtype(id) {
    if (id) {
      axios.get("/org/roomtype/" + id).then((response) => {
        setRoomtypeList(response.data);
      });
    } else {
      setRoomtypeList([]);
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
    getRoomtype(value);
  };

  const [isManageRoomtype, setManageRoomtype] = useState(false);
  function openManageRoomtype() {
    setManageRoomtype(true);
    orgForm.resetFields();
    getRoomtype(defaultOrg);
  }
  function onChangeRoomtype() {
    const orgId = orgForm.getFieldValue("Org");
    onChange(orgId);
    getRoomtype(orgId);
  }
   /********** Add **********/
   const [AddRoomtypeForm] = Form.useForm();
   const [isOpenAddRoomtype, setOpenAddRoomtype] = useState(false);
   const openAddRoomtype = () => {
     AddRoomtypeForm.resetFields();
     setOpenAddRoomtype(true);
   };
 
   const onAddRoomtypeFinish = (formData) => {
     const data = {
       ...formData,
       org: orgForm.getFieldValue("Org"),
     };
     axios
       .post("/rooms/roomtype", data)
       .then((res) => {
        onChangeRoomtype();
        setOpenAddRoomtype(false);
       })
       .catch((err) => console.log(err));
   };

    /********** Edit **********/
  const [editForm] = Form.useForm();
  const [editingDataroomtype, setEditingDataroomtype] = useState(null);
  const [isEditingroomtype, setIsEditingroomtype] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const onEditRoomtype = (record) => {
    setIsEditingroomtype(true);
    setEditingDataroomtype(record);
    editForm.setFieldsValue(record);
  };
  const onCancelEditingRoomtype = () => {
    setIsEditingroomtype(false);
    setEditingDataroomtype(null);
  };
  const onEditFinish = (formData) => {
    setIsEditingLoading(true);
    axios
      .put(`/rooms/roomtype/${editingDataroomtype._id}`, formData)
      .then((res) => {
        onChangeRoomtype();

        setIsEditingLoading(false);
        setIsEditingroomtype(false);
      })
      .catch((err) => {
        console.log("/rooms/roomtype/", err);
        setIsEditingLoading(false);
      });
  };

   /********** Delete **********/
   function deleteRoomtype(roomtypeId) {
    axios.delete(`/rooms/roomtype/${roomtypeId}`).then((res) => {
      onChangeRoomtype();
    });
  }

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
        deleteRoomtype(record._id);
      },
    });
  };

  return (
    <React.Fragment>
      <Button
        className="button-room"
        type="primary"
        disabled={canNotusebutton}
        onClick={openManageRoomtype}
        size="large"
      >
        ManageRoomtype
      </Button>
        <Modal
          title="ManageRoomtype"
          open={isManageRoomtype}
          onCancel={() => setManageRoomtype(false)}
          footer={false}
        >
            <Form form={orgForm}>
              <Form.Item label="หน่วยงาน" name="Org" initialValue={defaultOrg}>
                <Select
                  showSearch
                  placeholder="หน่วยงาน"
                  optionFilterProp="children"
                  onChange={getRoomtype}
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
            </Form>
            <Row align={"end"}>
            <Button
            className="button-submit1"
              type="primary"
              disabled={canNotusebutton & (roomtypeList.length > 20 === false)}
              onClick={openAddRoomtype}
            >
              AddRoomtype
            </Button>
            </Row>
            <br/>
            <Table
              columns={columnsEdit}
              dataSource={roomtypeList}
              pagination={false}
              rowKey="_id"
            ></Table>
        </Modal>
        <Modal
              title="AddRoomtype"
              open={isOpenAddRoomtype}
              onOk={AddRoomtypeForm.submit}
              onCancel={() => setOpenAddRoomtype(false)}
            >
             <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          form={AddRoomtypeForm}
          onFinish={onAddRoomtypeFinish}
        >
          <Form.Item
            label="Roomtype"
            name="name"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input placeholder="AddRoomtype" />
          </Form.Item>
        </Form>
            </Modal>

        <Modal
          title="EditRoomtype"
          open={isEditingroomtype}
          okText="Save"
          onCancel={() => onCancelEditingRoomtype()}
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
             label="Roomtype"
              name="name"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="EditRoomtype" />
            </Form.Item>
          </Form>
        </Modal>
    </React.Fragment>
  );
};
export default ManageRoomtype;
