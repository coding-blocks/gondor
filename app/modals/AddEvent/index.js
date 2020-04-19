import moment from 'moment';
import useViewer from 'Hooks/useViewer';
import { useState, useEffect, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import DatePicker from 'react-datepicker';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import {
  getEventTypeOption,
  getEventTypeLabel,
} from 'Containers/Calendar/utils';
import Select from 'Components/Select';
import UserSelect from 'Components/UserSelect';
import CREATE_EVENT from './createEvent.graphql';

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

  const [addEvent] = useMutation(CREATE_EVENT, {
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
        <Form className="row">
          <FormGroup className="has-float-label mb-4 col-12">
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="has-float-label mb-4 col-12">
            <Label>Description</Label>
            <Input
              type="text"
              name="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="has-float-label mb-4 col-12">
            <Label>Type</Label>
            <Select
              name="type"
              placeholder="Select Event Type"
              value={getEventTypeLabel(type)}
              onChange={({ value, color }) =>
                setType({ label: value, value, color })
              }
              options={useMemo(() => types.map(getEventTypeOption), [types])}
            />
          </FormGroup>
          <FormGroup className="has-float-label mb-4 col-6">
            <Label>Start At</Label>
            <DatePicker
              selected={new Date(startAt)}
              onChange={handleStartAtChange}
              showTimeSelect
              dateFormat="Pp"
            />
          </FormGroup>
          <FormGroup className="has-float-label mb-4 col-6">
            <Label>End At</Label>
            <DatePicker
              selected={new Date(endAt)}
              onChange={handleEndAtChange}
              minDate={new Date(startAt)}
              showTimeSelect
              dateFormat="Pp"
            />
          </FormGroup>
          <FormGroup className="has-float-label mb-4 col-12">
            <Label>Invites</Label>
            <UserSelect
              isMulti
              name="invites"
              placeholder="Invite invites"
              variables={{ exclude: [viewer.user.id] }}
              onChange={setInvites}
            />
          </FormGroup>
          <FormGroup className="has-float-label mb-4 col-12">
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </FormGroup>
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
