import { memo } from 'react';
import { ModalHeader } from 'reactstrap';
import Form from 'Components/Form';
import TagSelect from 'Components/TagSelect';
import { COLOR_MODES } from 'Containers/Calendar';

const TagsFilter = memo(
  ({ selected, onSelect, colorMode, onColorMoreSelect }) => {
    return (
      <>
        <ModalHeader className="mb-4 filter-header">
          Tags
          <Form className="d-inline-block pointer">
            <Form.Input
              type="radio"
              name="colorMode"
              checked={colorMode === COLOR_MODES.TAG}
              onChange={() => onColorMoreSelect(COLOR_MODES.TAG)}
            />
          </Form>
        </ModalHeader>
        <Form className="row">
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Tags</Form.Label>
            <TagSelect
              isMulti
              name="tags"
              value={selected}
              placeholder="Select tags"
              onChange={onSelect}
            />
          </Form.Group>
        </Form>
      </>
    );
  },
);

export default TagsFilter;
