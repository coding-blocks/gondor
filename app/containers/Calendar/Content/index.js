import { useState, useContext, useMemo } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import PageHeader from 'Components/PageHeader';
import { useQuery } from '@apollo/react-hooks';
import Calendar from 'Components/Calendar';
import extractMap from 'Utils/extractMap';
import Filters from './Filters';
import { Button } from 'reactstrap';
import ModalsManager from 'Modals/Manager';
import { extractNodes } from 'Utils/graphql';
import { getDefaultDateTimeRange, defaultTypeFilter } from '../utils';

const Content = React.memo(({ viewer, user, colors }) => {
  const [selectedType, setSelectedType] = useState(defaultTypeFilter);
  const [dateTimeRange, setDateTimeRange] = useState(getDefaultDateTimeRange());
  const colorsMap = useMemo(
    () => extractMap(colors, { label: 'name', value: 'color' }),
    [colors],
  );

  const variables = {
    dateTimeRange,
    attendees: user ? [user.id] : [],
    types: selectedType.value ? [selectedType.value] : [],
  };

  const { data, refetch } = useQuery(QUERY, {
    variables,
  });

  const Modals = useContext(ModalsManager.Context);
  const addEventProps = {
    onSuccess: () => refetch(),
    types: colors,
  };

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
        actions={() => (
          <Button
            color="primary"
            onClick={() => Modals.AddEvent.open(addEventProps)}>
            Add Event
          </Button>
        )}
      />
      <Calendar
        selectable
        events={extractNodes(data, 'events')}
        tooltipAccessor={({ title, type }) => `[${type}] ${title}`}
        startAccessor={({ start_at }) => new Date(start_at)}
        endAccessor={({ end_at }) => new Date(end_at)}
        eventPropGetter={({ type }) => ({
          style: { backgroundColor: colorsMap[type] },
        })}
        onRangeChange={(dates) => {
          if (Array.isArray(dates)) {
            const date = dates[0].toString();
            return setDateTimeRange({ start_at: date, end_at: date });
          }

          return setDateTimeRange({ start_at: dates.start, end_at: dates.end });
        }}
        onSelectSlot={({ start, end }) =>
          Modals.AddEvent.open({
            ...addEventProps,
            dateTimeRange: {
              start_at: start,
              //NOTE(naman): start and end times are same on date selection
              end_at:
                start === end ? moment(start).add(1, 'hour').format() : end,
            },
          })
        }
      />
    </>
  );
});

export default Content;
