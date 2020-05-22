import { useState, useMemo } from 'react';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import useViewer from 'Hooks/useViewer';
import UserCard from 'Components/UserCard';
import { useQuery } from '@apollo/react-hooks';
import { ModalHeader, Input } from 'reactstrap';
import InfiniteScroll from 'Components/InfiniteScroll';

const TeamMembers = ({ setUser, selected, scrollTarget }) => {
  const viewer = useViewer();
  const [search, setSearch] = useState('');
  const variables = { search, exclude: [viewer.user.id] };

  const { loading, error, data, fetchMore } = useQuery(QUERY, {
    variables,
  });

  const selectedVisible = useMemo(
    () =>
      selected.id === viewer.user.id ||
      !!data?.users.edges.find(({ node: user }) => user.id === selected.id),
    [viewer, data, selected],
  );

  return (
    <>
      <UserCard
        className={classNames('mb-4 pointer', {
          shadow: selected.id === viewer.user.id,
        })}
        user={viewer.user}
        onClick={() => setUser(viewer.user)}
      />
      {['Admin'].includes(viewer.user.role) && (
        <>
          <ModalHeader className="mb-4">Team Members</ModalHeader>
          <div className="search-sm mb-4">
            <Input
              type="text"
              name="search"
              placeholder="Search by username, email, name"
              onKeyPress={(e) => e.key === 'Enter' && setSearch(e.target.value)}
            />
          </div>
          {loading && <Loader relative />}
          {data && (
            <InfiniteScroll
              data={data}
              loading={loading}
              fetchMore={fetchMore}
              variables={variables}
              target={scrollTarget}
              connectionPath="users">
              {!selectedVisible && (
                <UserCard
                  key={selected.id}
                  className="mb-4 pointer shadow"
                  user={selected}
                />
              )}
              {data.users.edges.map(({ node: user }) => (
                <UserCard
                  key={user.id}
                  className={classNames('mb-4 pointer', {
                    shadow: selected.id === user.id,
                  })}
                  user={user}
                  onClick={() => setUser(user)}
                />
              ))}
            </InfiniteScroll>
          )}
        </>
      )}
    </>
  );
};

export default TeamMembers;
