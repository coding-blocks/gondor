import Form from './';
import classNames from 'classnames';
import { useContext } from 'react';
import BaseDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = props => {
  const { errors } = useContext(Form.Context);

  return (
    <>
      <BaseDatePicker {...props} />
      <div
        className={classNames({ 'is-invalid': errors && errors[props.name] })}
      />
      <Form.ErrorMessage name={props.name} />
    </>
  );
};

export default DatePicker;
