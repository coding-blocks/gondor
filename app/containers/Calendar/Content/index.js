import { useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import PageHeader from 'Components/PageHeader';
import { useQuery } from '@apollo/react-hooks';
import Calendar from 'Components/Calendar';
import extractMap from 'Utils/extractMap';
import Filters, { defaultTypeFilter } from './Filters';
import { Button } from 'reactstrap';

const Content = React.memo(({ viewer, user, colors }) => {
  const colorsMap = extractMap(colors, { label: 'name', value: 'color' });
  const [selectedType, setSelectedType] = useState(defaultTypeFilter);
  const [dateTimeRange, setDateTimeRange] = useState({
    start_at: moment()
      .startOf('month')
      .startOf('week'),
    end_at: moment()
      .endOf('month')
      .endOf('week'),
  });

  const variables = {
    attendees: user ? [user.id] : [],
    dateTimeRange,
    types: selectedType.value ? [selectedType.value] : [],
  };

  const { loading, error, data, fetchMore, reload } = useQuery(QUERY, {
    variables,
  });

  return (
    <>
      <PageHeader
        heading="Calendar"
        filters={() => (
          <Filters
            types={colors}
            filters={{ type: selectedType }}
            onTypeChange={setSelectedType}
          />
        )}
        actions={() => <Button color="primary">Add Event</Button>}
      />
      <Calendar
        selectable
        events={data?.events.edges.map(({ node }) => node) || []}
        tooltipAccessor={({ title, type }) => `[${type}] ${title}`}
        startAccessor={({ start_at }) => new Date(start_at)}
        endAccessor={({ end_at }) => new Date(end_at)}
        eventPropGetter={({ type }) => ({
          style: { backgroundColor: colorsMap[type] },
        })}
        onRangeChange={dates => {
          if (Array.isArray(dates)) {
            const date = dates[0].toString();
            return setDateTimeRange({ start_at: date, end_at: date });
          }

          return setDateTimeRange({ start_at: dates.start, end_at: dates.end });
        }}
      />
    </>
  );
});

export default Content;
