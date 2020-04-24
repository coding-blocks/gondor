import { useContext } from 'react';
import { Input as BaseInput } from 'reactstrap';
import Form from './';

const Input = (props) => {
  const { errors } = useContext(Form.Context);

  return (
    <>
      <BaseInput {...props} invalid={errors && errors[props.name]} />
      <Form.ErrorMessage name={props.name} />
    </>
  );
};

export default Input;
