import React, { useState, useEffect } from "react";
import BarChart from "./components/BarChart";
import { UserData } from "./Data";
import { Row, Col, Select, Button } from "antd";
import { Divider, Table } from "antd";
import axios from "axios";

import { DatePicker, Space, TimePicker } from "antd";

const { RangePicker } = DatePicker;
const PickerWithType = ({ type, onChange }) => {
  if (type === "date") return <DatePicker onChange={onChange} />;
  if (type === "none") return <RangePicker onChange={onChange} />;
  return <DatePicker picker={type} onChange={onChange} />;
};

const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};

function ShowBar() {
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "จำนวนการจอง",
      dataIndex: "useCount",
      key: "useCount",
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.useCount - b.useCount,
    },
    {
      title: "Roomname",
      dataIndex: "Name",
      key: "Name",
    },
  ];

  const [type, setType] = useState("month");
  const [userData, setuserData] = useState({
    labels: dataSource.map((data) => data.Name),
    datasets: [
      {
        data: dataSource.map((data) => data.useCount),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
      },
    ],
  });
  function getManageReq() {
    axios.get("/static").then((response) => {
      console.log(response);
      setDataSource(response.data);
      setuserData({
        labels: response.data.map((data) => data.Name),
        datasets: [
          {
            data: response.data.map((data) => data.useCount),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
          },
        ],
      });
    });
  }
  useEffect(() => {
    getManageReq();
  }, []);
  return (
    <div className="ShowBar">
      <div className="searchgraph">
        <div className="searchstatus">
          Buildtype:{" "}
          <Select placeholder="Select a Buildtype" onChange={handleChange}>
            <Option value="student">โรงพยาบาล</Option>
            <Option value="teacher">โรงเรียน</Option>
            <Option value="athlete">อื่นๆ</Option>
          </Select>
        </div>
        <div className="searchstatus">
          Building:{" "}
          <Select
            showSearch
            style={{
              width: 200,
            }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value="1">โรงพยาบาลA</Option>
            <Option value="2">โรงเรียนA</Option>
            <Option value="3">โรงเรียนB</Option>
            <Option value="4">ตึกB</Option>
          </Select>
        </div>
      </div>
      <div className="searchgraphdate">
        <div className="dategraph">
          <Select value={type} onChange={setType}>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
            <Option value="none">Custom</Option>
          </Select>
          <PickerWithType
            type={type}
            onChange={(value) => console.log(value)}
          />
        </div>
        <Button>แสดง</Button>
      </div>

      <Row justify="center">
        <Col span={20}>
          <Row justify="center">
            <Col span={20}>
              <div>
                <label>
                  <h1>สถิติการใช้งานห้อง</h1>
                  <div style={{ width: 700 }}>
                    <BarChart chartData={userData} />
                  </div>
                </label>
              </div>
            </Col>
          </Row>
        </Col>

        <Col span={4}>
          <h1>รายละเอียด</h1>
          <Divider orientation="left">Top 10</Divider>
          <Table columns={columns} dataSource={dataSource} pagination={false} />
          ;
        </Col>
      </Row>
    </div>
  );
}

export default ShowBar;
