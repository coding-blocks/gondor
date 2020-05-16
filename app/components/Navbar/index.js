import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Auth from 'Services/Auth';
import Avatar from 'Components/Avatar';
import useViewer from 'Hooks/useViewer';

import './style.scss';

const Navbar = () => {
  const viewer = useViewer();
  const [showUserMenu, setUserMenu] = useState(false);

  return (
    <nav className="navbar fixed-top p-none">
      <div className="row w-100">
        <div className="col-4">
          <div className="menu-button pointer d-md-block text-left">
            <svg
              className="main"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 9 17">
              <rect x="0.48" y="0.5" width="7" height="1" />
              <rect x="0.48" y="7.5" width="7" height="1" />
              <rect x="0.48" y="15.5" width="7" height="1" />
            </svg>
            <svg
              className="sub"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 17">
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
        <div className="col-4 text-right text-avatar">
          <div className="d-inline-block pointer">
            {viewer?.user ? (
              <Dropdown
                isOpen={showUserMenu}
                toggle={() => setUserMenu(!showUserMenu)}>
                <DropdownToggle tag="div" aria-extended={showUserMenu}>
                  <div className="d-inline-block pointer">
                    <span className="mb-0 mr-2">
                      {viewer.user.firstname} {viewer.user.lastname}
                    </span>
                    <Avatar user={viewer.user} />
                  </div>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={Auth.logout}>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button color="primary" onClick={Auth.login}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
