import React, { useState,useEffect } from "react";
import * as MdIcons from "react-icons/md";
import ManageRoomtpye from "./ManageBuildtype";
import AddBuild from "./AddBuild";
import p1 from "./img/1.jpg"
import p2 from "./img/2.png"
import p3 from "./img/3.jpg"
import p4 from "./img/4.jpg"

import { Button, Modal, Table, Input, Form, Select } from "antd";
import { Image } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import axios from 'axios';



const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const { Search } = Input;
const onSearch = (value) => console.log(value);

const BuildmanageAdmin = () => {
  const [componentSize, setComponentSize] = useState('default');
  
    const onFormLayoutChange = ({ size }) => {
      setComponentSize(size);
    };
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [dataSource, setDataSource] = useState([
    // {
    //   id: 1,
    //   picture: <Image.PreviewGroup>
    //   <Image width={65} src={p1} />
    // </Image.PreviewGroup>,
    //   namebuilding: "โรงพยาบาลA",
    //   buildingtpye: (
    //     <Select
    //       placeholder="Select a Buildtype"
    //       defaultValue="student"
    //       onChange={handleChange}
    //     >
    //       <Option value="student">โรงพยาบาล</Option>
    //       <Option value="teacher">โรงเรียน</Option>
    //       <Option value="athlete">อื่นๆ</Option>
    //     </Select>
    //   ),
    //   member: "25",
    //   email:'111@mail.com',
    //   pass:'111111',
    // },
    // {
    //   id: 2,
    //   picture: <Image.PreviewGroup>
    //   <Image width={65} src={p2} />
    // </Image.PreviewGroup>,
    //   namebuilding: "โรงเรียนA",
    //   buildingtpye: (
    //     <Select
    //       placeholder="Select a Buildtype"
    //       defaultValue="teacher"
    //       onChange={handleChange}
    //     >
    //       <Option value="student">โรงพยาบาล</Option>
    //       <Option value="teacher">โรงเรียน</Option>
    //       <Option value="athlete">อื่นๆ</Option>
    //     </Select>
    //   ),
    //   member: "20",
    // },
    // {
    //   id: 3,
    //   picture: <Image.PreviewGroup>
    //   <Image width={65} src={p3} />
    // </Image.PreviewGroup>,
    //   namebuilding: "โรงเรียนB",
    //   buildingtpye: (
    //     <Select
    //       placeholder="Select a Buildtype"
    //       defaultValue="teacher"
    //       onChange={handleChange}
    //     >
    //       <Option value="student">โรงพยาบาล</Option>
    //       <Option value="teacher">โรงเรียน</Option>
    //       <Option value="athlete">อื่นๆ</Option>
    //     </Select>
    //   ),
    //   member: "30",
    // },
    // {
    //   id: 4,
    //   picture:<Image.PreviewGroup>
    //   <Image width={65} src={p4} />
    // </Image.PreviewGroup>,
    //   namebuilding: "ตึกB",
    //   buildingtpye: (
    //     <Select
    //       placeholder="Select a Buildtype"
    //       defaultValue="athlete"
    //       onChange={handleChange}
    //     >
    //       <Option value="student">โรงพยาบาล</Option>
    //       <Option value="teacher">โรงเรียน</Option>
    //       <Option value="athlete">อื่นๆ</Option>
    //     </Select>
    //   ),
    //   member: "40",
    // },
  ]);
      function getManageReq(){
        axios.get('/org',{crossdomain:true})
        .then(response=>{
          console.log(response)
          setDataSource(response.data);
        })
      }
      useEffect(() => {
        getManageReq();
       }, []); 
  const columns = [
    // {
    //   key: "1",
    //   title: "ID",
    //   dataIndex: "_id",
    // },
    {
      key: "2",
      title: "Organization Name",
      dataIndex: "name",
    },
    {
      key: "3",
      title: "Organization tpye",
      dataIndex: "orgType",
    },
    {
      key: "4",
      title: "Member",
      dataIndex: "member",
    },
    {
      key: "5",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record);
              }}
              style={{ color: "blue", marginLeft: 12 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  const [isEditingstatus, setIsEditingstatus] = useState(false);
  const [datastatusSource, setDatastatusSource] = useState([
    {
      id: 1,
      statusname: "ห้องเรียน",
    },
    {
      id: 2,
      statusname: "ห้องปฏิบัติการ",
    },
    {
      id: 3,
      statusname: "อื่นๆ",
    },
  ]);
  const onDeleteStudent = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this organization record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((student) => student.id !== record.id);
        });
      },
    });
  };
  const onEditStudent = (record) => {
    setIsEditing(true);
    setEditingStudent({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };
  const onEditStatus = (record1) => {
    setIsEditingstatus(true);
    setEditingStudent({ ...record1 });
  };
  const resetEditingstatus = () => {
    setIsEditingstatus(false);
    setEditingStudent(null);
  };

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [EditStatusU, setIsEditStatusUser] = useState(false);
  const [AddStatusU, setIsAddStatusUser] = useState(false);
  const [DeleteStatusU, setIsDeleteStatusUser] = useState(false);

  const showAdd = () => {
    setIsAddOpen(true);
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

  const handleCancelAdd = () => {
    setIsAddOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const [isAddReq, setIsAddReq] = useState(false);
  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  const handleOk1 = () => {
    setIsModalOpen1(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const showAddReq = () => {
    setIsAddReq(true);
  };

  const handleOkAddReq = () => {
    setIsAddReq(false);
  };

  const handleCancelAddReq = () => {
    setIsAddReq(false);
  };
  return (
    <div>
      <div className="Heard-ManageUser">
        <h5>ManageOrganization</h5>

        <div className="button-manageorganization">
          <button
            className="button-organization"
            type="primary"
            size={20}
            onClick={showModal1}
          >
            ManageOrganizationtype
          </button>
          <div className="managestatus">
            <Modal
              title="ManageOrganizationtype"
              open={isModalOpen1}
              onOk={handleOk1}
              onCancel={handleCancel1}
              footer={[]}
              width={630}
            >
              <ManageRoomtpye />
            </Modal>
          </div>

          <button
            className="button-user"
            type="primary"
            size={20}
            onClick={showAdd}
          >
            AddOrganization
          </button>

          <Modal
          title='AddOrganization'
            open={isAddOpen}
            onCancel={handleCancelAdd}
            footer={[
              <Button className="button-back" key="back" onClick={handleCancel}>
                ยกเลิก
              </Button>,

              <Button
                className="button-submit"
                key="submit"
                type="primary"
                loading={loading}
              >
                ตกลง
              </Button>,
            ]}
          > <AddBuild/> </Modal>
        </div>
      </div>
      <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columns} dataSource={dataSource}></Table>
          <Modal
            title="Edit Organization"
            visible={isEditing}
            okText="Save"
            onCancel={() => {
              resetEditing();
            }}
            onOk={() => {
              setDataSource((pre) => {
                return pre.map((student) => {
                  if (student.id === editingStudent.id) {
                    return editingStudent;
                  } else {
                    return student;
                  }
                });
              });
              resetEditing();
            }}
          >
          <Form
      
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="horizontal"
      initialValues={{
        size: componentSize,
      }}
      onValuesChange={onFormLayoutChange}
      size={componentSize}
    >
          <Form.Item label='Organization Name'>
            <Input
              value={editingStudent?.namebuilding}
              onChange={(e) => {
                setEditingStudent((pre) => {
                  return { ...pre, namebuilding: e.target.value };
                });
              }}
            />
            </Form.Item>
            <Form.Item label='Organizationtype'
              value={editingStudent?.buildingtpye}
              onChange={(e) => {
                setEditingStudent((pre) => {
                  return { ...pre, buildingtpye: e.target.value };
                });
              }}
            >
             <Select
          placeholder="Select a Organizationtype"
          defaultValue="teacher"
          onChange={handleChange}
        >
          <Option value="student">โรงพยาบาล</Option>
          <Option value="teacher">โรงเรียน</Option>
          <Option value="athlete">อื่นๆ</Option>
        </Select>
            </Form.Item>
            <Form.Item label="E-mail">
            <Input
              value={editingStudent?.email}
              onChange={(e) => {
                setEditingStudent((pre) => {
                  return { ...pre, emai: e.target.value };
                });
              }}
            />
            </Form.Item>
            <Form.Item label="Password">
        <Input.Password value={editingStudent?.pass}
              onChange={(e) => {
                setEditingStudent((pre) => {
                  return { ...pre, pass: e.target.value };
                });
              }}/>
        </Form.Item>
        </Form>
            
          </Modal>
        </header>
      </div>
    </div>
  );
};

export default BuildmanageAdmin;
