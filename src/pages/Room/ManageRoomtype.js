import React, { useState } from "react";
import { Button, Modal, Table, Input, Form, Select} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ManageRoomtpye=()=>{
    const [isEditingroomtype, setIsEditingroomtype] = useState(false);
    const [editingdataRoomtype, setEditingdataRoomtype] = useState(null);
    const [datastatusSource, setDatastatusSource] = useState([
        {
          id:1,
          roomtype:'ห้องเรียน',
        },
        {
          id:2,
          roomtype:'ห้องปฏิบัติการ',
        },
        {
          id:3,
          roomtype:'อื่นๆ',
        },
      ]);
      const columnsEdit = [
        {
          key: "1",
          title: "Roomtype",
          dataIndex: "roomtype",
        },
        {
          key: "2",
          title: "Actions",
          render: (record1) => {
            return (
              <>
                 <EditOutlined
                  onClick={() => {
                    onEditRoomtype(record1);
                  }}
                  style={{ color: "blue", marginLeft: 12 }}/>
                  <DeleteOutlined
                  onClick={() => {
                    onDeleteRoomtype(record1);
                  }}
                  style={{ color: "red", marginLeft: 12 }}/>
              </>
            );
          },
        },
      ];
      const onDeleteRoomtype = (record1) => {
        Modal.confirm({
          title: "Are you sure, you want to delete this roomtype record?",
          okText: "Yes",
          okType: "danger",
          onOk: () => {
            setDatastatusSource((pre) => {
              return pre.filter((student) => student.id !== record1.id);
            });
          },
        });
      };
      const onEditRoomtype = (record1) => {
        setIsEditingroomtype(true);
        setEditingdataRoomtype({ ...record1 });
      };
      const resetEditingroomtype = () => {
        setIsEditingroomtype(false);
        setEditingdataRoomtype(null);
      };
      const [open, setOpen] = useState(false);
      const [loading, setLoading] = useState(false);

      const onAddUser = () => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setOpen(false);
        }, 3000);
        const randomNumber = parseInt(Math.random() * 1000);
        const newUsers = {
         id: randomNumber,
         roomtype: 'Name',
        }; 
        setDatastatusSource((pre) => {
          return [...pre, newUsers];
        });
      };
    return(
        <div>
            <div className="User-list">
            <button className="button-submit1"
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={onAddUser}>AddRoomtype</button>
        <header className="User-list-heard">
          <Table columns={columnsEdit} dataSource={datastatusSource}  pagination={false}></Table>
          <Modal
            title="EditRoomtype"
            visible={isEditingroomtype}
            okText="Save"
            onCancel={() => {
              resetEditingroomtype();
            }}
            onOk={() => {
              setDatastatusSource((pre) => {
                return pre.map((student) => {
                  if (student.id === editingdataRoomtype.id) {
                    return editingdataRoomtype;
                  } else {
                    return student;
                  }
                });
              });
              resetEditingroomtype();
            }}
          >
            <Input placeholder="Buildiding"
              value={editingdataRoomtype?.roomtype}
              onChange={(e) => {
                setEditingdataRoomtype((pre) => {
                  return { ...pre, roomtype: e.target.value };
                });
              }}
            />
          </Modal>
        </header>
        </div>
          </div>
    );
}
export default ManageRoomtpye;