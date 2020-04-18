import React from 'react';
import Dropdown from 'Components/Dropdown';

export const defaultTypeFilter = {
  label: 'Any',
  value: undefined,
};

const Fitlers = React.memo(({ filters, types, onTypeChange }) => (
  <Dropdown
    selected={{ label: `Event Type: ${filters.type.label}` }}
    options={[
      defaultTypeFilter,
      ...types.map(({ name }) => ({ label: name, value: name })),
    ]}
    onChange={onTypeChange}
  />
));

export default Fitlers;
