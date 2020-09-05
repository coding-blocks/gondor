import { memo, useMemo } from 'react';
import useViewer from 'Hooks/useViewer';
import Form from 'Components/Form';
import {
  getEventTypeOption,
  getEventTypeLabel,
} from 'Components/Calendar/utils';
import Select from 'Components/Select';
import UserSelect from 'Components/UserSelect';
import ZoomAccountSelect from 'Components/ZoomAccountSelect';

const EventForm = memo(
  ({
    errors,
    title,
    setTitle,
    description,
    setDescription,
    type,
    setType,
    types,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    isRequestable,
    setIsRequestable,
    autoAcceptRequests,
    setIsAutoAccept,
    isPublic,
    setIsPublic,
    slug,
    setSlug,
    showSlug,
    invites,
    setInvites,
    location,
    setLocation,
    zoomAccount,
    setZoomAccount,
  }) => {
    const viewer = useViewer();

    return (
      <Form errors={errors} className="row">
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label>Title</Form.Label>
          <Form.Input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label>Description</Form.Label>
          <Form.Input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        {showSlug && (
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Slug</Form.Label>
            <Form.Input
              type="text"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </Form.Group>
        )}
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label>Type</Form.Label>
          <Form.Select
            name="type"
            placeholder="Select Event Type"
            value={getEventTypeLabel(type)}
            onChange={({ value, title, color }) =>
              setType({ label: title, value, color })
            }
            options={useMemo(() => types.map(getEventTypeOption), [types])}
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-6">
          <Form.Label>Start At</Form.Label>
          <Form.DatePicker
            selected={new Date(startAt)}
            onChange={setStartAt}
            showTimeSelect
            dateFormat="Pp"
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-6">
          <Form.Label>End At</Form.Label>
          <Form.DatePicker
            selected={new Date(endAt)}
            onChange={setEndAt}
            showTimeSelect
            dateFormat="Pp"
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label>Invites</Form.Label>
          <UserSelect
            isMulti
            name="invites"
            value={invites}
            placeholder="Invite users"
            variables={{
              exclude: [viewer.user.id],
            }}
            availabilityStatusDuring={{
              start_at: startAt,
              end_at: endAt,
            }}
            onChange={setInvites}
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label>Zoom Account</Form.Label>
          <ZoomAccountSelect
            name="zoomAccount"
            value={zoomAccount}
            placeholder="Select account"
            availabilityStatusDuring={{
              start_at: startAt,
              end_at: endAt,
            }}
            onChange={setZoomAccount}
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label>Location</Form.Label>
          <Form.Input
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label className="ml-4 mt-2">Open</Form.Label>
          <Form.Input
            className="ml-1"
            type="checkbox"
            name="open"
            checked={isRequestable}
            value={isRequestable}
            onChange={() => setIsRequestable(!isRequestable)}
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label className="ml-4 mt-2">Auto Accept Requests</Form.Label>
          <Form.Input
            className="ml-1"
            type="checkbox"
            name="autoaccept"
            disabled={!isRequestable}
            checked={autoAcceptRequests && isRequestable}
            value={autoAcceptRequests && isRequestable}
            onChange={() => setIsAutoAccept(!autoAcceptRequests)}
          />
        </Form.Group>
        <Form.Group className="has-float-label mb-4 col-12">
          <Form.Label className="ml-4 mt-2">Public</Form.Label>
          <Form.Input
            className="ml-1"
            type="checkbox"
            name="public"
            checked={isPublic}
            value={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
        </Form.Group>
      </Form>
    );
  },
);

export default EventForm;
