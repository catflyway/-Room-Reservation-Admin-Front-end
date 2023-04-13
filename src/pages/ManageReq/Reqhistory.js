import React, { useState, useEffect } from "react";
import {
  Tabs,
  Col,
  Row,
  List,
  Form,
  Select,
  Typography,
  Table,
  Modal,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const onChange = (key) => {
  console.log(key);
};

function ReqHistory() {
  const columnshistoryPending = [
    {
      title: "StartTime",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "EndTime",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "AllDay",
      dataIndex: "timereservation",
      key: "timereservation",
    },
    {
      title: "Repeat",
      dataIndex: "repeatDate",
      key: "repeatDate",
    },
    {
      title: "Building",
      dataIndex: "buildingname",
      key: "buildingname",
    },
    {
      title: "Room",
      dataIndex: "roomname",
      key: "roomname",
    },
    {
      title: "Purpose",
      dataIndex: "Purpose",
      key: "Purpose",
    },
    {
      key: "Actions",
      title: "Actions",
      render: (record) => {
        return (
          <DeleteOutlined
            onClick={() => {
              onDelete(record);
            }}
            style={{ color: "red", marginLeft: 12 }}
          />
        );
      },
    },
  ];

  const onDelete = () => {
    Modal.confirm({
      title: "Are you sure, you want to delete this organization record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        return "Cancled";
      },
    });
  };

  const [historyPending, sethistoryPending] = useState([]);
  function gethistoryPending(id) {
    axios
      .get("requests/searchby?Status_Approve=Pending&Org=" + id)
      .then((response) => {
        console.log(response);
        sethistoryPending(
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
              startTime: dayjs(item.startTime[0]).format("DD/MM/YYYY"),
              endTime: dayjs(item.endTime[item.endTime.length - 1]).format(
                "DD/MM/YYYY"
              ),
              timereservation: timerev,
              buildingname: item.Building.name,
              roomname: item.Room.name,
            };
          })
        );
      });
  }
  const [historyAppored, sethistoryAppored] = useState([]);
  function gethistoryAppored(id) {
    axios
      .get("requests/searchby?Status_Approve=Approved&Org=" + id)
      .then((response) => {
        console.log(response);
        sethistoryAppored(
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
              startTime: dayjs(item.startTime[0]).format("DD/MM/YYYY"),
              endTime: dayjs(item.endTime[item.endTime.length - 1]).format(
                "DD/MM/YYYY"
              ),
              timereservation: timerev,
              buildingname: item.Building.name,
              roomname: item.Room.name,
            };
          })
        );
      });
  }
  const [historyRejectOrCancel, sethistoryRejectOrCancel] = useState([]);
  function gethistoryRejectOrCancel(id) {
    axios
      .get(
        "requests/searchby?Status_Approve=Cancled&Status_Approve=Rejected&Org=" +
          id
      )
      .then((response) => {
        console.log(response);
        sethistoryRejectOrCancel(
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
              startTime: dayjs(item.startTime[0]).format("DD/MM/YYYY"),
              endTime: dayjs(item.endTime[item.endTime.length - 1]).format(
                "DD/MM/YYYY"
              ),
              timereservation: timerev,
              buildingname: item.Building.name,
              roomname: item.Room.name,
            };
          })
        );
      });
  }
  const [history, sethistory] = useState([]);
  function gethistory() {
    axios.get("requests/searchby?").then((response) => {
      console.log(response);
      sethistory(
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
            startTime: dayjs(item.startTime[0]).format("DD/MM/YYYY"),
            endTime: dayjs(item.endTime[item.endTime.length - 1]).format(
              "DD/MM/YYYY"
            ),
            timereservation: timerev,
            buildingname: item.Building.name,
            roomname: item.Room.name,
          };
        })
      );
    });
  }

  const [dataOrg, setDataOrg] = useState([]);
  function getOrg() {
    axios.get("/org", { crossdomain: true }).then((response) => {
      console.log(response);
      setDataOrg(response.data);
    });
  }
  const onChangeorg = (value) => {
    console.log(`selected ${value}`);
    gethistoryPending(value);
    gethistoryAppored(value);
    gethistoryRejectOrCancel(value);
  };
  useEffect(() => {
    getOrg();
    gethistory();
    // gethistoryPending();
    // gethistoryAppored();
    // gethistoryRejectOrCancel();
  }, []);

  const items = [
    {
      key: "1",
      label: `กำลังดำเนินการ`,
      children: (
        <Table
          dataSource={historyPending}
          columns={columnshistoryPending}
          pagination={null}
        />
      ),
    },
    {
      key: "2",
      label: `คำขอที่ได้รับการอนุญาต`,
      children: (
        <Table
          dataSource={historyAppored}
          columns={columnshistoryPending}
          pagination={null}
        />
      ),
    },
    {
      key: "3",
      label: `คำขอที่ได้รับการปฏิเสธ/ยกเลิก`,
      children: (
        <Table
          dataSource={historyRejectOrCancel}
          columns={columnshistoryPending}
          pagination={null}
        />
      ),
    },
  ];
  return (
    <div className="App-history">
      <div className="User-list">
        <Form.Item label="หน่วยงาน">
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
          />
        </Form.Item>
        <Row justify="center">
          <Tabs
            style={{ alignItems: "center" }}
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            size="large"
          />
        </Row>
      </div>
    </div>
  );
}

export default ReqHistory;
