import React from 'react';
import paths from 'Paths';
import Link from 'next/link';
import classNames from 'classnames';
import { withRouter } from 'next/router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import extractMap from 'Utils/extractMap';
import useViewer from 'Hooks/useViewer';
import './style.scss';

const navigation = ({ viewer }) => {
  const features = extractMap(viewer, {
    key: 'features',
    label: 'name',
    value: 'enabled',
  });

  return [
    {
      name: 'Calendar',
      href: paths.me.calendar()[0],
      match: /^\/(me\/calendar|users\/[^\/]*\/calendar)/,
      icon: 'iconsmind-Calendar-4',
      hidden: !features.calendar,
    },
    {
      name: 'Zoom-accounts',
      href: '/settings/zoom-accounts',
      match: /^\/settings\/zoom-accounts/,
      icon: 'iconsmind-Cinema',
      hidden: !features.settings,
    },
  ];
};

const Sidebar = React.memo(
  withRouter(({ router, show }) => {
    const viewer = useViewer();

    return (
      <div className="sidebar">
        <div
          className={classNames('main-menu', {
            'main-hidden': show,
          })}>
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}>
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
    );
  }),
);

export default Sidebar;
