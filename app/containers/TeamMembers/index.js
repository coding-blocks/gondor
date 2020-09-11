import { useState, useMemo } from 'react';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import useViewer from 'Hooks/useViewer';
import UserCard from 'Components/UserCard';
import { useQuery } from '@apollo/react-hooks';
import { ModalHeader, Input } from 'reactstrap';
import InfiniteScroll from 'Components/InfiniteScroll';
import UserSearchLabel from 'Components/UserSearchLabel';

const TeamMembers = ({ onSelect, selected, scrollTarget, showSelection }) => {
  const viewer = useViewer();
  const [search, setSearch] = useState('');

  const variables = useMemo(
    () => ({
      search,
      exclude: selected.map(({ id }) => id),
    }),
    [search, selected],
  );

  const { loading, error, data, fetchMore } = useQuery(QUERY, { variables });

  return (
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
      {showSelection && (
        <div className="mb-4 d-flex flex-wrap">
          {selected.map((user) => (
            <UserSearchLabel
              className="mr-3 mb-2"
              key={user.id}
              user={user}
              onDeselect={onSelect}
              showDeselect
            />
          ))}
        </div>
      )}

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
                shadow: !!selected.find(({ id }) => id === user.id),
              })}
              user={user}
              onClick={() => onSelect(user)}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default TeamMembers;
