import { memo } from 'react';
import { ModalHeader } from 'reactstrap';
import Form from 'Components/Form';
import { COLOR_MODES } from 'Containers/Calendar';

const EventTypeFilter = memo(
  ({ selected, onSelect, types, colorMode, onColorMoreSelect }) => {
    return (
      <>
        <ModalHeader className="mb-4 filter-header">
          Type
          <Form className="d-inline-block pointer">
            <Form.Input
              type="radio"
              name="colorMode"
              checked={colorMode === COLOR_MODES.TYPE}
              onChange={() => onColorMoreSelect(COLOR_MODES.TYPE)}
            />
          </Form>
        </ModalHeader>
        <Form className="row px-4">
          {types.map((type) => (
            <Form.Group className="d-flex align-items-center mb-0 col-6">
              <Form.Label className="d-flex align-items-center" check>
                <Form.Input type="checkbox" onChange={() => onSelect(type)} />
                <div
                  className="color-box mr-1"
                  style={{
                    backgroundColor: type.color,
                  }}
                />
                {type.title}
              </Form.Label>
            </Form.Group>
          ))}
        </Form>
      </>
    );
  },
);

export default EventTypeFilter;
