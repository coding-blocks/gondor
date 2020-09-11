import { useEffect } from 'react';
import Content from './Content';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import useViewer from 'Hooks/useViewer';
import authHelper from 'Utils/authHelper';
import createPage from 'Utils/createPage';
import { Modal, ModalBody } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';
import { removeFromCache, pushToCache } from 'Utils/graphql';

const ViewEvent = ({
  id,
  slug,
  onClose,
  event,
  startPolling,
  stopPolling,
  types,
}) => {
  const viewer = useViewer();

  useEffect(() => {
    stopPolling();
    if (!authHelper.isMember(viewer)) return;
    startPolling(1000);

    return () => stopPolling();
  }, [id]);

  if (!event) {
    return (
      <ModalBody>
        <p className="text-center">No Event Found.</p>
      </ModalBody>
    );
  }

  const queryData = { query: QUERY, variables: { id: id, slug: slug } };

  return <Content event={{ ...event }} onClose={onClose} types={types} />;
};

export default createPage({
  Component: ViewEvent,
  query: QUERY,
  variables: ({ id, slug }) => ({ id, slug }),
  isPublic: true,
  requireLogin: false,
  Layout: null,
  LoaderComponent: ({ onClose }) => (
    <ModalBody>
      <Loader relative />
    </ModalBody>
  ),
});
