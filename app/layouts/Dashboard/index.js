import React, { useState } from 'react';
import Navbar from 'Components/Navbar';
import Sidebar from 'Components/Sidebar';

import './style.scss';

const Dashboard = ({ children, data }) => {
  if (!data) return null;
  const [showSideBar, setSideBar] = useState(true);

  const toggleSideBar = () => {
    setSideBar(!showSideBar);
  };

  return (
    <div className="dashboard-layout">
      <Navbar handleSideBar={toggleSideBar} />
      {showSideBar && <Sidebar />}
      <main>{children}</main>
    </div>
  );
};

export default Dashboard;
