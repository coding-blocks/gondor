import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'next/router';

const Public = ({ children, data, router, query }) => {
  const embedded = router.query.hasOwnProperty('embed');

  if (!data) return null;

  return (
    <div>
      <main className={classNames({ embed: embedded })}>{children}</main>
    </div>
  );
};

export default withRouter(Public);
