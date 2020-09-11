import useModals from 'Hooks/useModals';
import createPage from 'Utils/createPage';
import QUERY from './query.graphql';
import { useEffect } from 'react';
import useViewer from 'Hooks/useViewer';
import Head from 'next/head';

const Event = ({ router, types }) => {
  const { id_or_slug } = router.query;
  const Modals = useModals();

  useEffect(() => {
    !Modals.ViewEvent.isOpen() &&
      Modals.ViewEvent.open({ id: id_or_slug, slug: id_or_slug, types });
  }, [id_or_slug]);

  return (
    <>
      <Head>
        <title>Event | CodingBlocks</title>
      </Head>
    </>
  );
};

export default createPage({
  Component: Event,
  query: QUERY,
  isPublic: true,
  requireLogin: false,
});
