import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from "@fullcalendar/list";
import axios from "axios";

import { Row, Col, Card, Modal, Button, Select } from "antd";

function Calendar() {
  const { Option } = Select;
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const [events, setIsevents] = useState([]);

  useEffect(() => {
    getManageCalendar();
  }, []);

  function getManageCalendar() {
    axios.get("/calendar").then((response) => {
      console.log(response);
      setIsevents(
        response.data.map((item) => {
          return {
            title: item.Room + "   " + item.Purpose,
            start: item.startTime,
            end: item.endTime,
            allDay: item.allDay /*,timeZone:'UTC'*/,
          };
        })
      );
    });
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    start: "",
    end: "",
    color: "",
  });
  const onChangeValues = (e) => {
    console.log(e.target.value);
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSelect = (info) => {
    showModal();
    console.log(info);
    setValues({
      ...values,
      start: info.startStr,
      end: info.endStr,
    });
  };
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
  return (
    <div>
      <Row justify="center">
        <Col span={24}>
          <div className="Heard-ManageCa">
            <h2>Dashboard</h2>
          </div>
          <div className="col-1">
            <button className="col-1-1">
              <h5>1</h5>
              คำขอที่ยังไม่ได้ดำเนินการ
            </button>
            <button className="col-1-1">
              <h5>1</h5>
              คำขอที่อนุมัติแล้ว
            </button>
            <button className="col-1-1">
              <h5>1</h5>
              คำขอที่สำเร็จแล้ว
            </button>
          </div>
          <div className="searchgraph">
            <div className="searchstatus">
              Organization:{" "}
              <Select placeholder="Select a Buildtype" onChange={handleChange}>
                <Option value="student">โรงพยาบาล</Option>
                <Option value="teacher">โรงเรียน</Option>
                <Option value="athlete">อื่นๆ</Option>
              </Select>
            </div>
            <div className="searchstatus">
              Building:{" "}
              <Select placeholder="Select a Buildtype" onChange={handleChange}>
                <Option value="student">โรงพยาบาล</Option>
                <Option value="teacher">โรงเรียน</Option>
                <Option value="athlete">อื่นๆ</Option>
              </Select>
            </div>
            <div className="searchstatus">
              Room:{" "}
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.includes(input)
                }
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
        </Col>
      </Row>
      <Row justify="center">
        <Col span={22}>
          <Row justify="center">
            <Col span={16} offset={2}>
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
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
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
            <Col span={5} offset={1}>
              <h2>รายละเอียดการจอง</h2>
              <FullCalendar
                  plugins={[
                    listPlugin,
                  ]}
                  initialView="listWeek"
                  headerToolbar={{
                    left: "",
                    center: "",
                    right: "",
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
