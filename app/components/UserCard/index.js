import React from 'react';
import { Card, CardBody } from 'reactstrap';
import Avatar from 'Components/Avatar';
import RoleBadge from 'Components/RoleBadge';

const UserCard = React.memo(({ user, className, onClick }) => (
  <Card className={className} onClick={onClick}>
    <CardBody>
      <div className="row">
        <div className="col-12 d-flex">
          <Avatar user={user} className="mr-2" />
          <div>
            <h3 className="mb-0">
              {user.firstname} {user.lastname}
            </h3>
            <RoleBadge user={user} />
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
));

export default UserCard;
