import React, { useState, useEffect, useContext } from "react";
import AddReq from "./AddReq";
import HistoryReq from "./Historyreq";
import {
  Modal,
  Table,
  Space,
  Select,
  Row,
  Col,
  Typography,
  Button,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { UserContext } from "../../user-context";

const { Title } = Typography;
const ManageReq = () => {
  const user = useContext(UserContext);
  const [dataSource, setDataSource] = useState([]);

  function getManageReq() {
    let option = {
      Status_Approve: "Pending",
    };
    if (user.role === "Room Contributor") {
      option["ContributorID"] = user._id;
    } else if (user.role === "Contributor") {
      option["OrgID"] = user.org.id;
    }
    axios.get("/Requests/searchby", { params: option }).then((response) => {
      setDataSource(
        response.data.map((item) => {
          let timerev =
            dayjs(item.startTime[0]).format("HH:mm") +
            " - " +
            dayjs(item.endTime[0]).format("HH:mm");
          if (item.allDay === true) {
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
  useEffect(() => {
    getManageReq();
  }, []);

  function onChangeStatus(request, status) {
    let data = {
      Status_Approve: status,
    };
    axios.put("/Requests/" + request._id, data).then((response) => {
      getManageReq();
    });
    console.log("Change", request, status);
  }

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
              onChange={(newValue) => onChangeStatus(record, newValue)}
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
              {/* <Select.Option value="Cancled ">Cancled</Select.Option> */}
            </Select>
          </>
        );
      },
    },
  ];


  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Title style={{ color: " #3F478D" }}>ManageRequest</Title>
        </Col>

        <Space wrap>
          <Col>
            <HistoryReq />
          </Col>
          <Col>
            <AddReq
              onSuccess={() => {
                getManageReq();
              }}
            />
          </Col>
        </Space>
      </Row>

      <div className="User-list">
        <Table columns={columns} dataSource={dataSource} rowKey="_id"></Table>
      </div>
    </div>
  );
};

export default ManageReq;
