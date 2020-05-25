import { useState, useEffect, useContext, useMemo } from 'react';
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
import useModals from 'Hooks/useModals';
import useViewer from 'Hooks/useViewer';
import authHelper from 'Utils/authHelper';
import { extractNodes } from 'Utils/graphql';
import { getDefaultDateTimeRange, defaultTypeFilter } from '../utils';

const Content = React.memo(({ user }) => {
  const viewer = useViewer();
  const [selectedType, setSelectedType] = useState(defaultTypeFilter);
  const [dateTimeRange, setDateTimeRange] = useState(getDefaultDateTimeRange());

  const variables = useMemo(
    () => ({
      dateTimeRange,
      attendees: user ? [user.id] : [],
      types: selectedType.value ? [selectedType.value] : [],
      includeAll: false,
    }),
    [dateTimeRange, user, selectedType],
  );

  const { data, startPolling, stopPolling } = useQuery(QUERY, {
    variables: { ...variables, includeAll: true },
  });

  const colorsMap = useMemo(
    () => extractMap(data?.types, { label: 'name', value: 'color' }),
    [data?.types],
  );

  useEffect(() => {
    stopPolling();
    startPolling(1000);

    return () => stopPolling();
  }, [variables]);

  const Modals = useModals();
  const addEventProps = {
    types: data?.types,
  };

  return (
    <>
      <PageHeader
        heading="Calendar"
        filters={() => (
          <Filters
            types={data?.types}
            filters={{ type: selectedType }}
            onTypeChange={setSelectedType}
          />
        )}
        actions={() =>
          authHelper.isMember(viewer) && (
            <Button
              color="primary"
              onClick={() => Modals.AddEvent.open(addEventProps)}>
              Add Event
            </Button>
          )
        }
      />
      <Calendar
        popup
        selectable
        events={extractNodes(data, 'events')}
        startAccessor={({ start_at }) => new Date(start_at)}
        endAccessor={({ end_at }) => new Date(end_at)}
        eventPropGetter={({ type, inviteStatus }) => {
          const notAccepted =
            user.id === viewer.user?.id && inviteStatus !== 'Accepted';
          let style = {};

          if (notAccepted) {
            style = {
              borderColor: colorsMap[type],
              borderStyle: 'solid',
              borderWidth: '2px',
              marginBottom: '-1px',
              backgroundColor: 'transparent',
              color: '#303030',
            };

            if (inviteStatus === 'Declined')
              style.textDecoration = 'line-through';
          } else {
            style = {
              backgroundColor: colorsMap[type],
            };
          }

          return { style };
        }}
        onRangeChange={(dates) => {
          if (Array.isArray(dates)) {
            const date = dates[0].toString();
            return setDateTimeRange({ start_at: date, end_at: date });
          }

          return setDateTimeRange({ start_at: dates.start, end_at: dates.end });
        }}
        onSelectSlot={({ start, end }) =>
          authHelper.isMember(viewer) && 
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
        onSelectEvent={(event) => Modals.ViewEvent.open({ id: event.id })}
      />
    </>
  );
});

export default Content;
