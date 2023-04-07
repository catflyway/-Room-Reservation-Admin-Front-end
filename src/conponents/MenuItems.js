import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";

import Calendar from "../pages/Calendar";
import ManageUser from "../pages/User/ManageUser";
import ManageRoom from "../pages/Room/ManageRoom";
import ManageReq from "../pages/ManageReq/ManageReq";
import ManageOrganization from "../pages/Build/ManageOrganization";
import Chart from "../pages/Chart/ShowBar";
import Profile from "../Profile";

export const MenuItems = [
  {
    title: "Calendar",
    path: "/",
    icon: <AiIcons.AiFillHome size={25} />,
    element: <Calendar />,
    role: ["Administrator", "Contributor"],
  },
  {
    title: "การจัดการผู้ใช้",
    path: "/ManageUser",
    icon: <FaIcons.FaUserCog size={25} />,
    element: <ManageUser />,
    role: ["Administrator", "Contributor"],
  },
  {
    title: "การจัดการห้อง",
    path: "/ManageRoom",
    icon: <MdIcons.MdRoomPreferences size={25} />,
    element: <ManageRoom />,
    role: ["Administrator", "Contributor", "Room Contributor"],
  },
  {
    title: "การจัดการคำขอ",
    path: "/ManageReq",
    icon: <FaIcons.FaBell size={25} />,
    element: <ManageReq />,
    role: ["Administrator", "Contributor", "Room Contributor"],
  },
  {
    title: "การจัดการหน่วยงาน",
    path: "/BuildmanageAdmin",
    icon: <FaIcons.FaBuilding size={25} />,
    element: <ManageOrganization />,
    role: ["Administrator"],
  },
  {
    title: "สถิติการใช้งาน",
    path: "/ChartJs",
    icon: <FaIcons.FaChartBar size={25} />,
    element: <Chart />,
    role: ["Administrator", "Contributor", "Room Contributor"],
  },
  {
    title: "Profile",
    path: "/Profile",
    icon: <FaIcons.FaUser size={25} />,
    element: <Profile />,
    role: ["Administrator", "Contributor", "Room Contributor"],
  },
];
