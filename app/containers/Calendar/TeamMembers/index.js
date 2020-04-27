import { useState } from 'react';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import UserCard from 'Components/UserCard';
import { useQuery } from '@apollo/react-hooks';
import { ModalHeader, Input } from 'reactstrap';
import InfiniteScroll from 'Components/InfiniteScroll';

const TeamMembers = ({ viewer, setUser, selected, scrollTarget }) => {
  const [search, setSearch] = useState('');
  const variables = { search, exclude: [viewer.user.id] };

  const { loading, error, data, fetchMore } = useQuery(QUERY, {
    variables,
  });

  return (
    <>
      <UserCard
        className={classNames('mb-4 pointer', {
          shadow: selected.id === viewer.user.id,
        })}
        user={viewer.user}
        onClick={() => setUser(viewer.user)}
      />
      {['Admin', 'Member'].includes(viewer.user.role) && (
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
