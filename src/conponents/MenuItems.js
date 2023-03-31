import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';

export const MenuItems = [
  {
    title: 'Calendar' ,
    path: '/',
    icon: <AiIcons.AiFillHome  size={25}/>,
    cName: 'nav-text'
  },
  {
    title: 'การจัดการผู้ใช้',
    path: '/ManageUser',
    icon: <FaIcons.FaUserCog size={25}/>,
    cName: 'nav-text'
  },
  {
    title: 'การจัดการห้อง',
    path: '/ManageRoom',
    icon: <MdIcons.MdRoomPreferences size={25} />,
    cName: 'nav-text'
  },
  {
    title: 'การจัดการคำขอ',
    path: '/ManageReq',
    icon: <FaIcons.FaBell  size={25}/>,
    cName: 'nav-text'
  },
  {
    title: 'การจัดการหน่วยงาน',
    path: '/BuildmanageAdmin',
    icon: <FaIcons.FaBuilding  size={25}/>,
    cName: 'nav-text'
  },
  {
    title: 'สถิติการใช้งาน',
    path: '/ChartJs',
    icon:  <FaIcons.FaChartBar  size={25}/>,
    cName: 'nav-text'
  },
  {
    title: 'Profile',
    path: '/Profile',
    icon:  <FaIcons.FaUser  size={25}/>,
    cName: 'nav-text'
  },
  
];