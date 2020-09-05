import { useState, useEffect, useContext, useMemo } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import PageHeader from 'Components/PageHeader';
import { useQuery } from '@apollo/react-hooks';
import Calendar from 'Components/Calendar';
import extractMap from 'Utils/extractMap';
import { Button } from 'reactstrap';
import useModals from 'Hooks/useModals';
import useViewer from 'Hooks/useViewer';
import authHelper from 'Utils/authHelper';
import { extractNodes } from 'Utils/graphql';
import { uniqueHexColor } from 'Utils/color';
import {
  getDefaultDateTimeRange,
  defaultTypeFilter,
} from 'Components/Calendar/utils';
import { COLOR_MODES, getEventStyles } from './utils';

export { COLOR_MODES };

const CalendarWrapper = React.memo(
  ({ heading, filters, viewedBy, colorMode = COLOR_MODES.TAG, types = [] }) => {
    const viewer = useViewer();
    const [dateTimeRange, setDateTimeRange] = useState(
      getDefaultDateTimeRange(),
    );

    const variables = useMemo(
      () => ({
        dateTimeRange,
        attendees: filters.users?.map(({ id }) => id) || [],
        tags: filters.tags?.map(({ id }) => id) || [],
        types: filters.types || [],
        inviteStatusForUser: viewedBy.id,
      }),
      [dateTimeRange, filters.users, filters.tags, filters.types, viewedBy],
    );

    const { data, startPolling, stopPolling } = useQuery(QUERY, { variables });

    useEffect(() => {
      stopPolling();
      startPolling(1000);

      return () => stopPolling();
    }, [variables]);

    const typeColorsMap = useMemo(
      () =>
        types.reduce((map, { name, color }) => {
          map[name] = color;
          return map;
        }, {}),

      [types],
    );

    const Modals = useModals();

    return (
      <>
        <PageHeader
          heading={heading || 'Calendar'}
          actions={() =>
            authHelper.isMember(viewer) && (
              <Button
                color="primary"
                onClick={() => Modals.AddEvent.open({ types })}>
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
          eventPropGetter={({ type, tags, inviteStatus }) =>
            getEventStyles({
              colorMode,
              type,
              tags,
              inviteStatus,
              typeColorsMap,
              viewedBy,
            })
          }
          onRangeChange={(dates) => {
            if (Array.isArray(dates)) {
              const date = dates[0].toString();
              return setDateTimeRange({ start_at: date, end_at: date });
            }

            return setDateTimeRange({
              start_at: dates.start,
              end_at: dates.end,
            });
          }}
          onSelectSlot={({ start, end }) =>
            authHelper.isMember(viewer) &&
            Modals.AddEvent.open({
              types,
              dateTimeRange: {
                start_at: start,
                end_at:
                  start === end ? moment(start).add(1, 'hour').format() : end,
              },
            })
          }
          onSelectEvent={(event) => Modals.ViewEvent.open({ id: event.id })}
        />
      </>
    );
  },
);

export default CalendarWrapper;
