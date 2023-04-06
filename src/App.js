import React, { useState } from "react";
import "./App.css";
import Navbar from "./conponents/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginForm from "./conponents/LoginForm";
import { MenuItems } from "./conponents/MenuItems";
import axios from "axios";
import { UserContext, UserDefaultPage } from "./user-context";

function App() {
  const allowRole = ["Contributor", "Room Contributor" ,"Administrator"];
  const [user, setUser] = useState(() => {
    let userProfle = localStorage.getItem("userData");
    if (userProfle) {
      let toto = JSON.parse(userProfle);
      if (allowRole.includes(toto.role)) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${toto.token}`;
      return toto;
    }
    localStorage.removeItem("userData");
  }
    return { email: "" };
  });

  const [error, setError] = useState("");

  const Login = (details) => {
    console.log(details);
    axios
      .post("/auth/login", details)
      .then((response) => {
        console.log(response);
        if (response.status != 200) {
          throw "Response not 200";
        }
        if (allowRole.includes(response.data.role)) {
          console.log("Logged in");
          localStorage.setItem("userData", JSON.stringify(response.data));
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
          setUser(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Details do not match!");
        setError("Incorrect email or password");
      });
  };

  return (
    <UserContext.Provider value={user}>
      <div className="App">
        {user.email != "" ? (
          <>
            <BrowserRouter>
              <Navbar />
              <Routes>
                {MenuItems.map((item, index) => {
                  if (!item.role.includes(user.role)) {
                    return undefined;
                  }
                  return <Route key={index} path={item.path} element={item.element} />;
                })}
                <Route
                  path="*"
                  element={<Navigate to={UserDefaultPage[user.role]} replace />}
                />
              </Routes>
            </BrowserRouter>
          </>
        ) : (
          <LoginForm Login={Login} error={error} />
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
