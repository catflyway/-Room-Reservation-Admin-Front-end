import React from "react";

export const UserLevel = {
    "Administrator": 100,
    "Contributor": 80,
    "Room Contributor": 60,
}

export const UserDefaultPage = {
    "Administrator": "/",
    "Contributor": "/",
    "Room Contributor": "/ManageReq",
}

export const UserContext = React.createContext();