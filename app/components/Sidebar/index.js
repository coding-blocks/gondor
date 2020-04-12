import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { withRouter } from 'next/router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import extractFeaturesMap from 'Utils/extractFeaturesMap';
import './style.scss';

const navigation = ({ viewer }) => {
  const features = extractFeaturesMap(viewer);

  return [
    {
      name: 'Calendar',
      href: '/calendar/',
      match: /^\/calendar/,
      icon: 'iconsmind-Calendar-4',
      hidden: !features.calendar,
    },
  ];
};

const Sidebar = React.memo(
  withRouter(({ viewer, router }) => (
    <div className="sidebar">
      <div className="main-menu">
        <PerfectScrollbar
          option={{ suppressScrollX: true, wheelPropagation: false }}>
          <div className="scroll">
            <div className="scrollbar-container">
              <ul className="list-unstyled nav flex-column">
                {navigation({ viewer }).map(
                  ({ hidden, match, href, as, icon, name }) =>
                    !hidden && (
                      <li
                        key={name}
                        className={classNames('nav-item', {
                          active: router?.pathname.match(match),
                        })}>
                        <Link href={href} as={as}>
                          <a>
                            <i className={icon} /> <span>{name}</span>
                          </a>
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  )),
);

export default Sidebar;
