import moment from 'moment';
import useViewer from 'Hooks/useViewer';
import { useState, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Form from 'Components/Events/Form';
import CREATE_EVENT from './calendarEventCreate.graphql';
import CREATE_INVITE from './calendarEventInvite.graphql';
import { combineErrors, formatErrors } from 'Utils/graphql';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const AddEvent = ({ dateTimeRange, types, onSuccess, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState({
    label: types[0].name,
    value: types[0].name,
    color: types[0].color,
  });
  const [invites, setInvites] = useState([]);

  /* NOTE(naman): an extra hour is added because
   * endOf returns HH:59, hence starOf is used*/
  const [startAt, setStartAt] = useState(
    dateTimeRange?.start_at || moment().add(1, 'hour').startOf('hour').format(),
  );
  const [endAt, setEndAt] = useState(
    dateTimeRange?.end_at || moment().add(2, 'hour').startOf('hour').format(),
  );

  const viewer = useViewer();

  const [inviteUsers, { error: createInviteErrors }] = useMutation(
    CREATE_INVITE,
    {
      onCompleted: async () => {
        await onSuccess();

        return onClose();
      },
    },
  );

  const [addEvent, { error: createEventErrors }] = useMutation(CREATE_EVENT, {
    variables: {
      input: {
        start_at: startAt,
        end_at: endAt,
        title,
        description,
        location,
        type: type.value,
      },
    },
    onCompleted: ({ event }) =>
      inviteUsers({
        variables: {
          input: { event_id: event.id, user_ids: invites.map(({ id }) => id) },
        },
      }),
  });

  const handleStartAtChange = value => {
    if (new Date(value) >= new Date(endAt)) {
      setEndAt(moment(value).add(1, 'hours').format());
    }

    return setStartAt(value);
  };

  const handleEndAtChange = value => {
    if (new Date(value) <= new Date(endAt)) {
      setStartAt(moment(value).subtract(1, 'hours').format());
    }

    return setEndAt(value);
  };

  const errors = useMemo(
    () =>
      combineErrors(
        ...[createEventErrors, createInviteErrors].map(err =>
          formatErrors(err),
        ),
      ),
    [createEventErrors, createInviteErrors],
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
    setInvites,
    location,
    setLocation,
  };

  return (
    <Modal isOpen={true} size="md">
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
    </Modal>
  );
};

export default AddEvent;
