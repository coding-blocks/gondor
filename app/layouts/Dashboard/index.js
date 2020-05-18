import React from 'react';
import Navbar from 'Components/Navbar';
import Sidebar from 'Components/Sidebar';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import './style.scss';

const Dashboard = ({ children, data }) => {
  const router = useRouter();
  if (!data) return null;

  const isEmbed = router.query.hasOwnProperty('embed');

  return (
    <div className="dashboard-layout">
      {!isEmbed && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}
      <main className={classNames({ embed: isEmbed })}>{children}</main>
    </div>
  );
};

export default Dashboard;
