import React from 'react';
import Navbar from 'Components/Navbar';
import Sidebar from 'Components/Sidebar';

import './style.scss';

const Dashboard = ({ children, data }) => {
  if (!data) return null;

  return (
    <div className="dashboard-layout">
      <Navbar viewer={data.viewer} />
      <Sidebar viewer={data.viewer} />
      <main>{children}</main>
    </div>
  );
};

export default Dashboard;
