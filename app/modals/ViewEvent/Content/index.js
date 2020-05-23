import { memo, useMemo, useContext } from 'react';
import moment from 'moment';
import Auth from 'Services/Auth';
import useViewer from 'Hooks/useViewer';
import { useMutation } from '@apollo/react-hooks';
import AttendeesList from '../AttendeesList';
import AttendeeItem from '../AttendeesList/Item';
import InviteStatusBadge from 'Components/InviteStatusBadge';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
} from 'reactstrap';
import DECLINE_INVITE from 'Mutations/calendarEventInviteDecline.graphql';
import ACCEPT_INVITE from 'Mutations/calendarEventInviteAccept.graphql';
import REQUEST_INVITE from 'Mutations/calendarEventRequest.graphql';
import DELETE_EVENT from 'Mutations/calendarEventDelete.graphql';
import useModals from 'Hooks/useModals';
import ZoomAccountLabel from 'Components/ZoomAccountSelect/Label';

const EventContent = memo(({ event, onClose }) => {
  const viewer = useViewer();
  const Modals = useModals();

  const invite = useMemo(
    () => event.invites.find(({ user }) => user.id === viewer.user?.id),
    [event.invites, viewer.user],
  );

  const organiserInvite = useMemo(
    () =>
      event.invites.find((invite) => invite.user.id === event.organiser.id) || {
        status: 'Declined',
        user: event.organiser,
      },
    [event.invites, event.organiser],
  );

  const zoomAccount = useMemo(
    () =>
      event.resources.find(
        ({ subject: { __typename } }) => __typename === 'ZoomAccount',
      ),
    [event.resources],
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
        <div className="d-flex align-items-center justify-content-between">
          <span className="w-50 text-truncate" title={event.title}>
            {event.title}
          </span>
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
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="d-flex">
          <span className="w-100 mb-2 text-primary text-small">
            <a href={`/events/${event.slug}`}>/events/{event.slug}</a>
          </span>
        </div>
        <p>
          <strong>From:</strong>{' '}
          <span className="float-right">
            {moment(event.start_at).format('DD MMM YYYY, HH:MM A')}
          </span>
        </p>
        <p>
          <strong>To:</strong>{' '}
          <span className="float-right">
            {moment(event.end_at).format('DD MMM YYYY, HH:MM A')}
          </span>
        </p>
        <p>
          <strong>Organiser:</strong>
        </p>
        <AttendeeItem className="mb-4" invite={organiserInvite} event={event} />
        {!!event.invites?.length && (
          <>
            <p>
              <strong>Attendees:</strong>
            </p>
            <AttendeesList className="mb-4" event={event} />
          </>
        )}
        {event.description && (
          <>
            <p className="mb-0">
              <strong>Description:</strong>
            </p>
            <p>{event.description}</p>
          </>
        )}
        {zoomAccount && (
          <>
            <p className="mb-0">
              <strong>ZoomAccount:</strong>
            </p>
            <ZoomAccountLabel
              account={{
                ...zoomAccount.subject,
                availability: zoomAccount.availability,
              }}
              showAvailability
            />
          </>
        )}
        {event.location && (
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        )}
        {event.is_open && (
          <Badge color="primary" pill>
            Open
          </Badge>
        )}
        {event.is_public && (
          <Badge className="ml-1" color="primary" pill>
            Public
          </Badge>
        )}
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
          event.is_open && (
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
          )
        )}
      </ModalFooter>
    </>
  );
});

export default EventContent;
