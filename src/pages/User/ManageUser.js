import React, { useState ,useEffect} from "react";
import { Button, Modal, Table, Input, Form, Image,Select } from "antd";
import Usermem from "./Usermem";
import "antd/dist/antd.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from 'axios';

import {
  message, 
  Upload,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }

  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }

  return isJpgOrPng && isLt2M;
};

const { Search } = Input;
const { Option } = Select;
const handleChanges = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => console.log(value);

const ManageUser = () => {
  const [show, setShow] = useState(false);
const handleShow = () => setShow(true);
const handleClose = () => setShow(false);

  const [componentSize, setComponentSize] = useState('default');
  
    const onFormLayoutChange = ({ size }) => {
      setComponentSize(size);
    };
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
  
    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
  
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
        });
      }
    };
  
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div
          style={{
            marginTop: 8,
          }}
        >
          Upload
        </div>
      </div>
    );
    
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  function getManageReq(){
    axios.get('/users',{crossdomain:true})
    .then(response=>{
      console.log(response)
      setDataSource(response.data);
    })
  }
  useEffect(() => {
    getManageReq();
   }, []); 
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      key: "1",
      title: "Profile",
      render: (record) => {
        return (
            <Image className="imgprofile"
            preview={false} 
            width={60}
  height={60}
 src={record.image.url}
            /> 
        );
      },
    },
    {
      key: "2",
      title: "Username",
      dataIndex: "username",
    },
    {
      key: "3",
      title: "Name",
      dataIndex: "firstname",
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "4",
      title: "Status",
      dataIndex: "status",
    },
    {
      key: "5",
      title: "Role",
      dataIndex: "role",
    },
    {
      key: "6",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditUser(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteUser(record);
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
      id:1,
      statusname:'Student',
      priority:'3'
    },
    {
      id:2,
      statusname:'Teacher',
      priority:'1'
    },
    {
      id:3,
      statusname:'Athlete',
      priority:'2'
    },
  ]);
  const columnsEdit = [
    {
      key: "1",
      title: "Status",
      dataIndex: "statusname",
    },
    {
      key: "2",
      title: "Priority",
      dataIndex: "priority",
    },
    {
      key: "3",
      title: "Actions",
      render: (record1) => {
        return (
          <>
             <EditOutlined
              onClick={() => {
                onEditStatus(record1);
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
      title: "Status",
      dataIndex: "statusname",
    },
    {
      key: "2",
      title: "Actions",
      render: (record1) => {
        return (
          <>
              <DeleteOutlined
              onClick={() => {
                onDeleteStatus(record1);
              }}
              style={{ color: "red", marginLeft: 12 }}/>
            
          </>
        );
      },
    },
  ];

  const onAddUser = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
    const randomNumber = parseInt(Math.random() * 1000);
    const newUsers = {
     id: randomNumber,
      name: 'Name',
      username:'Username',
      email: "Email",
      status: <Select
      placeholder="Select a Status"
      defaultValue="student"
      onChange={handleChange}
    >
      <Option value="student">Student</Option>
      <Option value="teacher">Teacher</Option>
      <Option value="athlete">Athlete</Option>
    </Select>,
      role: <Select placeholder="Select a Role"  defaultValue="user">
      <Select.Option value="user">User</Select.Option>
      <Select.Option value="admin">Admin</Select.Option>
    </Select>,
    }; 
    setDataSource((pre) => {
      return [...pre, newUsers];
    });
  };
  const onDeleteUser = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this user record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((users) => users.id !== record.id);
        });
      },
    });
  };
  const onDeleteStatus = (record1) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this status record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDatastatusSource((pre) => {
          return pre.filter((status) => status.id !== record1.id);
        });
      },
    });
  };
  const onEditUser = (record) => {
    setIsEditing(true);
    setEditingUser({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingUser(null);
  };
  const onEditStatus = (record1) => {
    setIsEditingstatus(true);
    setEditingUser({ ...record1 });
  };
  const resetEditingstatus = () => {
    setIsEditingstatus(false);
    setEditingUser(null);
  };
  
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
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

  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  const handleOk1 = () => {
    setIsModalOpen1(false);
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="ManageUser">
      <div className="Heard-ManageUser">
        <h5>ManageUser</h5>
        <div className="button-manageuser">
          <button
            className="button-user"
            type="primary"
            size={20}
            onClick={showModal1}
          >
            ManageStatus
          </button>
          <div className="managestatus">
            <Modal
              title="ManageStatus"
              open={isModalOpen1}
              onOk={handleOk1}
              onCancel={handleCancel1}
              footer={[]}
            >
              <button className="button-user-mana1" id="1" type="primary" onClick={showAddstatus}>
                AddStatus
              </button>
              <Modal
            title="AddStatus"
            open={AddStatusU}
            onOk={Canceladdstatus}
            onCancel={Canceladdstatus}
          >
          <Form
      
      labelCol={{
        span: 4,
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
            <Form.Item label="Username">
          <Input placeholder='Username'/>
        </Form.Item>
        <Form.Item label="Pririty">
        <Select
    showSearch
    style={{
      width: 200,
    }}
    placeholder="Select pririty status"
    optionFilterProp="children"
    filterOption={(input, option) => option.children.includes(input)}
    filterSort={(optionA, optionB) =>
      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
    }
  >
    <Option value="1">1</Option>
    <Option value="2">2</Option>
    <Option value="3">3</Option>
    <Option value="4">4</Option>
    <Option value="5">5</Option>
  </Select>
  </Form.Item>
  </Form>
          </Modal>
              <button className="button-user-mana2" type="primary"  onClick={showEditstatus}>
                EditStatus
              </button>
              <Modal
            title="EditStatus"
            open={EditStatusU}
            onCancel={Canceleditstatus}
            onOk={false}
          >
            <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columnsEdit} dataSource={datastatusSource}></Table>
          <Modal
            title="Edit Status"
            visible={isEditingstatus}
            okText="Save"
            onCancel={() => {
              resetEditingstatus();
            }}
            onOk={() => {
              setDatastatusSource((pre) => {
                return pre.map((users) => {
                  if (users.id === editingUser.id) {
                    return editingUser;
                  } else {
                    return users;
                  }
                });
              });
              resetEditingstatus();
            }}
          >
           <Form
      
      labelCol={{
        span: 4,
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
           <Form.Item label="Username">
          <Input value={editingUser?.statusname}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return { ...pre, statusname: e.target.value };
                });
              }}/>
        </Form.Item>
            <Form.Item label="Pririty">
        <Select
    showSearch
    style={{
      width: 200,
    }}
    placeholder="Select pririty status"
    optionFilterProp="children"
    filterOption={(input, option) => option.children.includes(input)}
    filterSort={(optionA, optionB) =>
      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
    }
  >
    <Option value="1">1</Option>
    <Option value="2">2</Option>
    <Option value="3">3</Option>
    <Option value="4">4</Option>
    <Option value="5">5</Option>
  </Select>
  </Form.Item>
  </Form>
          </Modal>
        </header>
        </div>
          </Modal>
              <button className="button-user-mana3" type="primary" onClick={showDeletestatus}>
                DeleteStatus
              </button>
            </Modal>
            <Modal
            title="DeleteStatus"
            open={DeleteStatusU}
            onCancel={Canceldeletestatus}
            onOk={false}
          >
            <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columnsDelete} dataSource={datastatusSource}></Table>
          <Modal
            title="Delete Status"
            visible={isEditingstatus}
            okText="Save"
            onCancel={() => {
              resetEditingstatus();
            }}
            onOk={() => {
              setDatastatusSource((pre) => {
                return pre.map((users) => {
                  if (users.id === editingUser.id) {
                    return editingUser;
                  } else {
                    return users;
                  }
                });
              });
              resetEditingstatus();
            }}
          >
          </Modal>
        </header>
        </div>
          </Modal>
          </div>

          <button
            className="button-user"
            type="primary"
            size={20}
            onClick={showAdd}
          >
            AddUser
          </button>
          
            <Modal
              open={isAddOpen}
              onCancel={handleCancelAdd}
              onOk={onAddUser}
              footer={[
                <Button
                  className="button-back"
                  key="back"
                  onClick={handleCancel}
                >
                  ยกเลิก
                </Button>,

                <Button
                  className="button-submit"
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={onAddUser}
                >
                  ตกลง
                </Button>,
              ]}
            ><Usermem/>
             {/*<Form
      
      labelCol={{
        span: 4,
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
      <div className='picture'>
      <Upload
    name="avatar"
    listType="picture-card"
    className="avatar-uploader"
    showUploadList={false}
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    beforeUpload={beforeUpload}
    onChange={handleChange}
  >
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="avatar"
        style={{
          width: '100%',
        }}
      />
    ) : (
      uploadButton
    )}
  </Upload>
  </div>
      <Form.Item label="Username">
        <Input placeholder='Username'/>
      </Form.Item>
      <Form.Item label="Name">
        <Input placeholder='Name'/>
      </Form.Item>
      <Form.Item label="Lastname">
      <Input placeholder='Lastname'/>
      </Form.Item>
      <Form.Item label="E-mail">
      <Input placeholder='E-mail'/>
      </Form.Item>
      <Form.Item label="Password">
      <Input.Password placeholder='Password'/>
      </Form.Item>
      
      <Form.Item label="Status">
        <Select placeholder="Select a Status">
          <Select.Option value="student">Student</Select.Option>
          <Select.Option value="teacher">Teacher</Select.Option>
          <Select.Option value="athlete">Athlete</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Role">
        <Select placeholder="Select a Role">
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
        </Select>
      </Form.Item>
    </Form>*/}
            </Modal>

        </div>
      </div>
      <div className="searchall">
      <div className="searchstatus">
              Organization: <Select
      placeholder="Select a Building"
      onChange={handleChange}
    >
      <Option value="student">ECC</Option>
      <Option value="teacher">โรงแอล</Option>
      <Option value="athlete">ห้องประชุมพันปี</Option>
    </Select>
    </div>
        <div className="searchstatus">
      Status: <Select
      placeholder="Select a Status"
      onChange={handleChange}
    >
      <Option value="student">Student</Option>
      <Option value="teacher">Teacher</Option>
      <Option value="athlete">Athlete</Option>
    </Select>
    </div>
    <div className="searchstatus">
      Role: <Select placeholder="Select a Role">
      <Select.Option value="user">User</Select.Option>
      <Select.Option value="admin">Admin</Select.Option>
    </Select>
    </div>
    <div className="searchstatus">
    <Search
      placeholder="Search Users"
      allowClear
      onSearch={onSearch}
      style={{
        width: 200,
      }}
    />
    </div>
    
      </div>
      <div className="User-list">
        <header className="User-list-heard">
          <Table columns={columns} dataSource={dataSource}></Table>
          <Modal
            title="Edit Users"
            visible={isEditing}
            okText="Save"
            onCancel={() => {
              resetEditing();
            }}
            onOk={() => {
              setDataSource((pre) => {
                return pre.map((users) => {
                  if (users.id === editingUser.id) {
                    return editingUser;
                  } else {
                    return users;
                  }
                });
              });
              resetEditing();
            }}
          >
          <Form
      
        labelCol={{
          span: 4,
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
          <Form.Item label="Username">
          <Input placeholder='Username'
            value={editingUser?.username}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return { ...pre, username: e.target.value };
                });
              }}
          />
        </Form.Item>
        <Form.Item label="Name">
          <Input placeholder='Name'
          value={editingUser?.name}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return { ...pre, name: e.target.value };
                });
              }}
              />
        </Form.Item>
        <Form.Item label="Lastname">
        <Input placeholder='Lastname'
          value={editingUser?.email}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return { ...pre, email: e.target.value };
                });
              }}
        />
        </Form.Item>
        <Form.Item label="E-mail">
        <Input placeholder='E-mail'
        value={editingUser?.email}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return { ...pre, email: e.target.value };
                });
              }}
        />
        </Form.Item>
        <Form.Item label="Password">
       <Input.Password value={editingUser?.pass}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return { ...pre, pass: e.target.value };
                });
              }}/>
              </Form.Item>
        
            <Form.Item label="Status"
             value={editingUser?.status}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return { ...pre, status: e.target.value };
                });
              }}>
              <Select placeholder="Select a Status">
                <Select.Option value="student">Student</Select.Option>
                <Select.Option value="teacher">Teacher</Select.Option>
                <Select.Option value="athlete">Athlete</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Role"
              value={editingUser?.role}
              onChange={(e) => {
                setEditingUser((pre) => {
                  return { ...pre, role: e.target.value };
                });
              }}
            >
              <Select placeholder="Select a Role">
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
            </Form>
          </Modal>
        </header>
      </div>
    </div>
  );
};

export default ManageUser;
