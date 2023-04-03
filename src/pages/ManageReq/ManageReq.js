import React, { useState, useEffect } from "react";
import AddReq from "./AddReq";
import { Modal, Table, Input, Form, Select, Switch } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const ManageReq = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  function getManageReq() {
    axios.get("/Requests", { crossdomain: true }).then((response) => {
      console.log(response);
      setDataSource(response.data.map((item)=>{
        let timerev=dayjs(item.startTime[0]).format("HH:mm")+" - "+dayjs(item.endTime[0]).format("HH:mm");
        if(item.allDay==true){
          timerev="Allday"
        }
        return {
          ...item,
          startTime:dayjs(item.startTime[0]).format("DD/MM/YYYY"),
          endTime: dayjs(item.endTime[item.endTime.length-1]).format("DD/MM/YYYY"),
          timereservation:timerev
        }
      }))
    })
  }
  useEffect(() => {
    getManageReq();
  }, []);
  const columns = [
    {
      key: "1",
      title: "StartDate",
      dataIndex: "startTime",
    },
    {
      key: "2",
      title: "EndDate",
      dataIndex: "endTime",
    },
    {
      key: "3",
      title: "TimeReservation",
      dataIndex: "timereservation",
    },
    {
      key: "4",
      title: "Repeat",
      dataIndex: "repeatDate",
    },
    {
      key: "5",
      title: "Building",
      dataIndex: "Building",
    },
    {
      key: "6",
      title: "Room",
      dataIndex: "Room",
    },
    {
      key: "7",
      title: "User",
      dataIndex: "username",
    },
    {
      key: "8",
      title: "Purpose",
      dataIndex: "Purpose",
    },
    {
      key: "9",
      title: "Status",
      render: (value) => {
        return (
          <>
            <Select defaultValue="Pending" onChange={value}>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Confirmed">Confirmed</Select.Option>
              <Select.Option value="Reject">Reject</Select.Option>
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
    startTime:[],
    endTime: [],
    allDay: false,
    Purpose: "",
    repeatDate:"",
  });

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
        <div className="button-manageorganization">
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
