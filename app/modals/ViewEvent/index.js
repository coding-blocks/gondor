import { useEffect } from 'react';
import Content from './Content';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import createPage from 'Utils/createPage';
import { Modal, ModalBody } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';
import { removeFromCache, pushToCache } from 'Utils/graphql';

const ViewEvent = ({ id, onClose, event, startPolling, stopPolling }) => {
  useEffect(() => {
    stopPolling();
    startPolling(1000);

    return () => stopPolling();
  }, [id]);

  if (!event) {
    return (
      <Modal isOpen={true} size="sm" toggle={() => onClose()}>
        <ModalBody>
          <p className="text-center">No Event Found.</p>
        </ModalBody>
      </Modal>
    );
  }

  const queryData = { query: QUERY, variables: { id, slug } };

  return (
    <Modal isOpen={true} size="sm" toggle={() => onClose()}>
      <Content event={{ ...event }} onClose={onClose} />
    </Modal>
  );
};

export default createPage({
  Component: ViewEvent,
  query: QUERY,
  variables: ({ id, slug }) => ({ id, slug }),
  LoaderComponent: ({ onClose }) => (
    <Modal isOpen={true} size="sm" toggle={() => onClose()}>
      <ModalBody>
        <Loader relative />
      </ModalBody>
    </Modal>
  ),
});
