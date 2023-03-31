import React, { useState, useEffect } from "react";
import AddReq from "./AddReq";
import { Modal, Table, Input, Form, Select, Switch } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import axios from "axios";

const { Search } = Input;
const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const ManageReq = () => {
  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  function getManageReq() {
    axios.get("/Requests", { crossdomain: true }).then((response) => {
      console.log(response);
      setDataSource(response.data);
    });
  }
  useEffect(() => {
    getManageReq();
  }, []);
  const columns = [
    // {
    //   key: "1",
    //   title: "ID",
    //   dataIndex: "_id",
    // },
    {
      key: "2",
      title: "Date",
      dataIndex: "Date_Reserve",
    },
    {
      key: "3",
      title: "Building",
      dataIndex: "Building",
    },
    {
      key: "4",
      title: "Roomname",
      dataIndex: "Room",
    },
    {
      key: "5",
      title: "User",
      dataIndex: "username",
    },
    {
      key: "6",
      title: "Purpose",
      dataIndex: "Purpose",
    },
    {
      key: "7",
      title: "Status",
      render: (value) => {
        return (
          <>
            <Select defaultValue="wait" onChange={handleLeafIconChange}>
              <Select.Option value="wait">Pending</Select.Option>
              <Select.Option value="false">Confirmed</Select.Option>
              <Select.Option value="true">Deny</Select.Option>
            </Select>
          </>
        );
      },
    },
  ];
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };
  const handleLeafIconChange = (value) => {
    if (value === "custom") {
      return setShowLeafIcon(<CheckOutlined />);
    }
    if (value === "true") {
      return setShowLeafIcon(true);
    }
    return setShowLeafIcon(false);
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingUser(null);
  };

  const [isAddOpen, setIsAddOpen] = useState(false);

  const showAddReq = () => {
    setIsAddOpen(true);
  };
  const handAddReq = () => {
    setIsAddOpen(false);
  };
  const handCancelAddReq = () => {
    setIsAddOpen(false);
  };
  const [data, setData] = useState({
    Room: "",
    Building: "",
    UserID: "",
    startTime: [],
    endTime: [],
    allDay: false,
    Purpose: "",
  });
  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/Requests", data).then((response) => {
      console.log(response.data);
    });
    console.log(data);
    setIsAddOpen(false);
  };

  return (
    <div>
      <div className="Heard-ManageUser">
        <h5>ManageRequest</h5>
        <div className="button-managereq">
          <button
            className="button-user"
            type="primary"
            size={20}
            onClick={showAddReq}
          >
            AddReservation
          </button>
          <div className="managestatus">
            <Modal
              title="AddReq"
              open={isAddOpen}
              //  footer={null}
              onOk={handleSubmit}
              onCancel={handCancelAddReq}
            >
              <AddReq details={data} onChange={(value) => {
                console.log("Set data =>", value);
                setData(value);
              }} />
            </Modal>
          </div>
        </div>
      </div>
      <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columns} dataSource={dataSource}></Table>
        </header>
      </div>
    </div>
  );
};

export default ManageReq;
