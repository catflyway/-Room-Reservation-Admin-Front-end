import {
  Form,
  Input,
  DatePicker,
  Space,
  Radio,
  Checkbox,
  TimePicker,
  Select,
  Segmented,
} from "antd";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { UserContext } from "../../user-context";

function AddReq({ details, onChange }) {
  const user = useContext(UserContext);
  const [form] = Form.useForm();
  const [orgList, setOrgList] = useState([]);
  function getOrg() {
    axios.get("/org").then((response) => {
      setOrgList(response.data);
    });
  }
  const [buildingList, setBuildingList] = useState([]);
  function getBuildingInOrgID(id) {
    axios.get("/org/building/" + id).then((response) => {
      setBuildingList(response.data);
    });
  }
  const [roomsList, setRoomsList] = useState([]);
  function getRoomsInOrgID(id) {
    axios.get("/rooms/buildingroom/" + id).then((response) => {
      setRoomsList(response.data);
    });
  }
  const [usersList, setUsersList] = useState([]);
  function getUsersInOrgID(id) {
    axios.get("/org/user/" + id).then((response) => {
      setUsersList(response.data);
    });
  }
  const canNotChangeOrg = ["Room Contributor", "Contributor"].includes(
    user.role
  );
  useEffect(() => {
    if (canNotChangeOrg) {
      onChangeorg(user.org.id);
      form.setFieldValue("OrgID", user.org.id);
      getOrg({ OrgID: user.org.id });
    } else {
      getOrg();
    }
  }, []);

  const onChangeorg = (orgID) => {
    console.log(`selected ${orgID}`);
    getBuildingInOrgID(orgID);
    getUsersInOrgID(orgID);

    onChange({ ...details, OrgID: orgID });
  };
  const onChangebuild = (buildingID) => {
    console.log(`selected ${buildingID}`);
    getRoomsInOrgID(buildingID);

    onChange({ ...details, buildingID: buildingID });
  };
  const onChangeStartdate = (date) => {
    console.log(`selected ${date}`);
    if (date) {
      setStartDate(date?.clone().startOf("day"));
    }
    form.resetFields(["endDate"]);
  };

  const datOfWeekString = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [timeRange, setTimeRange] = useState([0, 24 * 60]);
  const [weekDay, setWeekDay] = useState();
  const [repeatPattern, setRepeatPattern] = useState("norepeat");

  const onChangeTimeRange = (timesrt, timeString) => {
    let startDiff = timesrt[0]?.diff(
      timesrt[0].clone().startOf("day"),
      "minute"
    );
    let stopDiff = timesrt[1]?.diff(
      timesrt[1].clone().startOf("day"),
      "minute"
    );
    setTimeRange([startDiff, stopDiff]);
  };

  React.useEffect(() => {
    if (startDate) {
      setWeekDay(datOfWeekString[startDate.day()]);
    }
  }, [startDate]);

  React.useEffect(() => {
    if (isAllDay) {
      setTimeRange([0, 24 * 60]);
    }
  }, [isAllDay]);

  React.useEffect(() => {
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

    if (startDate && timeRange && repeatPattern == "norepeat") {
      let range = getTimeRange(startDate);
      startTime = [range[0]];
      endTime = [range[1]];
    } else if (startDate && endDate && timeRange && repeatPattern == "days") {
      [startTime, endTime] = getTimeRangeInterval(1);
    } else if (startDate && endDate && timeRange && repeatPattern == "weeks") {
      [startTime, endTime] = getTimeRangeInterval(7);
    }

    onChange({
      ...details,
      allDay: isAllDay,
      repeatDate: repeatPattern,
      startTime,
      endTime,
    });
  }, [repeatPattern, startDate, endDate, timeRange]);

  return (
    <Form
      form={form}
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      layout="horizontal"
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
          disabled={canNotChangeOrg}
        />
      </Form.Item>
      <Form.Item
        label="อาคาร/สถานที่"
        name="อาคาร/สถานที่"
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
        />
      </Form.Item>
      <Form.Item
        label="ห้อง"
        name="ห้อง"
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
          onChange={(value) => onChange({ ...details, Room: value })}
          // onChange={(value) => setData({ ...data, Room: value })}
          filterOption={(input, option) =>
            (option?.Name ?? "").toLowerCase().includes(input.toLowerCase())
          }
          fieldNames={{ label: "Name", value: "_id" }}
          options={roomsList}
        />
      </Form.Item>
      <Form.Item label="เวลาการจอง">
        <Space direction="vertical">
          <Checkbox
            name="TimeRange"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
          >
            Allday
          </Checkbox>
          {!isAllDay ? (
            <Form.Item
              name="time"
              rules={[
                {
                  required: true,
                  message: "Please input your reservation timing!",
                },
              ]}
            >
              <TimePicker.RangePicker
                onChange={onChangeTimeRange}
                format="HH:mm"
              />
            </Form.Item>
          ) : (
            ""
          )}
        </Space>
      </Form.Item>
      <Form.Item label="วันจอง">
        <Space direction="vertical">
          <Form.Item
            name="startDate"
            rules={[
              {
                required: true,
                message: "Please input your StartDate!",
              },
            ]}
          >
            <DatePicker
              placeholder="เริ่มจอง"
              onChange={onChangeStartdate}
              value={startDate}
              disabledDate={(value) => value && value < dayjs().endOf("day")}
            />
          </Form.Item>
          <Radio.Group
            value={repeatPattern}
            onChange={(e) => setRepeatPattern(e.target.value)}
          >
            <Radio.Button value="norepeat">Does not repeat</Radio.Button>
            <Radio.Button value="days">everyday</Radio.Button>
            <Radio.Button value="weeks">everyweek</Radio.Button>
          </Radio.Group>
          {repeatPattern == "days" ? (
            <Form.Item
              name="endDate"
              rules={[
                {
                  required: true,
                  message: "Please input your EndDate!",
                },
              ]}
            >
              <DatePicker
                onChange={(date) =>
                  setEndDate(date?.clone().add(1, "day").startOf("day"))
                }
                placeholder="วันสิ้นการจอง"
                disabledDate={(value) => value && value < startDate}
              />
            </Form.Item>
          ) : repeatPattern == "weeks" ? (
            <>
              <Segmented
                size="large"
                options={datOfWeekString}
                value={weekDay}
                disabled
              />
              <Form.Item
                name="endDate"
                rules={[
                  {
                    required: true,
                    message: "Please input your EndDate!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(date) =>
                    setEndDate(date?.clone().add(1, "day").startOf("day"))
                  }
                  placeholder="วันสิ้นสุดสัปดาห์"
                  disabledDate={(value) =>
                    value &&
                    startDate &&
                    (value < startDate || value.day() != startDate.day())
                  }
                />
              </Form.Item>
            </>
          ) : (
            ""
          )}
        </Space>
      </Form.Item>
      <Form.Item
        label="ผู้ขอจอง"
        name="UserID"
        rules={[
          {
            required: true,
            message: "Please input your User!",
          },
        ]}
      >
        <Select
          showSearch
          placeholder="ผู้ขอจอง"
          optionFilterProp="children"
          onChange={(userID) => {
            onChange({ ...details, UserID: userID });
          }}
          filterOption={(input, option) =>
            (option?.email ?? "").toLowerCase().includes(input.toLowerCase())
          }
          fieldNames={{ label: "email", value: "_id" }}
          options={usersList}
        />
      </Form.Item>
      <Form.Item
        label="วัตถุประสงค์"
        name="วัตถุประสงค์"
        rules={[
          {
            required: true,
            message: "Please input your Purpose!",
          },
        ]}
      >
        <Input
          placeholder="วัตถุประสงค์"
          onChange={(e) => onChange({ ...details, Purpose: e.target.value })}
          value={details?.Purpose}
        />
      </Form.Item>
    </Form>
  );
}

export default AddReq;
