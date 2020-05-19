import React, { useState } from 'react';
import Navbar from 'Components/Navbar';
import Sidebar from 'Components/Sidebar';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import './style.scss';

const Dashboard = ({ children, data }) => {
  const router = useRouter();
  if (!data) return null;
  const [showSideBar, setSideBar] = useState(true);

  const toggleSideBar = () => {
    setSideBar(!showSideBar);
  };

  const isEmbed = router.query.hasOwnProperty('embed');

  return (
    <div
      className={classNames('dashboard-layout', {
        'menu-default menu-sub-hidden': showSideBar,
        'menu-default menu-sub-hidden main-hidden': !showSideBar,
      })}>
      {!isEmbed && (
        <>
          <Navbar toggleSideBar={toggleSideBar} />
          <Sidebar show={showSideBar} />
        </>
      )}
      <main className={classNames({ embed: isEmbed })}>{children}</main>
    </div>
  );
};

export default Dashboard;
