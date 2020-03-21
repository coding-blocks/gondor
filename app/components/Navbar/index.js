import React from "react";
import Link from "next/link";
import { Button } from "reactstrap";

import Auth from "Services/Auth";

import "./style.scss";

const Navbar = ({ viewer }) => {
  return (
    <nav className="navbar fixed-top p-none">
      <div className="row w-100">
        <div className="col-4">
          <div className="menu-button pointer d-md-block text-left">
            <svg className="main" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 17">
              <rect x="0.48" y="0.5" width="7" height="1" />
              <rect x="0.48" y="7.5" width="7" height="1" />
              <rect x="0.48" y="15.5" width="7" height="1" />
            </svg>
            <svg className="sub" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17">
              <rect x="1.56" y="0.5" width="16" height="1" />
              <rect x="1.56" y="7.5" width="16" height="1" />
              <rect x="1.56" y="15.5" width="16" height="1" />
            </svg>
          </div>
        </div>
        <div className="col-4 text-center">
          <Link href="/" passHref>
            <a className="navbar-logo d-none d-md-block">
              <img className="navbar-logo" src="/img/logo.png" />
            </a>
          </Link>
        </div>
        <div className="col-4 text-right">
          <div className="d-inline-block pointer">
            <Button color="primary" onClick={Auth.login}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
