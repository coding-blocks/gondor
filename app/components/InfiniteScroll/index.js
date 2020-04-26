import { useEffect, useState } from 'react';
import { get } from 'Utils/graphql';
import Loader from 'Components/Loader';

let infiniteScrollCount = 0;

const InfiniteScroll = ({
  children,
  data,
  variables,
  fetchMore,
  target,
  connectionPath,
  fetchConnectionPath,
  updateConnectionPath,
}) => {
  const [loading, setLoading] = useState(false);
  const [wrapperId] = useState(`infinite-scroll-id-${infiniteScrollCount}`);
  const fcPath = fetchConnectionPath || connectionPath;
  const ucPath = updateConnectionPath || connectionPath;

  const performFetch = () => {
    const connection = get(data, fcPath);

    return connection.pageInfo.hasNextPage
      ? fetchMore({
          variables: { ...variables, after: connection.pageInfo.endCursor },
          updateQuery: (prev, { fetchMoreResult }) => {
            const prevConnection = get(prev, ucPath);
            const nextConnection = get(fetchMoreResult, fcPath);

            if (!nextConnection) return prevConnection;

            nextConnection.edges = [
              ...prevConnection.edges,
              ...nextConnection.edges,
            ];

            return fetchMoreResult;
          },
        })
          .then(() => setLoading(false))
          .catch(() => setLoading(false))
      : setLoading(false);
  };

  useEffect(() => {
    loading && performFetch();
  }, [loading]);

  useEffect(() => {
    infiniteScrollCount += 1;
    const ele = document.getElementById(target || wrapperId);

    const handleScroll = e => {
      const currentPos = ele.scrollTop;
      const maxPos = ele.scrollTopMax;

      if (!loading && currentPos / maxPos >= 0.8) {
        return setLoading(true);
      }
    };

    ele.addEventListener('scroll', handleScroll);

    return () => {
      ele.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id={wrapperId}>
      {children}
      {loading && <Loader relative />}
    </div>
  );
};

export default InfiniteScroll;
