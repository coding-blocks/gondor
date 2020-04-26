import { useMemo, useContext } from 'react';
import Auth from 'Services/Auth';
import useViewer from 'Hooks/useViewer';
import { useMutation } from '@apollo/react-hooks';
import AttendeesList from '../AttendeesList';
import AttendeeItem from '../AttendeesList/Item';
import InviteStatusBadge from 'Components/InviteStatusBadge';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import DECLINE_INVITE from 'Mutations/calendarEventInviteDecline.graphql';
import ACCEPT_INVITE from 'Mutations/calendarEventInviteAccept.graphql';
import REQUEST_INVITE from 'Mutations/calendarEventRequest.graphql';
import DELETE_EVENT from 'Mutations/calendarEventDelete.graphql';
import ModalsManager from 'Modals/Manager';

const EventContent = ({ event, onClose }) => {
  const viewer = useViewer();
  const Modals = useContext(ModalsManager.Context);

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

  const canUpdate =
    viewer.user?.role === 'Admin' || event.organiser.id === viewer.user?.id;

  const [declineInvite] = useMutation(DECLINE_INVITE);

  const [acceptInvite] = useMutation(ACCEPT_INVITE);

  const [requestInvite] = useMutation(REQUEST_INVITE);

  const [deleteEvent] = useMutation(DELETE_EVENT, {
    variables: { id: event.id },
    onCompleted: () => onClose(),
  });

  return (
    <>
      <ModalHeader className="w-100">
        {event.title}
        <span className="float-right text-small">
          {canUpdate && (
            <>
              <i
                title="Edit"
                className="simple-icon-pencil text-muted hover-primary mr-2"
                onClick={() => Modals.EditEvent.open({ id: event.id })}
              />
              <i
                title="Delete"
                className="simple-icon-trash text-muted hover-primary mr-2"
                onClick={() => deleteEvent()}
              />
            </>
          )}
          {invite && <InviteStatusBadge status={invite.status} />}
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
                    optimisticresponse: {
                      declinedinvite: { ...invite, status: 'Declined' },
                    },
                  })
                }>
                Decline
              </Button>
            )}
            {['Pending', 'Declined'].includes(invite.status) && (
              <Button
                className="m-0 ml-2"
                size="sm"
                color="primary"
                onClick={() =>
                  acceptInvite({
                    variables: { id: invite.id },
                    optimisticResponse: {
                      acceptedInvite: { ...invite, status: 'Accepted' },
                    },
                  })
                }>
                Accept
              </Button>
            )}
          </>
        ) : (
          <Button
            className="m-0 ml-2"
            size="sm"
            color="primary"
            onClick={() =>
              viewer.user
                ? requestInvite({
                    variables: { input: { event_id: event.id } },
                  })
                : Auth.login()
            }>
            Join
          </Button>
        )}
      </ModalFooter>
    </>
  );
};

export default EventContent;
