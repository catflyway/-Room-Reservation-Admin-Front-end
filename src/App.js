import React, { useState } from "react";
import "./App.css";
import Navbar from "./conponents/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginForm from "./conponents/LoginForm";
import { MenuItems } from "./conponents/MenuItems";
import axios from "axios";
import { UserContext, UserDefaultPage } from "./user-context";
import { Layout, ConfigProvider } from "antd";
const { Header, Content, Footer } = Layout;

function App() {
  const allowRole = ["Contributor", "Room Contributor", "Administrator"];
  const [user, setUser] = useState(() => {
    let userProfle = localStorage.getItem("userData");
    if (!userProfle) {
      return { email: "" };
    }
    let toto = JSON.parse(userProfle);
    if (!allowRole.includes(toto.role)) {
      localStorage.removeItem("userData");
      return { email: "" };
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${toto.token}`;

    toto.canNotChangeOrg = ["Room Contributor", "Contributor"].includes(
      toto.role
    );

    // toto.canNotChangeOrg = true;

    return toto;
  });

  const [error, setError] = useState("");

  const Login = (details) => {
    console.log(details);
    axios
      .post("/auth/login", details)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Response not 200");
        }
        if (allowRole.includes(response.data.role)) {
          console.log("Logged in");
          localStorage.setItem("userData", JSON.stringify(response.data));
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;

          response.data.canNotChangeOrg = ["Room Contributor", "Contributor"].includes(
            response.data.role
          );
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
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: "#3F478D",
              colorPrimaryActive: "#29306e",
              colorPrimaryBorder: "#8e96e0",
              colorPrimaryHover: "#5d65b0",
            },
          },
        }}
      >
        {user.email !== "" ? (
          <BrowserRouter>
            <Layout className="layout">
              <Header>
                <Navbar />
              </Header>
              <Content
                style={{
                  padding: "0 50px",
                }}
              >
                <div
                  className="site-layout-content"
                  style={{ background: "#FFF" }}
                >
                  <Routes>
                    {MenuItems.map((item, index) => {
                      if (!item.role.includes(user.role)) {
                        return undefined;
                      }
                      return (
                        <Route
                          key={index}
                          path={item.path}
                          element={item.element}
                        />
                      );
                    })}
                    <Route
                      path="*"
                      element={
                        <Navigate to={UserDefaultPage[user.role]} replace />
                      }
                    />
                  </Routes>
                </div>
              </Content>

              <Footer
                style={{
                  textAlign: "center",
                }}
              ></Footer>
            </Layout>
          </BrowserRouter>
        ) : (
          <LoginForm Login={Login} error={error} />
        )}
      </ConfigProvider>
    </UserContext.Provider>
  );
}

export default App;
