import { Table, Modal, Select, Button, Form } from "antd";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { UserContext } from "../../user-context";

function HistoryReq() {
  const user = useContext(UserContext);
  const [dataSource, setDataSource] = useState([]);

  const [dataOrg, setDataOrg] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      setDataOrg(response.data);
    });
  }
  const onChangeorg = (value) => {
    console.log(`selected ${value}`);
    getManageReq(value);
  };

  function getManageReq(OrgID) {
    let option = {
      Status_Approve: ["Approved", "Rejected", "Cancled"],
      // Status_Approve: "Approved",
    };
    option["OrgID"] = OrgID;
    axios.get("requests/searchby", { params: option }).then((response) => {
      setDataSource(
        response.data.map((item) => {
          let timerev =
            dayjs(item.startTime[0]).format("HH:mm") +
            " - " +
            dayjs(item.endTime[0]).format("HH:mm");
          if (item.allDay == true) {
            timerev = "Allday";
          }
          return {
            ...item,
            startTime: dayjs(item.startTime[0]),
            endTime: dayjs(item.endTime[item.endTime.length - 1]),
            timereservation: timerev,
            Building: item.Building.name,
            Room: item.Room.name,
            User: item.User.username,
          };
        })
      );
    });
  }

  // function onChangeStatus(request, status) {
  //   let data = {
  //     Status_Approve: status,
  //   };
  //   axios.put("/Requests/" + request._id, data).then((response) => {
  //     getManageReq();
  //   });
  //   console.log("Change", request, status);
  // }
  const [isAddOpen, setIsAddOpen] = useState(false);

  const canNotChangeOrg = ["Room Contributor", "Contributor"].includes(
    user.role
  );
  let initialValues = {};
  if (canNotChangeOrg) {
    initialValues["org"] = user.org.id;
  }
  const showAddReq = () => {
    setIsAddOpen(true);
    if (canNotChangeOrg) {
      onChangeorg(user.org.id);
    }
    getOrg();
  };

  const handCancelAddReq = () => {
    setIsAddOpen(false);
  };

  const columns = [
    {
      key: "startTime",
      title: "StartDate",
      dataIndex: "startTime",
      sorter: (a, b) => a.startTime - b.startTime,
      render: (value) => {
        return value.format("DD/MM/YYYY");
      },
    },
    {
      key: "2",
      title: "EndDate",
      dataIndex: "endTime",
      sorter: (a, b) => a.startTime - b.startTime,
      render: (value) => {
        return value.format("DD/MM/YYYY");
      },
    },
    {
      key: "3",
      title: "TimeReserve",
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
      dataIndex: "User",
    },
    {
      key: "8",
      title: "Purpose",
      dataIndex: "Purpose",
      width: 250,
    },
    {
      key: "9",
      title: "Status",
      dataIndex: "Status_Approve",
      width: 200,
      render: (value, record) => {
        return (
          <>
            <Select
              value={value}
              // onChange={(newValue) => onChangeStatus(record, newValue)}
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
              <Select.Option value="Cancled ">Cancled</Select.Option>
            </Select>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Button
        className="button-room"
        type="primary"
        onClick={showAddReq}
        size="large"
      >
        HistoryReservation
      </Button>
      <Modal
        width={950}
        title="HistoryReservation"
        open={isAddOpen}
        footer={false}
        onCancel={handCancelAddReq}
      >
        <Form initialValues={initialValues}>
          <Form.Item label="หน่วยงาน" name="org">
            <Select
              showSearch
              placeholder="หน่วยงาน"
              optionFilterProp="children"
              onChange={onChangeorg}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={dataOrg}
              disabled={canNotChangeOrg}
            />
          </Form.Item>
        </Form>
        <div className="User-list">
          <Table columns={columns} dataSource={dataSource} rowKey="_id"></Table>
        </div>
      </Modal>
    </>
  );
}

export default HistoryReq;
