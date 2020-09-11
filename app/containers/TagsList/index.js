import { useState, useMemo } from 'react';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import useViewer from 'Hooks/useViewer';
import TagCard from 'Components/TagCard';
import { useQuery } from '@apollo/react-hooks';
import { ModalHeader, Input } from 'reactstrap';
import InfiniteScroll from 'Components/InfiniteScroll';
import TagLabel from 'Components/TagSelect/Label';

const TagsList = ({ onSelect, selected, scrollTarget, showSelection }) => {
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
      <ModalHeader className="mb-4">Tags</ModalHeader>
      <div className="search-sm mb-4">
        <Input
          type="text"
          name="search"
          placeholder="Search by tag title, code"
          onKeyPress={(e) => e.key === 'Enter' && setSearch(e.target.value)}
        />
      </div>
      {loading && <Loader relative />}
      {showSelection && (
        <div className="mb-4 d-flex flex-wrap">
          {selected.map((tag) => (
            <TagLabel
              className="mr-3 mb-2"
              key={tag.id}
              tag={tag}
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
          connectionPath="tags">
          {data.tags.edges.map(({ node: tag }) => (
            <TagCard
              key={tag.id}
              className={classNames('mb-4 pointer', {
                shadow: !!selected.find(({ id }) => id === tag.id),
              })}
              tag={tag}
              onClick={() => onSelect(tag)}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default TagsList;
