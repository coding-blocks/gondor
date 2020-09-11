import Avatar from 'Components/Avatar';
import classNames from 'classnames';
import { Badge } from 'reactstrap';
import './style.scss';

const UserSearchLabel = ({
  user,
  className,
  showAvailability,
  showDeselect,
  onDeselect,
}) => (
  <div className={classNames('d-inline-flex user-search-label', className)}>
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
    {showDeselect && (
      <i
        className="simple-icon-close ml-2 hover-primary"
        onClick={() => onDeselect(user)}
      />
    )}
  </div>
);

export default UserSearchLabel;
