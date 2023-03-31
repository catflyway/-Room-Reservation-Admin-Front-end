import React, { useState } from "react";
import "./App.css";
import Navbar from "./conponents/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Calendar from "./pages/Calendar";
import ManageUser from "./pages/User/ManageUser";
import ManageReq from "./pages/ManageReq/ManageReq";
import ManageRoom from "./pages/Room/ManageRoom";
import LoginForm from "./conponents/LoginForm";
import BuildmanageAdmin from "./pages/Build/BuildmanageAdmin";
import Chart from "./pages/Chart/ShowBar";
import Profile from "./Profile";
import axios from "axios";

function App() {
  const [user, setUser] = useState(()=>{
  let userProfle = localStorage.getItem("userData");
  if (userProfle) {
    let toto = JSON.parse(userProfle);
    axios.defaults.headers.common['Authorization'] = `Bearer ${toto.token}`;
    return JSON.parse(userProfle);
  }
  return {email: ""};
  });

  
  const [error, setError] = useState("");

  const Login = (details) => {
    console.log(details);
    axios
      .post("/auth/login", details)
      
      .then((response) => {
          localStorage.setItem('userData', JSON.stringify(response.data));
        console.log(response);
        if (response.status == 200) {
          console.log("Logged in");
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          setUser({
            email: details.email,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Details do not match!");
        setError("Incorrect email or password");
      });
  };
  return (
    <>
      <div className="App">
        {user.email != "" ? (
          <>
            <BrowserRouter>
              <Navbar /> 
              <Routes>
                <Route path="/" element={<Calendar />} />
                {<Route path="/ManageUser" element={<ManageUser />} />}
                {<Route path="/ManageRoom" element={<ManageRoom />} />}
                {<Route path="/ManageReq" element={<ManageReq />} />}
                {
                  <Route
                    path="/BuildmanageAdmin"
                    element={<BuildmanageAdmin />}
                  />
                }
                {<Route path="/ChartJs" element={<Chart />} />}
                {<Route path="/Profile" element={<Profile />} />}
              </Routes>
            </BrowserRouter>
          </>
        ) : (
          <LoginForm Login={Login} error={error} />
        )}
      </div>
    </>
  );
}

export default App;
