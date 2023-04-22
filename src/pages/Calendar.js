import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import dayjs from "dayjs";
import { UserContext } from "../user-context";

import { Row, Col, Modal, Select, Form, Typography, Space } from "antd";

const { Title } = Typography;

function Calendar() {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const [events, setIsevents] = useState([]);
  const eventListRef = React.createRef();

  const [OrgLoading, setOrgLoading] = useState(false);
  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    setOrgLoading(true);
    axios
      .get("/org")
      .then((response) => {
        setOrgLoading(false);
        setOrgList(response.data);
      })
      .catch((err) => {
        setOrgLoading(false);
      });
  }

  const [timeRange, setTimeRange] = useState(() => {
    let today = dayjs();
    return {
      fromTime: today.startOf("month").toISOString(),
      toTime: today.add(1, "month").startOf("month").toISOString(),
    };
  });
  const [timeRangeActive, setTimeRangeActive] = useState(() => {
    let today = dayjs();
    return {
      fromTime: today.startOf("month").startOf("week").toISOString(),
      toTime: today.endOf("month").add(1, "week").startOf("week").toISOString(),
    };
  });

  function onDatesSet(dateInfo) {
    setTimeRange({
      fromTime: dayjs(dateInfo.view.currentStart).toISOString(),
      toTime: dayjs(dateInfo.view.currentEnd).toISOString(),
    });
    setTimeRangeActive({
      fromTime: dayjs(dateInfo.view.activeStart).toISOString(),
      toTime: dayjs(dateInfo.view.activeEnd).toISOString(),
    });

    if (eventListRef.current) {
      let calendar = eventListRef.current.getApi();
      calendar.gotoDate(dateInfo.view.currentStart);
    }
  }

  useEffect(() => {
    getManageCalendar(form.getFieldsValue());
  }, [timeRange]);
  useEffect(() => {
    getStatusCount(form.getFieldsValue());
  }, [timeRangeActive]);

  const [statusCount, setStatusCount] = useState([]);
  function getStatusCount(option) {
    option = {
      OrgID: option?.Org,
      BuildingID: option?.Building,
      RoomID: option?.Room,
      ...timeRange,
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
        setBuildingList(response.data);
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
      .get(`/rooms/buildingroom/${id}`)
      .then((response) => {
        setRoomLoading(false);
        setRoomsList(response.data);
      })
      .catch((err) => {
        setRoomLoading(false);
      });
  }

  const onChangeorg = (orgID) => {
    if (orgID) {
      getBuildingInOrgID(orgID);
    }
    form.resetFields(["Building"]);
  };

  const onChangebuild = (buildingID) => {
    if (buildingID) {
      getRoomsInOrgID(buildingID);
    }
    form.resetFields(["Room"]);
  };

  function getManageCalendar(option) {
    option = { ...option, ...timeRangeActive };
    axios.get("/calendar/searchby", { params: option }).then((response) => {
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

  let initialValues = {};
  if (user.canNotChangeOrg) {
    initialValues["Org"] = user.org.id;
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    start: "",
    end: "",
    color: "",
  });

  const handleOk = () => {
    console.log(values);
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setValues({ ...values, title: "" });
    setIsModalVisible(false);
  };
  const onFilterChange = (changedValues, allValues) => {
    if (changedValues.hasOwnProperty("Org")) {
      onChangeorg(changedValues.Org);
      allValues.Building = undefined;
      changedValues.Building = undefined;
    }
    if (changedValues.hasOwnProperty("Building")) {
      onChangebuild(changedValues.Building);
      allValues.Room = undefined;
      changedValues.Room = undefined;
    }

    getManageCalendar(allValues);
    getStatusCount(allValues);
  };

  useEffect(() => {
    if (user.canNotChangeOrg) {
      onChangeorg(user.org.id);
    }
    getOrg();
    if (user.canNotChangeOrg) {
      onChangeorg(user.org.id);
      form.setFieldValue("Org", user.org.id);
      getManageCalendar({ Org: user.org.id });
      getStatusCount({ Org: user.org.id });
    } else {
      getManageCalendar();
      getStatusCount();
    }
  }, []);

  return (
    <div>
      <Row justify="center">
        <Title style={{ color: " #3F478D", fontSize: "56px", marginTop: "0" }}>
          Calendar
        </Title>
      </Row>

      <Row justify="center" gutter={[16, 16]}>
        {/* <Col>
              <Card
                bordered={false}
                bodyStyle={{ backgroundColor: "#07D064", color: "#fff" }}
              >
                <Statistic
                  title="คำขอที่ยังไม่ได้ดำเนินการ"
                  value={statusCount.Pending}
                  valueStyle={{ color: "#fff" }}
                />
              </Card>
            </Col> */}
        <Col>
          <button className="col-1-1">
            <Title style={{ color: " #FFF", fontSize: "20px" }}>
              {statusCount.Pending}
            </Title>
            <Title style={{ color: " #FFF", fontSize: "12px" }}>
              คำขอที่ยังไม่ได้ดำเนินการ
            </Title>
          </button>
        </Col>
        <Col offset={0} md={{ offset: 2 }}>
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

      <br />

      <Row justify="center" gutter={[16, 16]}>
        <Form
          onValuesChange={onFilterChange}
          form={form}
          initialValues={initialValues}
        >
          <Space wrap>
            <Form.Item name="Org" label="Organization">
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
                loading={OrgLoading}
              />
            </Form.Item>

            <Form.Item name="Building" label=" Building">
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
                loading={BuildLoading}
              />
            </Form.Item>

            <Form.Item name="Room" label=" Room">
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

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
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
              dayMaxEventRows={3}
              datesSet={onDatesSet}
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
        <Col xs={24} md={8}>
          <div
            style={{
              minHeight: "500px",
              display: "flex",
              height: "100%",
              flexFlow: "column",
            }}
          >
            <div
              style={{
                display: "contents",
              }}
            >
              <div style={{ flex: "0 1 auto" }}>
                <h2>รายละเอียดการจอง</h2>
              </div>
              <div style={{ flex: "1 1 auto" }}>
                <FullCalendar
                  plugins={[listPlugin]}
                  initialView="listMonth"
                  headerToolbar={false}
                  events={events}
                  height={"100%"}
                  ref={eventListRef}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Calendar;
