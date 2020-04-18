import React from 'react';
import Dropdown from 'Components/Dropdown';
import ColorsList from 'Components/ColorsList';
import { UncontrolledPopover as Popover, PopoverBody } from 'reactstrap';

export const defaultTypeFilter = {
  label: 'Any',
  value: undefined,
};

const Fitlers = React.memo(({ filters, types, onTypeChange }) => (
  <>
    <Dropdown
      className="d-inline-block mr-2"
      selected={{ label: `Event Type: ${filters.type.label}` }}
      options={[
        defaultTypeFilter,
        ...types.map(({ name, color }) => ({
          label: name,
          value: name,
          color,
        })),
      ]}
      onChange={onTypeChange}
    />
    <i
      id="event-type-colors-list-icon"
      className="simple-icon-info pointer"
      style={{ color: filters.type.color }}
    />
    <Popover
      trigger="hover"
      placement="bottom"
      target="event-type-colors-list-icon">
      <PopoverBody>
        <ColorsList colors={types} />
      </PopoverBody>
    </Popover>
  </>
));

export default Fitlers;
