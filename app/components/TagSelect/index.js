import { useState, memo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Form from 'Components/Form';
import QUERY from './query.graphql';
import Label from './Label';
import { extractNodes } from 'Utils/graphql';
import useModals from 'Hooks/useModals';
import './style.scss';

const TagSelect = ({
  name = 'tagsSelect',
  placeholder = 'Select tags.',
  isMulti = false,
  variables = {},
  value,
  onChange,
}) => {
  const [search, setSearch] = useState('');

  const { loading, data } = useQuery(QUERY, {
    variables: {
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
      search,
    },
  });

  const Modals = useModals();

  return (
    <Form.CreatableSelect
      className="tag-select"
      isSearchable
      name={name}
      isMulti={isMulti}
      inputValue={search}
      value={value}
      isLoading={loading}
      onChange={(selected) => {
        if (!selected) {
          return onChange([]);
        }

        const item = selected.pop();

        if (item.notPresent) {
          return Modals.AddTag.open({
            code: item.code,
            onSuccess: (savedItem) => onChange([...selected, savedItem]),
          });
        }

        selected.push(item);
        onChange(selected);
      }}
      getNewOptionData={(code) => ({ code, notPresent: true })}
      onInputChange={setSearch}
      getOptionLabel={(tag) => <Label key={tag.id} tag={tag} />}
      formatOptionLabel={(tag, { context }) => (
        <Label key={tag.id} tag={tag} full={context === 'menu'} />
      )}
      getOptionValue={(tag) => tag.id}
      filterOption={() => true}
      options={extractNodes(data, 'tags')}
      placeholder={placeholder}
    />
  );
};

export default TagSelect;
