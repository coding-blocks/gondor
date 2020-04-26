import { useEffect } from 'react';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import Content from './Content';
import { Modal, ModalBody } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';
import { removeFromCache, pushToCache } from 'Utils/graphql';

const ViewEvent = ({ id, onClose }) => {
  const variables = { id };
  const { loading, data: { event } = {}, startPolling, stopPolling } = useQuery(
    QUERY,
    {
      variables,
    },
  );

  useEffect(() => {
    stopPolling();
    startPolling(1000);

    return () => stopPolling();
  }, [id]);

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

  const queryData = { query: QUERY, variables };

  return (
    <Modal isOpen={true} size="sm" toggle={() => onClose()}>
      <Content event={{ ...event }} onClose={onClose} />
    </Modal>
  );
};

export default ViewEvent;
