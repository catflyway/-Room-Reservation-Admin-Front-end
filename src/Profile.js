import React, { useState ,useEffect} from "react";
import { Form, Input, Select, Image, Button, Row, Col } from "antd";
import axios from 'axios';

function Profile() {
  const OnButtonClick = (e) => {
    console.log("Button clicked");
  };

  const [dataSource, setDataSource] = useState({});
  function getManageReq(){
    axios.get('/users/userprofile')
    .then(response=>{
      console.log(response)
      setDataSource(response.data);
    })
  }
  useEffect(() => {
    getManageReq();
   }, []); 
   const [editingProfile, setEditingProfile] = useState(null);
  const Logout = () => {
    localStorage.removeItem("userData");
    document.location.reload(true);
  };

  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  return (
    <div className="Profile">
      <Row justify="center">
        <Col span={12}>
          <Form
            className="Profileform"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            layout="horizontal"
            initialValues={{
              size: componentSize,
            }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
          >
          <div className="imgprofile">
             <Image className="imgprofilebor"
            preview={false} 
            width={150}
  height={150}
 src={dataSource.image?.url}
            />  </div>
            <Form.Item label="Username">
              <Input placeholder="Username"  value={dataSource?.username}
              onChange={(e) => {
                setEditingProfile((pre) => {
                  return { ...pre, username: e.target.value };
                });
              }} />
            </Form.Item>
            <Form.Item label="Name">
              <Input placeholder="Name" value={dataSource?.firstname} />
            </Form.Item>
            <Form.Item label="Lastname" >
              <Input placeholder="Lastname" value={dataSource?.lastname} />
            </Form.Item>
            <Form.Item label="E-mail" >
              <Input placeholder="E-mail" value={dataSource?.email} />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password placeholder="Password"  value={dataSource?.password} />
            </Form.Item>
            <Form.Item label="Status">
              <Select placeholder="Select a Status">
                <Select.Option value="student">Student</Select.Option>
                <Select.Option value="teacher">Teacher</Select.Option>
                <Select.Option value="athlete">Athlete</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      
      <Row justify="center">
        <Col>
          <Button className='button-logout' onClick={OnButtonClick}>
            Reset
          </Button>
          <Button className='button-logout'  type="primary" onClick={OnButtonClick}>
            Save
          </Button>
        </Col>
      </Row>

      <Row justify="center">
        <Col>
          <Button className="button-user-mana3" type="danger" onClick={Logout}>
            Logout
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
