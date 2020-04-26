import { useState } from 'react';
import Head from 'next/head';
import QUERY from './query.graphql';
import AppMenu from 'Components/AppMenu';
import createPage from 'Utils/createPage';
import AppContent from 'Components/AppContent';
import Content from './Content';
import TeamMembers from './TeamMembers';

const Calendar = ({ viewer, eventTypeColors }) => {
  const [user, setUser] = useState(viewer.user);

  return (
    <>
      <Head>
        <title>Calendar | CodingBlocks</title>
      </Head>
      <AppContent>
        <Content user={user} viewer={viewer} colors={eventTypeColors} />
      </AppContent>
      <AppMenu>
        <AppMenu.Context.Consumer>
          {({ target }) => (
            <TeamMembers
              scrollTarget={target}
              viewer={viewer}
              setUser={setUser}
              selected={user}
            />
          )}
        </AppMenu.Context.Consumer>
      </AppMenu>
    </>
  );
};

export default createPage({
  Component: Calendar,
  query: QUERY,
});
