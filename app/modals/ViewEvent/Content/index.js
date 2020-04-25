import { useMemo } from 'react';
import useViewer from 'Hooks/useViewer';
import { useMutation } from '@apollo/react-hooks';
import AttendeesList from '../AttendeesList';
import AttendeeItem from '../AttendeesList/Item';
import InviteStatusBadge from 'Components/InviteStatusBadge';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import DECLINE_INVITE from './declineInvite.graphql';

const EventContent = ({ event }) => {
  const viewer = useViewer();

  const invite = useMemo(
    () => event.invites.find(({ user }) => user.id === viewer.user?.id),
    [event.invites, viewer.user],
  );

  const organiserInvite = useMemo(
    () =>
      event.invites.find(invite => invite.user.id === event.organiser.id) || {
        status: 'Declined',
        user: event.organiser,
      },
    [event.invites, event.organiser],
  );

  const isOrganiser = event.organiser.id === viewer.user?.id;

  const [declineInvite] = useMutation(DECLINE_INVITE, {
    updateQueries: {
      invites: (prev, { mutationResult }) =>
        prev.filter(id => id !== mutationResult.declinedInvite?.id),
    },
  });

  return (
    <>
      <ModalHeader className="w-100">
        {event.title}
        <span className="float-right text-small">
          {invite && <InviteStatusBadge status={invite.status} />}
          {isOrganiser && (
            <i className="simple-icon-trash text-muted hover-primary ml-2" />
          )}
        </span>
      </ModalHeader>
      <ModalBody>
        {event.description && <p>{event.description}</p>}
        <p>
          <strong>Organiser:</strong>
        </p>
        <AttendeeItem className="mb-4" invite={organiserInvite} event={event} />
        <p>
          <strong>Attendees:</strong>
        </p>
        <AttendeesList event={event} />
      </ModalBody>
      <ModalFooter>
        {invite ? (
          <>
            {['Pending', 'Accepted'].includes(invite.status) && (
              <Button
                className="m-0 ml-2"
                size="sm"
                color="secondary"
                onClick={() =>
                  declineInvite({
                    variables: { id: invite.id },
                    optimisticResponse: { declinedInvite: invite },
                  })
                }>
                Decline
              </Button>
            )}
            {['Pending', 'Declined'].includes(invite.status) && (
              <Button className="m-0 ml-2" size="sm" color="primary">
                Accept
              </Button>
            )}
          </>
        ) : (
          <Button className="m-0 ml-2" size="sm" color="primary">
            Join
          </Button>
        )}
      </ModalFooter>
    </>
  );
};

export default EventContent;
