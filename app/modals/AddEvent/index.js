import moment from 'moment';
import useViewer from 'Hooks/useViewer';
import { useState, useEffect, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import {
  getEventTypeOption,
  getEventTypeLabel,
} from 'Containers/Calendar/utils';
import Select from 'Components/Select';
import UserSelect from 'Components/UserSelect';
import CREATE_EVENT from './createEvent.graphql';
import Form from 'Components/Form';
import { formatErrors } from 'Utils/graphql';

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
    dateTimeRange?.start_at ||
      moment()
        .add(1, 'hour')
        .startOf('hour')
        .format(),
  );
  const [endAt, setEndAt] = useState(
    dateTimeRange?.end_at ||
      moment()
        .add(2, 'hour')
        .startOf('hour')
        .format(),
  );

  const viewer = useViewer();

  const [addEvent, { error: rawError }] = useMutation(CREATE_EVENT, {
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
    onCompleted: async () => {
      await onSuccess();

      return onClose();
    },
  });

  const errors = formatErrors(rawError);

  const handleStartAtChange = value => {
    if (new Date(value) >= new Date(endAt)) {
      setEndAt(
        moment(value)
          .add(1, 'hours')
          .format(),
      );
    }

    return setStartAt(value);
  };

  const handleEndAtChange = value => {
    if (new Date(value) <= new Date(endAt)) {
      setStartAt(
        moment(value)
          .subtract(1, 'hours')
          .format(),
      );
    }

    return setEndAt(value);
  };

  return (
    <Modal isOpen={true} size="md">
      <ModalHeader>Add Event</ModalHeader>
      <ModalBody>
        <Form errors={errors} className="row">
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Title</Form.Label>
            <Form.Input
              type="text"
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Description</Form.Label>
            <Form.Input
              type="text"
              name="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              placeholder="Select Event Type"
              value={getEventTypeLabel(type)}
              onChange={({ value, color }) =>
                setType({ label: value, value, color })
              }
              options={useMemo(() => types.map(getEventTypeOption), [types])}
            />
          </Form.Group>
          <Form.Group className="has-float-label mb-4 col-6">
            <Form.Label>Start At</Form.Label>
            <Form.DatePicker
              selected={new Date(startAt)}
              onChange={handleStartAtChange}
              showTimeSelect
              dateFormat="Pp"
            />
          </Form.Group>
          <Form.Group className="has-float-label mb-4 col-6">
            <Form.Label>End At</Form.Label>
            <Form.DatePicker
              selected={new Date(endAt)}
              onChange={handleEndAtChange}
              showTimeSelect
              dateFormat="Pp"
            />
          </Form.Group>
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Invites</Form.Label>
            <UserSelect
              isMulti
              name="invites"
              placeholder="Invite invites"
              variables={{ exclude: [viewer.user.id] }}
              onChange={setInvites}
            />
          </Form.Group>
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Location</Form.Label>
            <Form.Input
              type="text"
              name="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </Form.Group>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="mr-2" color="gray" onClick={onClose}>
          Close
        </Button>
        <Button color="primary" onClick={addEvent}>
          Add
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddEvent;
