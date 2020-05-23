import moment from 'moment';
import QUERY from './query.graphql';
import { useState, useMemo } from 'react';
import Form from 'Components/Events/Form';
import extractMap from 'Utils/extractMap';
import createPage from 'Utils/createPage';
import { useMutation } from '@apollo/react-hooks';
import useCombinedErrors from 'Hooks/useCombinedErrors';
import UPDATE_EVENT from 'Mutations/calendarEventUpdate.graphql';
import CREATE_INVITE from 'Mutations/calendarEventInvite.graphql';
import DELETE_INVITE from 'Mutations/calendarEventInviteDelete.graphql';
import CREATE_RESOURCE from 'Mutations/resourceCreate.graphql';
import DELETE_RESOURCE from 'Mutations/resourceDelete.graphql';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const EditEvent = ({ loading, onClose, types, event }) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [type, setType] = useState(
    useMemo(
      () => ({
        label: types.find(({ name }) => name === event.type).title,,
        value: event.type,
        color: types.find(({ name }) => name === event.type).color,
      }),
      [event.type, types],
    ),
  );
  const [invites, setInvites] = useState(
    useMemo(
      () =>
        event.invites
          .filter((invite) => invite.user.id !== event.organiser.id)
          .map(({ user, availability }) => ({ ...user, availability })),
      [event.invites],
    ),
  );
  const zoomAccountResource = useMemo(
    () =>
      event.resources.find(
        ({ subject: { __typename } }) => __typename === 'ZoomAccount',
      ),
    [event.resources],
  );
  const [zoomAccount, setZoomAccount] = useState({
    ...zoomAccountResource?.subject,
    availability: zoomAccountResource?.availability,
  });

  const [startAt, setStartAt] = useState(event.start_at);
  const [endAt, setEndAt] = useState(event.end_at);

  const [isOpen, setIsOpen] = useState(event.is_open);
  const [isPublic, setIsPublic] = useState(event.is_public);

  const [inviteUsers, { error: createInviteErrors }] = useMutation(
    CREATE_INVITE,
  );

  const [deleteInvite, { error: deleteInviteErrors }] = useMutation(
    DELETE_INVITE,
  );

  const [createResource, { errors: createResourceErrors }] = useMutation(
    CREATE_RESOURCE,
  );
  const [deleteResource, { errors: deleteResourceErrors }] = useMutation(
    DELETE_RESOURCE,
  );

  const [updateEvent, { error: updateEventErrors }] = useMutation(
    UPDATE_EVENT,
    {
      variables: {
        id: event.id,
        input: {
          start_at: startAt,
          end_at: endAt,
          is_open: isOpen,
          is_public: isPublic,
          title,
          description,
          location,
          type: type.value,
        },
      },
      onCompleted: async () => {
        const prevInvites = extractMap(event.invites, {
          label: 'user.id',
          value: 'status',
        });
        const nextInvites = extractMap(invites, {
          label: 'id',
          value: 'username',
        });

        const invitesRemoved = event.invites.filter(
          ({ user: { id } }) => id !== event.organiser.id && !nextInvites[id],
        );
        const invitesAdded = invites.filter(
          ({ id }) => id !== event.organiser.id && !prevInvites[id],
        );

        let zoomAccountActions = [];
        const zoomAccountChanged =
          zoomAccountResource?.subject.id !== zoomAccount?.id;

        if (zoomAccountChanged) {
          if (!!zoomAccountResource)
            zoomAccountActions.push(
              deleteResource({ variables: { id: zoomAccountResource.id } }),
            );

          if (!!zoomAccount)
            zoomAccountActions.push(
              createResource({
                variables: {
                  input: {
                    subject_type: 'ZoomAccount',
                    subject_id: zoomAccount.id,
                    topic_type: 'CalendarEvent',
                    topic_id: event.id,
                  },
                },
              }),
            );
        }

        try {
          await Promise.all([
            inviteUsers({
              variables: {
                input: {
                  event_id: event.id,
                  user_ids: invitesAdded.map(({ id }) => id),
                },
              },
            }),
            Promise.all(
              invitesRemoved.map((invite) =>
                deleteInvite({
                  variables: { id: invite.id },
                }),
              ),
            ),
            Promise.all(zoomAccountActions),
          ]);

          return onClose();
        } catch (err) {
          return;
        }
      },
    },
  );

  const handleStartAtChange = (value) => {
    if (new Date(value) >= new Date(endAt)) {
      setEndAt(moment(value).add(1, 'hours').format());
    }

    return setStartAt(value);
  };

  const handleEndAtChange = (value) => {
    if (new Date(value) <= new Date(endAt)) {
      setStartAt(moment(value).subtract(1, 'hours').format());
    }

    return setEndAt(value);
  };

  const errors = useCombinedErrors(
    updateEventErrors,
    createInviteErrors,
    deleteInviteErrors,
  );

  const formProps = {
    errors,
    title,
    setTitle,
    description,
    setDescription,
    type,
    types,
    setType,
    startAt,
    setStartAt: handleStartAtChange,
    endAt,
    setEndAt: handleEndAtChange,
    isOpen,
    setIsOpen,
    isPublic,
    setIsPublic,
    invites,
    setInvites,
    location,
    setLocation,
    zoomAccount,
    setZoomAccount,
  };

  return (
    <Modal isOpen={true} size="md">
      <ModalHeader>Edit Event</ModalHeader>
      <ModalBody>{!loading && <Form {...formProps} />}</ModalBody>
      <ModalFooter>
        <Button className="mr-2" size="sm" color="gray" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" color="primary" onClick={() => updateEvent()}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default createPage({
  Component: EditEvent,
  query: QUERY,
  variables: ({ id }) => ({ id }),
});
