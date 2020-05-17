import React from 'react';
import './style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const PageNotFound = () => {
  return (
    <div className="col-8 col-centre text-center">
      <div className="heading">404</div>
      <h2>Page Not Found.</h2>
      <img src="/img/error-image.png" alt="404" />
    </div>
  );
};

export default PageNotFound;
