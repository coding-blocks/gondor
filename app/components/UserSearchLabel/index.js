import Avatar from 'Components/Avatar';

const UserSearchLabel = ({ user }) => (
  <div className="div-inline-flex">
    <Avatar small user={user} className="small mr-2" />
    <span>
      {user.firstname} {user.lastname}
    </span>
  </div>
);

export default UserSearchLabel;
