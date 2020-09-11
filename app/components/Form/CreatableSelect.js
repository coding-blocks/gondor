import { useContext } from 'react';
import BaseSelect from 'Components/CreatableSelect';
import Form from './';

const CreatableSelect = (props) => {
  const { errors } = useContext(Form.Context);

  return (
    <>
      <BaseSelect {...props} invalid={errors && errors[props.name]} />
      <Form.ErrorMessage name={props.name} />
    </>
  );
};

export default CreatableSelect;
