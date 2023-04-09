import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from "@fullcalendar/list";
import axios from "axios";

import { Row, Col, Modal, Select } from "antd";

function Calendar() {
  const [events, setIsevents] = useState([]);

  function getManageCalendar() {
    axios.get("/calendar").then((response) => {
      console.log(response);
      setIsevents(
        response.data.map((item) => {
          return {
            title: item.Room + "   " + item.Purpose,
            start: item.startTime,
            end: item.endTime,
            allDay: item.allDay,
          };
        })
      );
    });
  }

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

  const [roomsList, setRoomsList] = useState([]);
  function getRoomsInOrgID(id) {
    axios.get("/rooms/buildingroom/" + id).then((response) => {
      console.log(response);
      setRoomsList(response.data);
    });
  }

  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    getBuildingInOrgID(orgID);
  };

  const onChangebuild = (buildingID) => {
    console.log(`selected ${buildingID}`);
    getRoomsInOrgID(buildingID);
  };

  useEffect(() => {
    getManageCalendar();
    getOrg();
  }, []);

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
  return (
    <div>
      <Row justify="center">
        <Col span={24}>
        <Row justify="center">
          <h5 style={{ color: " #3F478D" }}>Dashboard</h5>
          </Row>

          <Row justify="center" gutter={[16, 16]}>
            <Col>
              <button className="col-1-1">
                <h5>1</h5>
                คำขอที่ยังไม่ได้ดำเนินการ
              </button>
            </Col>

            <Col span={4} offset={2}>
              <button className="col-1-1">
                <h5>1</h5>
                คำขอที่อนุมัติแล้ว
              </button>
            </Col>

            <Col span={4} offset={2}>
              <button className="col-1-1">
                <h5>1</h5>
                คำขอที่สำเร็จแล้ว
              </button>
            </Col>
          </Row>

          <Row justify="center" gutter={[16, 16]} style={{ paddingTop: "24px" }}>
            <Col>
              Organization:{" "}
              <Select
                style={{
                  width: "200px",
                }}
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
            </Col>

            <Col>
              Building:{" "}
              <Select
                style={{
                  width: "200px",
                }}
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
            </Col>

            <Col>
              Room:{" "}
              <Select
                style={{
                  width: "200px",
                }}
                showSearch
                placeholder="ห้อง"
                optionFilterProp="children"
                // onChange={value => onChange({ ...details, Room: value })}
                filterOption={(input, option) =>
                  (option?.Name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                fieldNames={{ label: "Name", value: "_id" }}
                options={roomsList}
              />
            </Col>
          </Row>
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
            <Col span={5} offset={1}>
              <h2>รายละเอียดการจอง</h2>
              <FullCalendar
                plugins={[listPlugin]}
                initialView="listMonth"
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
