import { useMemo } from 'react';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import Content from './Content';
import { Modal, ModalBody } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';

const ViewEvent = ({ id, onClose }) => {
  const { loading, data: { event } = {} } = useQuery(QUERY, {
    variables: { id },
  });

  if (!event) {
    return (
      <Modal isOpen={true} size="sm" toggle={() => onClose()}>
        <ModalBody>
          {loading ? (
            <Loader relative />
          ) : (
            <p className="text-center">No Event Found.</p>
          )}
        </ModalBody>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} size="sm" toggle={() => onClose()}>
      <Content event={event} />
    </Modal>
  );
};

export default ViewEvent;
