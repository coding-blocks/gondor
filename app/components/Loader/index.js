import React from 'react';
import classNames from 'classnames';

import './style.scss';

const Loader = ({ className = {}, relative, small }) => (
  <div className={classNames('loading', className, { relative, small })} />
);

export default Loader;
