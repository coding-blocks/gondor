import { useState, memo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Form from 'Components/Form';
import QUERY from './query.graphql';
import UserSearchLabel from 'Components/UserSearchLabel';
import { extractNodes } from 'Utils/graphql';

const UserSelect = ({
  name = 'usersSelect',
  placeholder = 'Select users.',
  isMulti = false,
  variables = {},
  onChange,
}) => {
  const [search, setSearch] = useState('');

  const { loading, data } = useQuery(QUERY, {
    variables: {
      includeAvailability: !!variables.availableDuring,
      limit: 10,
      ...variables,
      search,
    },
  });

  return (
    <Form.Select
      isSearchable
      name={name}
      isMulti={isMulti}
      inputValue={search}
      isLoading={loading}
      onChange={onChange}
      onInputChange={setSearch}
      getOptionLabel={(user) => (
        <UserSearchLabel
          showAvailability={!!variables.availableDuring}
          user={user}
        />
      )}
      getOptionValue={(user) => user.id}
      filterOption={() => true}
      options={extractNodes(data, 'users')}
      placeholder={placeholder}
    />
  );
};

export default UserSelect;
