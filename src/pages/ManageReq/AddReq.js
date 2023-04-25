import {
  Form,
  Input,
  DatePicker,
  message,
  Radio,
  Checkbox,
  TimePicker,
  Select,
  Segmented,
  Button,
  Modal,
} from "antd";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { UserContext } from "../../user-context";

const { RangePicker } = DatePicker;
function AddReq({ onSuccess }) {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showAddReq = () => {
    setIsAddOpen(true);
    setLoading(false);
    form.resetFields();
  };

  const handCancelAddReq = () => {
    setIsAddOpen(false);
  };

  const [orgList, setOrgList] = useState([]);
  const [orgLoading, setOrgLoading] = useState(false);
  function getOrg() {
    setOrgLoading(true);
    axios
      .get("/org")
      .then((response) => {
        setOrgLoading(false);
        setOrgList(response.data);
      })
      .catch(() => {
        setOrgLoading(false);
      });
  }

  const [buildingList, setBuildingList] = useState([]);
  const [buildingLoading, setBuildingLoading] = useState(false);
  function getBuildingInOrgID(id) {
    form.resetFields(["Building", "Room"]);
    setBuildingLoading(true);
    axios
      .get("/org/building/" + id)
      .then((response) => {
        setBuildingLoading(false);
        setBuildingList(response.data);
      })
      .catch(() => {
        setBuildingLoading(false);
      });
  }

  const [roomsList, setRoomsList] = useState([]);
  const [roomLoading, setRoomLoading] = useState(false);
  function getRoomsInBuildingID(id) {
    form.resetFields(["Room"]);
    setRoomLoading(true);
    axios
      .get("/rooms/buildingroom/" + id)
      .then((response) => {
        setRoomLoading(false);
        setRoomsList(response.data);
      })
      .catch(() => {
        setRoomLoading(false);
      });
  }

  const [usersList, setUsersList] = useState([]);
  function getUsersInOrgID(id) {
    let option = {
      role: ["Room Contributor", "User"],
      org: id,
    };
    axios.get("/users/searchby", { params: option }).then((response) => {
      console.log("usersList", response.data);
      setUsersList(response.data);
      form.resetFields(["Contributor"]);
    });
  }

  const onChangeorg = (orgID) => {
    getBuildingInOrgID(orgID);
    getUsersInOrgID(orgID);
  };
  const onChangebuild = (buildingID) => {
    getRoomsInBuildingID(buildingID);
  };

  const [dateRangeDisable, setDateRangeDisable] = useState([false, true]);

  const dateRange = Form.useWatch("dateRange", form);
  const repeatDate = Form.useWatch("repeatDate", form);
  React.useEffect(() => {
    if (!dateRange) return;
    if (repeatDate === "norepeat") {
      setDateRangeDisable([false, true]);
      form.setFieldValue("dateRange", [dateRange[0], null]);
    } else {
      setDateRangeDisable([false, false]);
      if (!dateRange[1]) {
        form.setFieldValue("dateRange", [dateRange[0], dateRange[0]]);
      }
    }
  }, [repeatDate]);


  const handleSubmit = (value) => {
    let timeRange = [0, 24 * 60];

    if (!value.allDay) {
      let startDiff = value.timeRange[0]?.clone().diff(
        value.timeRange[0].clone().startOf("day"),
        "minute"
      );
      let stopDiff = value.timeRange[1]?.clone().diff(
        value.timeRange[1].clone().startOf("day"),
        "minute"
      );
      timeRange = [startDiff, stopDiff];
    }

    const startDate = value.dateRange[0].clone().startOf("day");
    const endDate = value.dateRange[1].clone().add(1, "day").startOf("day");

    let getTimeRange = (day) => {
      let start = [
        day.clone().add(timeRange[0], "minute").format("YYYY-MM-DDTHH:mm:ssZ"),
      ];
      let end = [
        day.clone().add(timeRange[1], "minute").format("YYYY-MM-DDTHH:mm:ssZ"),
      ];
      return [start, end];
    };

    let getTimeRangeInterval = (interval) => {
      let startTime = [];
      let endTime = [];
      let iDate = startDate.clone();
      while (iDate < endDate) {
        let range = getTimeRange(iDate);
        startTime.push(range[0]);
        endTime.push(range[1]);
        iDate = iDate.add(interval, "day");
      }

      return [startTime, endTime];
    };

    let startTime = [];
    let endTime = [];

    if (startDate && value.repeatDate === "norepeat") {
      let range = getTimeRange(startDate);
      startTime = [range[0]];
      endTime = [range[1]];
    } else if (startDate && endDate && value.repeatDate === "days") {
      [startTime, endTime] = getTimeRangeInterval(1);
    } else if (startDate && endDate && value.repeatDate === "weeks") {
      [startTime, endTime] = getTimeRangeInterval(7);
    }

    value = {
      ...value,
      startTime,
      endTime,
      // dateRange: undefined,
      // timeRange: undefined,
      OrgID: undefined,
      Building: undefined,
    };

    setLoading(true);
    axios
      .post("/Requests", value)
      .then((response) => {
        setIsAddOpen(false);
        setLoading(false);
        form.resetFields();
        if (typeof onSuccess === "function") {
          onSuccess();
        }
        message.success("เพิ่มคำขอสำเร็จ");
      })
      .catch((err) => {
        setLoading(false);
      });
    console.log("req", value)
  };

  const datOfWeekString = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  let initialValues = {};
  if (user.canNotChangeOrg) {
    initialValues["OrgID"] = user.org.id;
  }
  useEffect(() => {
    if (user.canNotChangeOrg) {
      onChangeorg(user.org.id);
    }
    getOrg();
  }, []);

  return (
    <>
      <Button
        className="button-user"
        type="primary"
        size="large"
        onClick={showAddReq}
      >
        AddReservation
      </Button>
      <Modal
        title="AddReq"
        open={isAddOpen}
        //  footer={null}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={handCancelAddReq}
      >
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          onFinish={handleSubmit}
          initialValues={initialValues}
          disabled={loading}
        >
          <Form.Item
            label="หน่วยงาน"
            name="OrgID"
            rules={[
              {
                required: true,
                message: "Please input your Organization!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="หน่วยงาน"
              optionFilterProp="children"
              onChange={onChangeorg}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={orgList}
              disabled={user.canNotChangeOrg || orgLoading}
              loading={orgLoading}
            />
          </Form.Item>
          <Form.Item
            label="อาคาร/สถานที่"
            name="Building"
            rules={[
              {
                required: true,
                message: "Please input your Building!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="อาคาร/สถานที่"
              optionFilterProp="children"
              onChange={onChangebuild}
              filterOption={(input, option) =>
                (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "name", value: "_id" }}
              options={buildingList}
              disabled={buildingLoading}
              loading={buildingLoading}
            />
          </Form.Item>
          <Form.Item
            label="ห้อง"
            name="Room"
            rules={[
              {
                required: true,
                message: "Please input your Room!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="ห้อง"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.Name ?? "").toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: "Name", value: "_id" }}
              options={roomsList}
              disabled={roomLoading}
              loading={roomLoading}
            />
          </Form.Item>
          <Form.Item
            label="วันจอง"
            name="dateRange"
            initialValue={[dayjs().add(1, "day").startOf("day"), null]}
            rules={[
              {
                required: true,
                message: "Please input your StartDate!",
              },
            ]}
          >
            <RangePicker
              allowClear={false}
              placeholder={[
                "เริ่ม",
                dateRangeDisable[1]
                  ? dateRange?.[0]?.format("YYYY-MM-DD")
                  : "สิ้นสุด",
              ]}
              defaultPickerValue={[dayjs(), null]}
              disabledDate={(value) => value && value < dayjs().endOf("day")}
              disabled={dateRangeDisable}
              allowEmpty={dateRangeDisable}
              cellRender={(current) => {
                const style = {};
                if (
                  repeatDate === "weeks" &&
                  current.day() === dateRange?.[0]?.day() &&
                  current >= dateRange?.[0]?.startOf("day") &&
                  current <= dateRange?.[1]?.endOf("day")
                ) {
                  style.border = "1px solid #1890ff";
                  style.borderRadius = "50%";
                }
                return (
                  <div className="ant-picker-cell-inner" style={style}>
                    {current.date()}
                  </div>
                );
              }}
            />
          </Form.Item>
          <Form.Item
            label="การเกิดซ้ำ"
            name="repeatDate"
            initialValue="norepeat"
          >
            <Radio.Group>
              <Radio.Button value="norepeat">Does not repeat</Radio.Button>
              <Radio.Button value="days">everyday</Radio.Button>
              <Radio.Button value="weeks">everyweek</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {repeatDate === "weeks" ? (
            <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
              <Segmented
                size="large"
                options={datOfWeekString}
                value={datOfWeekString[dateRange?.[0]?.day()]}
                disabled
              />
            </Form.Item>
          ) : null}
          <Form.Item
            label="เวลาการจอง"
            name="allDay"
            valuePropName="checked"
            initialValue={true}
            style={{ marginBottom: "0" }}
          >
            <Checkbox name="TimeRange">Allday</Checkbox>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.allDay !== currentValues.allDay
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("allDay") !== true ? (
                <Form.Item
                  name="timeRange"
                  rules={[
                    {
                      required: true,
                      message: "Please input your reservation timing!",
                    },
                  ]}
                  wrapperCol={{ span: 18, offset: 6 }}
                >
                  <TimePicker.RangePicker format="HH:mm" />
                </Form.Item>
              ) : (
                <div style={{ height: "24px" }}></div>
              )
            }
          </Form.Item>
          <Form.Item
            name="UserID"
            label="ผู้จอง"
            rules={[
              {
                required: true,
                message: "Please input your Useremail!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="ผู้ขอจอง"
              filterOption={(input, option) =>
                (option?.email ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              fieldNames={{ label: "email", value: "_id" }}
              options={usersList}
            />
          </Form.Item>
          <Form.Item
            label="วัตถุประสงค์"
            name="Purpose"
            rules={[
              {
                required: true,
                message: "Please input your Purpose!",
              },
            ]}
          >
            <Input placeholder="วัตถุประสงค์" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddReq;
