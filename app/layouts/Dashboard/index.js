import React, { useState } from 'react';
import Navbar from 'Components/Navbar';
import Sidebar from 'Components/Sidebar';
import classNames from 'classnames';
import { withRouter } from 'next/router';
import './style.scss';

const Dashboard = ({ children, data, router, query }) => {
  const [showSideBar, setSideBar] = useState(true);

  if (!data) return null;

  const toggleSideBar = () => {
    setSideBar(!showSideBar);
  };

  const embedded = router.query.hasOwnProperty('embed');

  return (
    <div
      className={classNames('dashboard-layout', {
        'menu-default menu-sub-hidden': showSideBar,
        'menu-default menu-sub-hidden main-hidden': !showSideBar,
      })}>
      {!embedded && (
        <>
          <Navbar toggleSideBar={toggleSideBar} />
          <Sidebar show={showSideBar} />
        </>
      )}
      <main className={classNames({ embed: embedded })}>{children}</main>
    </div>
  );
};

export default withRouter(Dashboard);
