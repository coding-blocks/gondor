import { memo, useMemo } from 'react';
import Dropdown from 'Components/Dropdown';
import { UncontrolledPopover as Popover, PopoverBody } from 'reactstrap';
import {
  defaultTypeFilter,
  getEventTypeOption,
  getEventTypeLabel,
} from '../utils';

const Fitlers = memo(({ filters, types = [], onTypeChange }) => (
  <Dropdown
    className="d-inline-block mr-2"
    selected={getEventTypeLabel(filters.type, 'Event Type:')}
    options={useMemo(
      () => [defaultTypeFilter, ...types.map(getEventTypeOption)],
      [types],
    )}
    onChange={({ value,title,color }) =>
      onTypeChange({ label: title || defaultTypeFilter.label, value, color })
    }
  />
));

export default Fitlers;
