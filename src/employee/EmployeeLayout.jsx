import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "./EmployeeSidebar";
import "./EmployeeLayout.css";

const EmployeeLayout = () => {
  return (
    <div className="employee-layout">
      <EmployeeSidebar />

      <main className="employee-layout-content">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;