import React from 'react';
import './style.scss';

const ErrorHandle = () => (
  <div className="err-message">
    <h2>
      There was some error.{' '}
      <a href="/" class="orange">
        Back to Home
      </a>
    </h2>
    <img
      src="https://minio.codingblocks.com/amoeba/404-image-min.png"
      alt="Error"></img>
  </div>
);

export default ErrorHandle;
