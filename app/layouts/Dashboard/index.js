import React from "react";

import Navbar from "Components/Navbar";

import "./style.scss";

const Dashboard = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Dashboard;
