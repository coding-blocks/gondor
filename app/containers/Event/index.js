import useModals from 'Hooks/useModals';
import { useRouter } from 'next/router';
import createPage from 'Utils/createPage';
import QUERY from './query.graphql';
import { useEffect } from 'react';

const Event = () => {
  const { id_or_slug } = useRouter().query;
  const Modals = useModals();

  useEffect(() => {
    Modals.ViewEvent.open({ id: id_or_slug, slug: id_or_slug });
  }, [id_or_slug]);

  return (
    <>
      <div className="text-center">Event Page</div>
    </>
  );
};

export default createPage({
  Component: Event,
  query: QUERY,
});
