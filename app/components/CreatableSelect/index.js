import classNames from 'classnames';
import { components } from 'react-select';
import ReactSelect from 'react-select/creatable';
import './style.scss';

const SelectInput = (props) => {
  var customProps = Object.assign({}, props);
  delete customProps.autoCorrect;
  delete customProps.autoCapitalize;
  return <components.Input {...customProps} />;
};

const CreatableSelect = ({ className, invalid, ...props }) => (
  <ReactSelect
    {...props}
    className={classNames(
      'custom-react-select',
      'react-select',
      'form-control',
      className,
      { 'is-invalid': invalid },
    )}
    classNamePrefix="react-select"
    components={{ Input: SelectInput }}
  />
);

export default CreatableSelect;
