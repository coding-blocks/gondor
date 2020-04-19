import React from 'react';
import classNames from 'classnames';

import './style.scss';

const Avatar = ({
  id,
  className,
  user = {},
  firstname,
  lastname,
  text,
  shadow,
  small,
}) =>
  user.photo ? (
    <img
      id={id}
      className={classNames(
        'img-round user-avatar',
        { shadow, small },
        className,
      )}
      src={user.photo}
      alt={`${user.firstname} ${user.lastname}`}
    />
  ) : (
    <div
      id={id}
      className={classNames(
        'user-avatar d-inline-block',
        { shadow },
        className,
      )}>
      {text
        ? (text[0] || '').toUpperCase()
        : ((user.firstname || firstname)[0] || '').toUpperCase() +
          ((user.lastname || lastname)[0] || '').toUpperCase()}
    </div>
  );

export default Avatar;
