import useModals from 'Hooks/useModals';
import createPage from 'Utils/createPage';
import QUERY from './query.graphql';
import { useEffect } from 'react';
import Head from 'next/head';

const Event = ({ router }) => {
  const { id_or_slug } = router.query;
  const Modals = useModals();

  useEffect(() => {
    Modals.ViewEvent.open({ id: id_or_slug, slug: id_or_slug });
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
  requireLogin: false,
  query: QUERY,
});
