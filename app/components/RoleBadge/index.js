import React from 'react';
import { Badge } from 'reactstrap';

const RoleBadge = React.memo(({ user, className }) => (
  <Badge
    className={className}
    pill
    color={user.role === 'Admin' ? 'primary' : 'light'}>
    {user.role}
  </Badge>
));

export default RoleBadge;
