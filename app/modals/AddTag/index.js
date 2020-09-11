import { useState } from 'react';
import Form from 'Components/Form';
import { useMutation } from '@apollo/react-hooks';
import { formatErrors } from 'Utils/graphql';
import CREATE_TAG from 'Mutations/tagCreate.graphql';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const AddTag = ({ code: codeInput, onSuccess, onClose }) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState((codeInput || '').toUpperCase());

  const [addTag, { error: rawErrors }] = useMutation(CREATE_TAG, {
    variables: {
      input: { title, code },
    },
    onCompleted: async (data) => {
      if (typeof onSuccess === 'function') await onSuccess(data.tag);

      onClose();
    },
  });

  const errors = formatErrors(rawErrors);

  return (
    <>
      <ModalHeader>Add Tag</ModalHeader>
      <ModalBody>
        <Form className="row" errors={errors}>
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Title</Form.Label>
            <Form.Input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Code</Form.Label>
            <Form.Input
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </Form.Group>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="mr-2" size="sm" color="gray" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" color="primary" onClick={() => addTag()}>
          Add
        </Button>
      </ModalFooter>
    </>
  );
};

export default AddTag;
