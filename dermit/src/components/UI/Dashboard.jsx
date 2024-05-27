import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "../Header/NavBar";

export default function Dashboard() {


  return (
    <div>
      <NavBar/>
      <ToastContainer />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}