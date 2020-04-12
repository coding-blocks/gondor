import { useState } from 'react';
import classNames from 'classnames';
import QUERY from './query.graphql';
import Loader from 'Components/Loader';
import PageHeader from 'Components/PageHeader';
import { useQuery } from '@apollo/react-hooks';
import Calendar from 'Components/Calendar';

const Content = React.memo(({ viewer, user }) => {
  const variables = {
    attendees: user ? [user.id] : [],
  };

  const { loading, error, data, fetchMore, reload } = useQuery(QUERY, {
    variables,
  });

  return (
    <>
      <PageHeader heading="Calendar" />
      <Calendar
        selectable
        events={
          data?.events.edges.map(({ node: { title, start_at, end_at } }) => ({
            title,
            start: start_at,
            end: end_at,
          })) || []
        }
      />
    </>
  );
});

export default Content;
