import { memo } from 'react';
import classNames from 'classnames';
import useViewer from 'Hooks/useViewer';
import Avatar from 'Components/Avatar';
import { useMutation } from '@apollo/react-hooks';
import InviteStatusBadge from 'Components/InviteStatusBadge';
import CREATE_INVITE from 'Mutations/calendarEventInvite.graphql';
import DELETE_INVITE from 'Mutations/calendarEventInviteDelete.graphql';
import REFUSE_INVITE from 'Mutations/CalendarEventRequestRefuse.graphql';
import './style.scss';

const AttendeeItem = ({ className, showActions, event, invite }) => {
  const viewer = useViewer();
  const { organiser } = event;

  const [reInvite] = useMutation(CREATE_INVITE, {
    variables: { input: { event_id: event.id, user_ids: [invite.user.id] } },
  });

  const [deleteInvite] = useMutation(DELETE_INVITE, {
    variables: { id: invite.id },
  });

  const [refuseInvite] = useMutation(REFUSE_INVITE, {
    variables: { id: invite.id },
  });

  const canUpdate =
    viewer.user?.role === 'Admin' || organiser.id === viewer.user?.id;
  const actions = [];

  if (showActions && canUpdate) {
    switch (invite.status) {
      case 'Declined':
        actions.push(
          <i
            key="re-invite"
            onClick={() => reInvite()}
            className="simple-icon-refresh text-muted hover-primary"
          />,
        );
        break;
      case 'Requested':
        actions.push(
          <i
            key="accept-request"
            onClick={() => reInvite()}
            className="simple-icon-like text-muted hover-primary"
          />,
        );
        break;
    }

    actions.push(
      <i
        key={`delete-${invite.status}`}
        onClick={() =>
          invite.status === 'Requested' ? refuseInvite() : deleteInvite()
        }
        className="simple-icon-trash text-muted hover-primary ml-1"
      />,
    );
  }

  return (
    <div
      className={classNames('attendee-item', 'd-flex', className)}
      style={{ marginRight: showActions ? '-15px' : '0' }}>
      <Avatar small user={invite.user} className="small mr-2" />
      <span className="truncate">
        {invite.user.firstname} {invite.user.lastname}
      </span>
      <div className="text-right flex-1">
        <span style={{ marginRight: actions.length === 1 ? '20px' : '7px' }}>
          <InviteStatusBadge status={invite.status} />
        </span>
        {!!actions.length && <span className="actions-wrapper">{actions}</span>}
      </div>
    </div>
  );
};

export default AttendeeItem;
