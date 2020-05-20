import { useState, useMemo } from 'react';
import Form from 'Components/Form';
import UserSelect from 'Components/UserSelect';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useRouter } from 'next/router';

const Impersonate = ({ onClose }) => {
  const router = useRouter();
  const [user, setUser] = useState('');

  const handleImpersonate = () => {
    const user_id = user.id;
    document.cookie = `iuid=${user_id}`;
    window.location = router.pathname;
  };

  return (
    <Modal isOpen={true} size="md">
      <ModalHeader>Impersonate</ModalHeader>
      <ModalBody>
        <Form className="row">
          <Form.Group className="has-float-label mb-4 col-12">
            <Form.Label>Impersonate</Form.Label>
            <UserSelect
              name="User"
              placeholder="User"
              value={user}
              onChange={setUser}
            />
          </Form.Group>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="mr-2" size="sm" color="gray" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" color="primary" onClick={handleImpersonate}>
          Impersonate
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default Impersonate;
