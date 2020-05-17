import React from 'react';
import Navbar from 'Components/Navbar';
import Sidebar from 'Components/Sidebar';
import PageNotFound from 'Components/PageNotFound';

const Custom404 = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <PageNotFound />
    </div>
  );
};

export default Custom404;
