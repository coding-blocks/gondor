import React, { useState } from 'react';
import Navbar from 'Components/Navbar';
import Sidebar from 'Components/Sidebar';
import classNames from 'classnames';
import './style.scss';

const Dashboard = ({ children, data }) => {
  if (!data) return null;
  const [showSideBar, setSideBar] = useState(true);

  const toggleSideBar = () => {
    setSideBar(!showSideBar);
  };

  return (
    <div
      className={classNames('dashboard-layout', {
        'menu-default menu-sub-hidden': showSideBar,
        'menu-default menu-sub-hidden main-hidden': !showSideBar,
      })}>
      <Navbar toggleSideBar={toggleSideBar} />
      <Sidebar show={showSideBar} />
      <main>{children}</main>
    </div>
  );
};

export default Dashboard;
