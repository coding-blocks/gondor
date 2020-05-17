import React from 'react';
import './style.scss';

const PageNotFound = () => {
  return (
    <div className="text-center">
      <div className="heading">404</div>
      <h2>Page Not Found.</h2>
      <img src="/img/error-image.png" alt="404" />
    </div>
  );
};

export default PageNotFound;
