import { useState } from 'react';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import UserCard from 'Components/UserCard';
import { useQuery } from '@apollo/react-hooks';
import { ModalHeader } from 'reactstrap';

const TeamMembers = ({ viewer, setUser, selected }) => {
  const [search, setSearch] = useState('');
  const variables = { search, exclude: [viewer.user.id] };

  const { loading, error, data, fetchMore, reload } = useQuery(QUERY, {
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
      <ModalHeader className="mb-4">Team Members</ModalHeader>
      {loading && <Loader relative />}
      {data &&
        data.users.edges.map(({ node: user }) => (
          <UserCard
            key={user.id}
            className={classNames('mb-4 pointer', {
              shadow: selected.id === user.id,
            })}
            user={user}
            onClick={() => setUser(user)}
          />
        ))}
    </>
  );
};

export default TeamMembers;
