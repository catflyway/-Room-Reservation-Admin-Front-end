import React, { useState,useEffect } from "react";
import AddOrganization from "./AddOrg";
import { Button, Modal, Table, Input, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import axios from 'axios';



const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const ManageOrganization = () => {
  const [componentSize, setComponentSize] = useState('default');
  
    const onFormLayoutChange = ({ size }) => {
      setComponentSize(size);
    };
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [OrgID, setOrgID] = useState([]);
      function getOrg(){
        axios.get('/org',{crossdomain:true})
        .then(response=>{
          console.log(response)
          setOrgID(response.data.map((item)=>{
            return {...item,member:item.userID.length}  
          }));
        })
      }
      const [UserContributorOrg, setUserContributorOrg] = useState([]);
      function getUserContributorOrg(id){
        axios.get('users/searchby?OrgID='+id,{crossdomain:true})
        .then(response=>{
          console.log(response)
          setUserContributorOrg(response.data);
        })
      }
      useEffect(() => {
        getOrg();
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
      title: "Member",
      dataIndex: "member",
    },
    {
      key: "4",
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
  const onDeleteStudent = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this organization record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setOrgID((pre) => {
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

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showAdd = () => {
    setIsAddOpen(true);
  };

  const handleCancelAdd = () => {
    setIsAddOpen(false);
  };

  const handleCancel = () => {
    setIsAddOpen(false);
  };
  return (
    <div>
      <div className="Heard-ManageUser">
        <h5>ManageOrganization</h5>
        <div className="button-manageorganization">
          <AddOrganization  onSuccess={getOrg}/>
        </div>
      </div>
      <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columns} dataSource={OrgID}></Table>
          <Modal
            title="Edit Organization"
            visible={isEditing}
            okText="Save"
            onCancel={() => {
              resetEditing();
            }}
            onOk={() => {
              setOrgID((pre) => {
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
            <Form.Item label="E-mail Contributor">
            <Input
              value={editingStudent?.email}
              onChange={(e) => {
                setEditingStudent((pre) => {
                  return { ...pre, emai: e.target.value };
                });
              }}
            />
            </Form.Item>
            <Form.Item label="Password Contributor">
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

export default ManageOrganization;
