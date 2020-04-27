import Avatar from 'Components/Avatar';
import { Badge } from 'reactstrap';

const UserSearchLabel = ({ user, showAvailability }) => (
  <div className="div-inline-flex">
    <Avatar small user={user} className="small mr-2" />
    <span>
      {user.firstname} {user.lastname}
    </span>
    {showAvailability && typeof user.availability === 'boolean' && (
      <div className="float-right">
        <Badge
          className="mt-1 ml-2"
          pill
          color={user.availability ? 'success' : 'secondary'}>
          {user.availability ? 'Available' : 'Busy'}
        </Badge>
      </div>
    )}
  </div>
);

export default UserSearchLabel;
