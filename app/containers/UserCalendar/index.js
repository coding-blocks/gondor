import paths from 'Paths';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';
import classNames from 'classnames';
import QUERY from './query.graphql';
import AppMenu from 'Components/AppMenu';
import createPage from 'Utils/createPage';
import AppContent from 'Components/AppContent';
import Calendar, { COLOR_MODES } from 'Containers/Calendar';
import TeamMembers from 'Containers/TeamMembers';
import authHelper from 'Utils/authHelper';
import UserCard from 'Components/UserCard';

const UserCalendar = ({ loading, viewer, user, types, router, refetch }) => {
  const selectedUser = user || viewer.user;

  useEffect(() => {
    if (loading) return;

    if (user?.id === router.query.userId) return;

    refetch({
      variables: {
        includeUser: true,
        userId: router.query.userId,
      },
    });
  }, [router.asPath]);

  const calendar = (
    <Calendar
      filters={{ users: [selectedUser] }}
      types={types}
      viewedBy={selectedUser}
      colorMode={COLOR_MODES.TYPE}
    />
  );

  return (
    <>
      <Head>
        <title>{selectedUser.firstname}'s Calendar | CodingBlocks</title>
      </Head>

      {!authHelper.isMember(viewer) ? (
        <div className="row">
          <div className="col-12">{calendar}</div>
        </div>
      ) : (
        <>
          <AppContent>{calendar}</AppContent>
          <AppMenu>
            <AppMenu.Context.Consumer>
              {({ target }) => (
                <>
                  <UserCard
                    key={selectedUser.id}
                    className={classNames('mb-4 pointer', {
                      shadow: true,
                    })}
                    user={selectedUser}
                  />
                  <TeamMembers
                    scrollTarget={target}
                    onSelect={({ id }) =>
                      id === viewer.user.id
                        ? Router.push(...paths.me.calendar())
                        : Router.push(...paths.users.calendar({ id }))
                    }
                    selected={[selectedUser]}
                  />
                </>
              )}
            </AppMenu.Context.Consumer>
          </AppMenu>
        </>
      )}
    </>
  );
};

export default createPage({
  Component: UserCalendar,
  query: QUERY,
  variables: ({ router }) => ({
    includeUser: typeof router.query.userId !== 'undefined',
    userId: router.query.userId || 0,
  }),
  requireFeatures: ['calendar'],
  requireLogin: true,
  authorize: ({ viewer, router }) => {
    if (authHelper.isMember(viewer)) return true;

    if (typeof router.query.userId !== 'undefined') return false;

    return true;
  },
});
