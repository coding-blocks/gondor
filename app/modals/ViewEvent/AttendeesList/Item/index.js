import { memo } from 'react';
import classNames from 'classnames';
import useViewer from 'Hooks/useViewer';
import Avatar from 'Components/Avatar';
import InviteStatusBadge from 'Components/InviteStatusBadge';
import './style.scss';

const AttendeeItem = ({ className, showActions, event, invite }) => {
  const viewer = useViewer();
  const { organiser } = event;

  const isOrganiser = organiser.id === viewer.user?.id;

  const actions = [];

  if (showActions && isOrganiser) {
    switch (invite.status) {
      case 'Declined':
        actions.push(
          <i
            key="re-invite"
            className="simple-icon-refresh text-muted hover-primary"
          />,
        );

      case 'Requested':
        actions.push(
          <i
            key="accept-request"
            classname="simple-icon-like text-muted hover-primary"
          />,
        );
        break;
    }

    actions.push(
      <i
        key={`delete-${invite.status}`}
        className="simple-icon-trash text-muted hover-primary ml-1"
      />,
    );
  }

  return (
    <div className={classNames('attendee-item', 'd-flex', className)}>
      <Avatar small user={invite.user} className="small mr-2" />
      <span className="truncate">
        {invite.user.firstname} {invite.user.lastname}
      </span>
      <div className="text-right flex-1">
        <span style={{ marginRight: actions.length === 1 ? '20px' : '7px' }}>
          <InviteStatusBadge status={invite.status} />
        </span>
        {!!actions.length && (
          <span className="actions-wrapper" style={{ marginRight: '-15px' }}>
            {actions}
          </span>
        )}
      </div>
    </div>
  );
};

export default AttendeeItem;
