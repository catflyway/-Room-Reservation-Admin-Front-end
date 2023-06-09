import React, { useState, useEffect, useRef, useContext } from "react";
import BarChart from "./BarChart";
import { Row, Col, Select, Typography, Form, Space } from "antd";
import { Divider, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { UserContext } from "../../user-context";

import { DatePicker } from "antd";

const { Option } = Select;
const { Title } = Typography;

function ShowBar() {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const formRef = useRef(form);

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

  const [dateType, setDateType] = useState("month");

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

  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    if (orgID) {
      getBuildingInOrgID(orgID);
      getRoomtype(orgID);
    }
    form.resetFields(["BuildingID", "RoomTypeID"]);
  };

  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      console.log("/org", response.data);
      setOrgList(response.data);
    });
  }
  const [buildingList, setBuildingList] = useState([]);
  function getBuildingInOrgID(id) {
    axios.get("/org/building/" + id).then((response) => {
      console.log("/org/building/" + id, response.data);
      setBuildingList(response.data);
    });
  }
  const [RoomtypeList, setRoomtypeList] = useState([]);
  function getRoomtype(id) {
    axios.get("/org/roomtype/" + id).then((response) => {
      console.log("/org/roomtype/" + id, response.data);
      setRoomtypeList(response.data);
    });
  }

  function getManageRooms(option) {
    axios.get("/static/searchby", { params: option }).then((response) => {
      console.log("/static/searchby", option, response.data);
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

  const onFilterChange = (changedValues, allValues) => {
    console.log(changedValues, allValues);

    // if (changedValues.OrgID) {
    //   onChangeorg(changedValues.OrgID);
    //   allValues.BuildingID = undefined;
    //   changedValues.BuildingID = undefined;
    //   allValues.RoomTypeID = undefined;
    //   changedValues.RoomTypeID = undefined;
    //   // allValues = {
    //   //   ...allValues,
    //   //   BuildingID: undefined,
    //   //   RoomTypeID: undefined,
    //   // };
    //   form.resetFields(["BuildingID", "RoomTypeID"]);
    // }
    if (changedValues.hasOwnProperty("OrgID")) {
      onChangeorg(changedValues.OrgID);
      allValues.BuildingID = undefined;
      changedValues.BuildingID = undefined;
      allValues.RoomTypeID = undefined;
      changedValues.RoomTypeID = undefined;
    }
    if (changedValues.dateType) {
      setDateType(allValues.dateType);
    }

    let fillter = {
      ...allValues,
      fromTime: allValues.dateValue?.startOf(allValues.dateType).toISOString(),
      toTime: allValues.dateValue
        ?.add(1, allValues.dateType)
        .startOf(allValues.dateType)
        .toISOString(),
      dateValue: undefined,
      dateType: undefined,
    };
    console.log(fillter);
    getManageRooms(fillter);
  };

  useEffect(() => {
    if (user.canNotChangeOrg) {
      onChangeorg(user.org.id);
      form.setFieldValue("OrgID", user.org.id);
      onFilterChange({ OrgID: user.org.id }, formRef.current.getFieldValue());
    } else {
      onFilterChange({}, formRef.current.getFieldValue());
    }
    getOrg();
  }, []);

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Title style={{ color: " #3F478D" }}>Statistics</Title>
        </Col>
      </Row>
      <Form form={form} onValuesChange={onFilterChange}>
        <Row justify="center" gutter={[16, 16]}>
          <Col>
            <Form.Item label="Organization" name="OrgID">
              <Select
                style={{
                  width: "200px",
                }}
                showSearch
                allowClear
                placeholder="หน่วยงาน"
                optionFilterProp="children"
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
          </Col>

          <Col>
            <Form.Item label="Building" name="BuildingID">
              <Select
                style={{
                  width: "200px",
                }}
                showSearch
                allowClear
                placeholder="อาคาร/สถานที่"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={buildingList}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item label="Roomtype" name="RoomTypeID">
              <Select
                style={{
                  width: "200px",
                }}
                showSearch
                allowClear
                placeholder="ประเภทห้อง"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "name", value: "_id" }}
                options={RoomtypeList}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[16, 16]}>
          <Col>
            <Space>
              <Form.Item name="dateType" initialValue={dateType}>
                <Select>
                  <Option value="week">Week</Option>
                  <Option value="month">Month</Option>
                </Select>
              </Form.Item>
              <Form.Item name="dateValue" initialValue={dayjs()}>
                <DatePicker picker={dateType} allowClear={false} />
              </Form.Item>
            </Space>
          </Col>
        </Row>
      </Form>

      <br />
      <Row justify="center" gutter={[16, 16]} wrap={true}>
        <Col span={24} md={{ span: 16 }}>
          {/* <h1>สถิติการใช้งานห้อง</h1> */}
          <BarChart chartData={userData} />
        </Col>

        <Col span={24} md={{ span: 8 }}>
          <h1>รายละเอียด</h1>
          <Divider orientation="left">Top 10</Divider>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowKey="_id"
          />
        </Col>
      </Row>
    </div>
  );
}

export default ShowBar;
