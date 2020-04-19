import { useContext } from 'react';
import BaseSelect from 'Components/Select';
import Form from './';

const Select = props => {
  const { errors } = useContext(Form.Context);

  return (
    <>
      <BaseSelect {...props} invalid={errors && errors[props.name]} />
      <Form.ErrorMessage name={props.name} />
    </>
  );
};

export default Select;
