import paths from 'Paths';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';
import QUERY from './query.graphql';
import AppMenu from 'Components/AppMenu';
import createPage from 'Utils/createPage';
import AppContent from 'Components/AppContent';
import Content from './Content';
import TeamMembers from './TeamMembers';
import authHelper from 'Utils/authHelper';

const UserCalendar = ({ loading, viewer, user, router, refetch }) => {
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

  return (
    <>
      <Head>
        <title>Calendar | CodingBlocks</title>
      </Head>
      {!authHelper.isMember(viewer) ? (
        <>
          <div className="row">
            <div className="col-12">
              <Content user={selectedUser} />
            </div>
          </div>
        </>
      ) : (
        <>
          <AppContent>
            <Content user={selectedUser} />
          </AppContent>
          <AppMenu>
            <AppMenu.Context.Consumer>
              {({ target }) => (
                <TeamMembers
                  scrollTarget={target}
                  setUser={({ id }) =>
                    id === viewer.user.id
                      ? Router.push(...paths.me.calendar())
                      : Router.push(...paths.users.calendar({ id }))
                  }
                  selected={selectedUser}
                />
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
