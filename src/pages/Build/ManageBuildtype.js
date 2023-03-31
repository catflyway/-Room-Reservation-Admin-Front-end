import React, { useState } from "react";
import { Button, Modal, Table, Input, Form, Select} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ManageRoomtpye=()=>{
    const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
    const [isEditingbuildtype, setIsEditingbuildtype] = useState(false);
    const [dataSource, setDataSource] = useState([
        {
          id: 1,
          buildingtpye: (
            <Select
              placeholder="Select a Buildtype"
              defaultValue="student"
              onChange={handleChange}
            >
              <Option value="student">โรงพยาบาล</Option>
              <Option value="teacher">โรงเรียน</Option>
              <Option value="athlete">อื่นๆ</Option>
            </Select>
          ),
        },
        {
          id: 2,
          buildingtpye: (
            <Select
              placeholder="Select a Buildtype"
              defaultValue="teacher"
              onChange={handleChange}
            >
              <Option value="student">โรงพยาบาล</Option>
              <Option value="teacher">โรงเรียน</Option>
              <Option value="athlete">อื่นๆ</Option>
            </Select>
          ),
        },
        {
          id: 3,
          buildingtpye: (
            <Select
              placeholder="Select a Buildtype"
              defaultValue="teacher"
              onChange={handleChange}
            >
              <Option value="student">โรงพยาบาล</Option>
              <Option value="teacher">โรงเรียน</Option>
              <Option value="athlete">อื่นๆ</Option>
            </Select>),
        },
        {
            id: 4,
            buildingtpye: (
              <Select
                placeholder="Select a Buildtype"
                defaultValue="athlete"
                onChange={handleChange}
              >
                <Option value="student">โรงพยาบาล</Option>
                <Option value="teacher">โรงเรียน</Option>
                <Option value="athlete">อื่นๆ</Option>
              </Select>),
          },
      ]);
    const [EditStatusU, setIsEditStatusUser] = useState(false);
    const [DeleteStatusU, setIsDeleteStatusUser] = useState(false);
    const [editingdatabuildtype, setEditingdatabuildtype] = useState(null);
    const [AddStatusU, setIsAddStatusUser] = useState(false);
    const [datastatusSource, setDatastatusSource] = useState([
        {
          id:1,
          buildtype:'โรงพยาบาล',
        },
        {
          id:2,
          buildtype:'โรงเรียน',
        },
        {
          id:3,
          buildtype:'อื่นๆ',
        },
      ]);
      const columnsEdit = [
        {
          key: "1",
          title: "Buildtype",
          dataIndex: "buildtype",
        },
        {
          key: "2",
          title: "Actions",
          render: (record1) => {
            return (
              <>
                 <EditOutlined
                  onClick={() => {
                    onEditBuildtype(record1);
                  }}
                  style={{ color: "yellow", marginLeft: 12 }}/>
              </>
            );
          },
        },
      ];
      const columnsDelete = [
        {
            key: "1",
            title: "Buildtype",
            dataIndex: "buildtype",
        },
        {
          key: "2",
          title: "Actions",
          render: (record1) => {
            return (
              <>
                  <DeleteOutlined
                  onClick={() => {
                    onDeleteBuildtype(record1);
                  }}
                  style={{ color: "red", marginLeft: 12 }}/>
                
              </>
            );
          },
        },
      ];
      const onDeleteBuildtype = (record1) => {
        Modal.confirm({
          title: "Are you sure, you want to delete this organizationtype record?",
          okText: "Yes",
          okType: "danger",
          onOk: () => {
            setDatastatusSource((pre) => {
              return pre.filter((student) => student.id !== record1.id);
            });
          },
        });
      };
      const onEditBuildtype = (record1) => {
        setIsEditingbuildtype(true);
        setEditingdatabuildtype({ ...record1 });
      };
      const resetEditingbuildtype = () => {
        setIsEditingbuildtype(false);
        setEditingdatabuildtype(null);
      };
    const showAddstatus = () => {
        setIsAddStatusUser(true);
      };
      const Canceladdstatus = () => {
        setIsAddStatusUser(false);
      };
      const showDeletestatus = () => {
        setIsDeleteStatusUser(true);
      };
      const Canceldeletestatus = () => {
        setIsDeleteStatusUser(false);
      };
      const showEditstatus = () => {
        setIsEditStatusUser(true);
      };
      const Canceleditstatus = () => {
        setIsEditStatusUser(false);
      };
    return(
        <div>
            <button className="button-org-mana1" id="1" type="primary" onClick={showAddstatus}>
                AddOrganizationtype
              </button>
              <Modal
            title="AddOrganizationtype"
            open={AddStatusU}
            onOk={Canceladdstatus}
            onCancel={Canceladdstatus}
          >
            <Form.Item label="Buildtype">
          <Input placeholder='AddBuildtype'/>
        </Form.Item>
          </Modal>
              <button className="button-org-mana2" type="primary"   onClick={showEditstatus}>
                EditOrganizationtype
              </button>
              <Modal
            title="EditOrganizationtype"
            open={EditStatusU}
            onCancel={Canceleditstatus}
            onOk={false}
          >
            <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columnsEdit} dataSource={datastatusSource}></Table>
          <Modal
            title="Edit Organizationtype"
            visible={isEditingbuildtype}
            okText="Save"
            onCancel={() => {
              resetEditingbuildtype();
            }}
            onOk={() => {
              setDatastatusSource((pre) => {
                return pre.map((student) => {
                  if (student.id === editingdatabuildtype.id) {
                    return editingdatabuildtype;
                  } else {
                    return student;
                  }
                });
              });
              resetEditingbuildtype();
            }}
          >
            <Input placeholder="Buildiding"
              value={editingdatabuildtype?.buildtype}
              onChange={(e) => {
                setEditingdatabuildtype((pre) => {
                  return { ...pre, buildtype: e.target.value };
                });
              }}
            />
          </Modal>
        </header>
        </div>
          </Modal>
              <button className="button-org-mana3" type="primary" onClick={showDeletestatus}>
                DeleteOrganizationtype
              </button>
              <Modal
            title=" DeleteOrganizationtype"
            open={DeleteStatusU}
            onCancel={Canceldeletestatus}
            onOk={false}
          >
            <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columnsDelete} dataSource={datastatusSource}></Table>
          <Modal
            title="Delete Status"
            visible={isEditingbuildtype}
            okText="Save"
            onCancel={() => {
              resetEditingbuildtype();
            }}
            onOk={() => {
              setDatastatusSource((pre) => {
                return pre.map((student) => {
                  if (student.id === editingdatabuildtype.id) {
                    return editingdatabuildtype;
                  } else {
                    return student;
                  }
                });
              });
              resetEditingbuildtype();
            }}
          >
          </Modal>
        </header>
        </div>
          </Modal>
          </div>
    );
}
export default ManageRoomtpye;