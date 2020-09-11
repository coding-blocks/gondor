import moment from 'moment';
import { useState, useMemo } from 'react';
import Form from 'Components/Events/Form';
import { useMutation } from '@apollo/react-hooks';
import useCombinedErrors from 'Hooks/useCombinedErrors';
import CREATE_EVENT from 'Mutations/calendarEventCreate.graphql';
import CREATE_INVITE from 'Mutations/calendarEventInvite.graphql';
import ASSIGN_TAG from 'Mutations/assignTag.graphql';
import CREATE_RESOURCE from 'Mutations/resourceCreate.graphql';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const AddEvent = ({ dateTimeRange, types, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState({
    label: types[0].title,
    value: types[0].name,
    color: types[0].color,
  });
  const [invites, setInvites] = useState([]);
  const [zoomAccount, setZoomAccount] = useState();
  const [tags, setTags] = useState([]);

  /* NOTE(naman): an extra hour is added because
   * endOf returns HH:59, hence starOf is used*/
  const [startAt, setStartAt] = useState(
    dateTimeRange?.start_at || moment().add(1, 'hour').startOf('hour').format(),
  );
  const [endAt, setEndAt] = useState(
    dateTimeRange?.end_at || moment().add(2, 'hour').startOf('hour').format(),
  );

  const [isRequestable, setIsRequestable] = useState(false);
  const [autoAcceptRequests, setIsAutoAccept] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const [inviteUsers, { error: createInviteErrors }] = useMutation(
    CREATE_INVITE,
  );

  const [assignTag, { error: assignTagErrors }] = useMutation(ASSIGN_TAG);

  const [createZoomAccount, { error: createZoomAccountErrors }] = useMutation(
    CREATE_RESOURCE,
  );

  const [addEvent, { error: createEventErrors }] = useMutation(CREATE_EVENT, {
    variables: {
      input: {
        start_at: startAt,
        end_at: endAt,
        auto_accept_requests: autoAcceptRequests,
        is_requestable: isRequestable,
        is_public: isPublic,
        title,
        description,
        location,
        type: type.value,
      },
    },
    onCompleted: async ({ event }) => {
      await Promise.all([
        inviteUsers({
          variables: {
            input: {
              event_id: event.id,
              user_ids: invites.map(({ id }) => id),
            },
          },
        }),
        await Promise.all(
          tags.map((tag) =>
            assignTag({
              variables: { input: { event_id: event.id, tag_id: tag.id } },
            }),
          ),
        ),
        zoomAccount &&
          createZoomAccount({
            variables: {
              input: {
                subject_type: 'ZoomAccount',
                subject_id: zoomAccount?.id,
                topic_type: 'CalendarEvent',
                topic_id: event.id,
              },
            },
          }),
      ]);

      return onClose();
    },
  });

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
    createEventErrors,
    createInviteErrors,
    createZoomAccountErrors,
    assignTagErrors,
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
    isRequestable,
    setIsRequestable,
    autoAcceptRequests,
    setIsAutoAccept,
    isPublic,
    setIsPublic,
    invites,
    setInvites,
    location,
    setLocation,
    zoomAccount,
    setZoomAccount,
    tags,
    setTags,
  };

  return (
    <>
      <ModalHeader>Add Event</ModalHeader>
      <ModalBody>
        <Form {...formProps} />
      </ModalBody>
      <ModalFooter>
        <Button className="mr-2" size="sm" color="gray" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" color="primary" onClick={addEvent}>
          Add
        </Button>
      </ModalFooter>
    </>
  );
};

export default AddEvent;
