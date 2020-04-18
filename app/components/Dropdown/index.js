import React from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledButtonDropdown,
} from 'reactstrap';

const Dropdown = React.memo(
  ({ selected, options = [], onChange, className, color, size }) => (
    <div className={className}>
      <UncontrolledButtonDropdown className="dropdown">
        <DropdownToggle
          color={color || 'outline-dark'}
          size={size || 'xs'}
          caret>
          {selected.label}
        </DropdownToggle>
        <DropdownMenu>
          {options.map((option, index) => (
            <DropdownItem key={index} onClick={() => onChange(option)}>
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </div>
  ),
);

export default Dropdown;
