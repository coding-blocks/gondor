import { useContext } from 'react';
import { FormFeedback } from 'reactstrap';
import Form from './';

const ErrorMessage = ({ name = '' }) => {
  const { errors } = useContext(Form.Context);

  return (
    errors &&
    (errors[name] || null) && (
      <FormFeedback valid={false}>{errors[name]}</FormFeedback>
    )
  );
};

export default ErrorMessage;
