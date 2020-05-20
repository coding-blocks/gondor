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
  value,
  availabilityStatusDuring,
  onChange,
}) => {
  const [search, setSearch] = useState('');

  const { loading, data } = useQuery(QUERY, {
    variables: {
      includeAvailability: !!availabilityStatusDuring,
      limit: 5,
      ...variables,
      exclude: [
        ...(variables.exclude || []),
        ...(value
          ? isMulti
            ? value.map(({ id }) => id) || []
            : [value.id]
          : []),
      ],
      availabilityDuring: availabilityStatusDuring || {
        start_at: 0,
        end_at: 0,
      },
      search,
    },
  });

  return (
    <Form.Select
      isSearchable
      name={name}
      isMulti={isMulti}
      inputValue={search}
      value={value}
      isLoading={loading}
      onChange={onChange}
      onInputChange={setSearch}
      getOptionLabel={(user) => (
        <UserSearchLabel
          showAvailability={!!availabilityStatusDuring}
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
