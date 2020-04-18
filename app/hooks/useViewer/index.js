import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/react-hooks';
import QUERY from './query.graphql';

const useViewer = () => {
  const client = useApolloClient();

  const { viewer } = client.readQuery({
    query: gql`
      ${QUERY}
    `,
  });

  return viewer;
};

export default useViewer;
