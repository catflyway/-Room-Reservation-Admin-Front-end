import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import dayjs from "dayjs";
import { UserContext } from "../user-context";

import { Row, Col, Modal, Select, Form, Typography, Button, Space } from "antd";

const { Title } = Typography;

function Calendar() {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const [events, setIsevents] = useState([]);

  const [OrgLoading, setOrgLoading] = useState(false);
  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    setOrgLoading(true);
    axios
      .get("/org")
      .then((response) => {
        setOrgLoading(false);
        console.log(response);
        setOrgList(response.data);
      })
      .catch((err) => {
        setOrgLoading(false);
      });
  }
  const [statusCount, setStatusCount] = useState([]);
  function getStatusCount(option) {
    option = option || {};
    let today = dayjs();
    option = {
      ...option,
      fromTime: today.startOf("month").toISOString(),
      toTime: today.add(1, "month").startOf("month").toISOString(),
    };
    if (user.role === "Room Contributor") {
      option["ContributorID"] = user._id;
    } else if (user.role === "Contributor") {
      option["OrgID"] = user.org.id;
    }

    axios.get("/Requests/stat", { params: option }).then((response) => {
      setStatusCount(response.data);
    });
  }

  const [BuildLoading, setBuildLoading] = useState(false);
  const [buildingList, setBuildingList] = useState([]);
  function getBuildingInOrgID(id) {
    setBuildLoading(true);
    axios
      .get("/org/building/" + id)
      .then((response) => {
        setBuildLoading(false);
        console.log(response);
        setBuildingList(
          response.data.map((item) => {
            return {
              ...item,
              buildingname: item.name,
            };
          })
        );
        form.resetFields(["buildingname"]);
        form.resetFields(["Room"]);
      })
      .catch((err) => {
        setBuildLoading(false);
      });
  }

  const [RoomLoading, setRoomLoading] = useState(false);
  const [roomsList, setRoomsList] = useState([]);
  function getRoomsInOrgID(id) {
    setRoomLoading(true);
    axios
      .get("/rooms/buildingroom/" + id)
      .then((response) => {
        setRoomLoading(false);
        console.log(response);
        setRoomsList(response.data);
        form.resetFields(["Room"]);
      })
      .catch((err) => {
        setRoomLoading(false);
      });
  }

  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    if (orgID) {
      getBuildingInOrgID(orgID);
    }
    form.resetFields(["Building"]);
  };

  const onChangebuild = (buildingID) => {
    console.log(`selected ${buildingID}`);
    if (buildingID) {
      getRoomsInOrgID(buildingID);
    }
    form.resetFields(["Room"]);
  };

  function getManageCalendar(option) {
    axios.get("/calendar/searchby", { params: option }).then((response) => {
      console.log(response);
      setIsevents(
        response.data.map((item) => {
          return {
            title: item.Room.name + "   " + item.Purpose,
            start: item.startTime,
            end: item.endTime,
            allDay: item.allDay,
          };
        })
      );
    });
  }
  const canNotChangeOrg = ["Room Contributor", "Contributor"].includes(
    user.role
  );
  let initialValues = {};
  if (canNotChangeOrg) {
    initialValues["Org"] = user.org.id;
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    start: "",
    end: "",
    color: "",
  });
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    console.log(values);
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setValues({ ...values, title: "" });
    setIsModalVisible(false);
  };
  const onFilterChange = (changedValues, allValues) => {
    console.log(changedValues, allValues);
    getManageCalendar(allValues);
    getStatusCount({
      OrgID: allValues.Org,
      BuildingID: allValues.Building,
      RoomID: allValues.Room,
    });
  };
  useEffect(() => {
    if (canNotChangeOrg) {
      onChangeorg(user.org.id);
    }
    getOrg();
    if (canNotChangeOrg) {
      onChangeorg(user.org.id);
      form.setFieldValue("Org", user.org.id);
      getManageCalendar({ Org: user.org.id });
      getStatusCount({ OrgID: user.org.id });
    } else {
      getManageCalendar();
    }
    getStatusCount();
  }, []);
  return (
    <div>
      <Row justify="center">
        <Col span={24}>
          <Row justify="center">
            <Title style={{ color: " #3F478D", fontSize: "56px" }}>
              Dashboard
            </Title>
          </Row>

          <Row justify="center" gutter={[16, 16]}>
            <Col span={4} offset={2}>
              <button className="col-1-1">
                <Title style={{ color: " #FFF", fontSize: "20px" }}>
                  {statusCount.Pending}
                </Title>
                <Title style={{ color: " #FFF", fontSize: "12px" }}>
                  คำขอที่ยังไม่ได้ดำเนินการ
                </Title>
              </button>
            </Col>
            <Col span={4} offset={2}>
              <button className="col-1-1">
                <Title style={{ color: " #FFF", fontSize: "20px" }}>
                  {statusCount.Approved}
                </Title>
                <Title style={{ color: " #FFF", fontSize: "12px" }}>
                  คำขอที่อนุมัติแล้ว
                </Title>
              </button>
            </Col>
          </Row>

          <Row
            justify="center"
            gutter={[16, 16]}
            style={{ paddingTop: "24px" }}
          >
            <Form
              onValuesChange={onFilterChange}
              form={form}
              initialValues={initialValues}
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 19,
              }}
            >
              {" "}
              <Space wrap>
                <Form.Item
                  name="Org"
                  // rules={[{ required: true }]}
                  label="Organization: "
                >
                  <Select
                    style={{
                      width: "200px",
                    }}
                    showSearch
                    allowClear
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
                    loadin={OrgLoading}
                  />
                </Form.Item>

                <Form.Item
                  name="Building"
                  // rules={[{ required: true }]}
                  label=" Building: "
                >
                  <Select
                    style={{
                      width: "200px",
                    }}
                    showSearch
                    allowClear
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
                    loadin={BuildLoading}
                  />
                </Form.Item>

                <Form.Item
                  name="Room"
                  // rules={[{ required: true }]}
                  label=" Room: "
                >
                  <Select
                    style={{
                      width: "200px",
                    }}
                    showSearch
                    allowClear
                    placeholder="ห้อง"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.Name ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    fieldNames={{ label: "Name", value: "_id" }}
                    options={roomsList}
                    loading={RoomLoading}
                  />
                </Form.Item>
              </Space>
            </Form>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={22}>
          <Row justify="center">
            <Col span={16}>
              <div>
                <label>
                  <h2>ตารางการใช้งานห้อง</h2>
                </label>
                <FullCalendar
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                  ]}
                  headerToolbar={{
                    left: "prevYear,nextYear prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                  }}
                  events={events}
                  // selectable={true}
                  // select={handleSelect}
                />
                <Modal
                  title="ทำการจอง"
                  open={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                ></Modal>
              </div>
            </Col>
            <Col span={6} offset={1}>
              <h2>รายละเอียดการจอง</h2>
              <FullCalendar
                plugins={[listPlugin]}
                initialView="listMonth"
                headerToolbar={{
                  left: "prev,next",
                  center: "",
                  right: "title",
                }}
                events={events}
                height={"80%"}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Calendar;
