import React, { useState, useEffect } from "react";
import BarChart from "./components/BarChart";
import { Row, Col, Select, Button, Form, Space } from "antd";
import { Divider, Table } from "antd";
import axios from "axios";

import { DatePicker } from "antd";

const { RangePicker } = DatePicker;
const PickerWithType = ({ type, onChange }) => {
  if (type === "date") return <DatePicker onChange={onChange} />;
  // if (type === "none") return <RangePicker onChange={onChange} />;
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
      defaultSortOrder: "descend",
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
  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    getBuildingInOrgID(orgID);
    getRoomtype(orgID);
  };
  const onChangebuild = (buildingID) => {
    console.log(`selected ${buildingID}`);
  };
  const onChangeroomtype = (roomtypeID) => {
    console.log(`selected ${roomtypeID}`);
  };

  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      console.log(response);
      setOrgList(response.data);
    });
  }
  const [buildingList, setBuildingList] = useState([]);
  function getBuildingInOrgID(id) {
    axios.get("/org/building/" + id).then((response) => {
      console.log(response);
      setBuildingList(response.data);
    });
  }
  const [RoomtypeList, setRoomtypeList] = useState([]);
  function getRoomtype(id) {
    axios.get("/org/roomtype/" + id, { crossdomain: true }).then((response) => {
      console.log(response);
      setRoomtypeList(response.data);
    });
  }
  function getManageRooms(option) {
    let query = [];
    for (const [key, value] of Object.entries(option || {})) {
      if (value) {
        query.push(`${key}=${value}`);
      }
    }
    query = query.join("&");

    axios
      .get("/rooms/searchby?" + query, { crossdomain: true })
      .then((response) => {
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
    getManageRooms();
    getOrg();
  }, []);
  useEffect(() => {
    getManageReq();
  }, []);
  const onFilterChange = (changedValues, allValues) => {
    console.log(changedValues, allValues);
    getManageRooms(allValues);
  };

  return (
    <div className="ShowBar">
      <Row justify="center" gutter={[16, 16]}>
        <Form onValuesChange={onFilterChange}>
          <Space wrap>
            <Form.Item label="Organization" name="OrgID">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="หน่วยงาน"
                optionFilterProp="children"
                onChange={onChangeorg}
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={orgList}
              />
            </Form.Item>

            <Form.Item label="Building" name="BuildingID">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="อาคาร/สถานที่"
                optionFilterProp="children"
                onChange={onChangebuild}
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={buildingList}
              />
            </Form.Item>

            <Form.Item label="Roomtype" name="RoomTypeID">
              <Select
                style={{
                  width: "200px",
                }}
                allowClear
                showSearch
                placeholder="ประเภทห้อง"
                optionFilterProp="children"
                onChange={onChangeroomtype}
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={RoomtypeList}
              />
            </Form.Item>
          </Space>
        </Form>
      </Row>
      <div className="searchgraphdate">
        <div className="dategraph">
          <Select value={type} onChange={setType}>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
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
