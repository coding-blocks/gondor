import { useState } from 'react';
import Form from 'Components/Form';
import { useMutation } from '@apollo/react-hooks';
import { formatErrors } from 'Utils/graphql';
import CREATE_ACCOUNT from 'Mutations/zoomAccountCreate.graphql';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const AddZoomAccount = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');

  const [addAccount, { error: rawErrors }] = useMutation(CREATE_ACCOUNT, {
    variables: {
      input: { email },
    },
    onCompleted: async (data) => {
      if (typeof onSuccess === 'function') await onSuccess(data);

      onClose();
    },
  });

  const errors = formatErrors(rawErrors);

  return (
    <>
      <ModalHeader>Add Zoom Account</ModalHeader>
      <ModalBody>
        <Form className="row" errors={errors}>
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Email</Form.Label>
            <Form.Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="mr-2" size="sm" color="gray" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" color="primary" onClick={() => addAccount()}>
          Add
        </Button>
      </ModalFooter>
    </>
  );
};

export default AddZoomAccount;
