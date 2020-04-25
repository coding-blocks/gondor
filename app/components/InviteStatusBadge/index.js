import { memo } from 'react';
import { Badge } from 'reactstrap';

const colors = {
  Pending: 'gray',
  Accepted: 'success',
  Declined: 'secondary',
  Requested: 'primary',
  Refused: 'secondary',
};

const InviteStatusBadge = memo(({ status, className }) => (
  <Badge className={className} pill color={colors[status]}>
    {status}
  </Badge>
));

export default InviteStatusBadge;
