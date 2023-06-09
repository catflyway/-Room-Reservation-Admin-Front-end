import React,{useState} from 'react'
import profile from './image/a.jpg'
import { FiMail } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import { Row,Col } from 'antd';

function LoginForm({Login,error}) {
    const [details,setDetails]=useState({name:"",email:"",password:""});
    const submitHandler = e =>{
        e.preventDefault();

        Login(details);
    }
  return (
    <div className='main'>
    <Row  justify={"center"} gutter={[16, 16]}>
    <form onSubmit={submitHandler}>
        <div className='form-inner'>
        <Row justify={"center"}>
            <h2>Login</h2>
            </Row>
            {(error!="")?(<div className='error'>{error}</div>) : ""}
            <div className="imgs">
          <div className="container-image">
            <img src={profile} alt="profile" className="profile"/>
          </div>
        </div>

            <div className='form-group'>
                <label htmlFor='email'><h4>Email</h4> </label>
                <div className='login-icon'>
                <FiMail/>
                </div>
                <input type="email" placeholder="Email" name="email" id="email" onChange={e=>setDetails({...details,email:e.target.value})} value={details.email}/>
            </div>
            <div className='form-group'>
                <label htmlFor='password'> <h4>Password:</h4></label>
                <div className='login-icon'>
                <FiLock/>
                </div>
                <input type="password" placeholder="password" name="password" id="password" onChange={e=>setDetails({...details,password:e.target.value})} value={details.password}/>
            </div>
            <Row justify={"center"}>
            <input type="submit" value="Login"/>
            </Row>
        </div>
    </form>
    </Row>
    </div>
  )
}

export default LoginForm;
