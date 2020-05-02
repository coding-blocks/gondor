import { memo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Form from 'Components/Form';
import QUERY from './query.graphql';
import Label from './Label';

const ZoomAccountSelect = memo(
  ({
    name = 'zoomAccountSelect',
    placeholder = 'Select Zoom Account.',
    isMulti = false,
    variables = {},
    value,
    availabilityStatusDuring,
    onChange,
  }) => {
    const { loading, data } = useQuery(QUERY, {
      variables: {
        includeAvailability: !!availabilityStatusDuring,
        ...variables,
        availabilityDuring: availabilityStatusDuring,
      },
    });

    return (
      <Form.Select
        name={name}
        isMulti={isMulti}
        value={value}
        isLoading={loading}
        onChange={onChange}
        getOptionLabel={(account) => (
          <Label
            showAvailability={!!availabilityStatusDuring}
            account={account}
          />
        )}
        getOptionValue={(account) => account.id}
        filterOption={({ data }, search) =>
          console.log(data, search) || data.email.startsWith(search)
        }
        options={data?.zoomAccounts || []}
        placeholder={placeholder}
      />
    );
  },
);

export default ZoomAccountSelect;
