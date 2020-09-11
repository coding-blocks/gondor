import { memo, useMemo, useContext } from 'react';
import paths from 'Paths';
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
import TagLabel from 'Components/TagSelect/Label';

const EventContent = memo(({ event, onClose, types }) => {
  const viewer = useViewer();
  const Modals = useModals();

  const invite = useMemo(
    () => event.invites.find(({ user }) => user.id === viewer.user?.id),
    [event.invites, viewer.user],
  );

  const type = useMemo(() => types.find(({ name }) => name === event.type), [
    event.type,
    types,
  ]);

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
          <span className="w-100 mb-2 text-small">
            <a
              className="text-primary"
              href={paths.events.calendar({ slug: event.slug })[1]}
              target="_blank">
              /events/{event.slug}
            </a>
          </span>
        </div>
        <div className="d-flex  align-items-center my-3 justify-content-between">
          <strong>Type:</strong>
          <span className="d-inline-flex ml-2">
            <div
              className="color-box mr-1"
              style={{
                backgroundColor: type.color,
              }}
            />
            {type.title}
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
        {event.invites?.length > 1 && (
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
        {!!event.tags.length && (
          <>
            <p>
              <strong>Tags:</strong>
            </p>
            {event.tags.map((tag) => (
              <a
                key={tag.id}
                className="hover-primary"
                href={paths.tags.calendar({ slug: tag.slug })[1]}
                target="_blank">
                <TagLabel tag={tag} full />
              </a>
            ))}
            <div className="mb-4" />
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

        {event.is_requestable && (
          <Badge color="primary" pill>
            Join Requests Allowed
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
          event.is_requestable && (
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
