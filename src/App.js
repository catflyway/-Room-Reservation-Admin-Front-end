import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./conponents/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginForm from "./conponents/LoginForm";
import { MenuItems } from "./conponents/MenuItems";
import axios from "axios";
import { UserContext, UserDefaultPage } from "./user-context";
import { Layout, ConfigProvider, Spin, message } from "antd";
const { Header, Content, Footer } = Layout;

function App() {
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      setLoadingCount((state, props) => (state + 1))
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      setLoadingCount((state, props) => (state - 1))
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      setLoadingCount((state, props) => (state - 1))
      let msg = error.response?.data || error.response || error.message || error
      message.error(`${msg}`, 5)
      return Promise.reject(error);
    });
  }, []);

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

          response.data.canNotChangeOrg = [
            "Room Contributor",
            "Contributor",
          ].includes(response.data.role);
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
        <Spin size="large" tip="Loading..." spinning={loadingCount !== 0}>
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
        </Spin>
      </ConfigProvider>
    </UserContext.Provider>
  );
}

export default App;
