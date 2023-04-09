import React, { useContext } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import { UserContext } from "../user-context";

const Navbar = () => {
  let user = useContext(UserContext);
  let location = useLocation();

  return (
    <Menu
      // theme="dark"
      mode="horizontal"
      style={{ justifyContent: "center" }}
      defaultSelectedKeys={[location.pathname]}
      items={MenuItems.map((item, _) => {
        if (!item.role.includes(user.role)) {
          return undefined;
        }
        return {
          key: item.path,
          label: <Link to={item.path}>{item.title}</Link>,
          icon: item.icon,
        };
      })}
    />
  );
};

export default Navbar;
