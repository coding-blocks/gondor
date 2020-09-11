import paths from 'Paths';
import Head from 'next/head';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import QUERY from './query.graphql';
import AppMenu from 'Components/AppMenu';
import createPage from 'Utils/createPage';
import AppContent from 'Components/AppContent';
import Calendar, { COLOR_MODES } from 'Containers/Calendar';
import TeamMembers from 'Containers/TeamMembers';
import authHelper from 'Utils/authHelper';
import UserCard from 'Components/UserCard';
import { getSelectionOnSelect } from './utils';
import EventTypeFilter from 'Components/EventTypeFilter';
import TagsFilter from 'Components/TagsFilter';

const Planner = ({ loading, viewer, types: allTypes, router, refetch }) => {
  const [users, setUsers] = useState([viewer.user]);
  const [colorMode, setColorMode] = useState(COLOR_MODES.TAG);
  const [tags, setTags] = useState([]);
  const [types, setTypes] = useState([]);

  const calendar = (
    <Calendar
      filters={{ users, tags, types }}
      types={allTypes}
      colorMode={colorMode}
    />
  );

  return (
    <>
      <Head>
        <title>Planner | CodingBlocks</title>
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
                  <EventTypeFilter
                    types={allTypes}
                    selected={types}
                    onSelect={(type) =>
                      setTypes(
                        getSelectionOnSelect(
                          type,
                          types,
                          ({ name: id1 }, { name: id2 }) => id1 == id2,
                        ),
                      )
                    }
                    colorMode={colorMode}
                    onColorMoreSelect={setColorMode}
                  />
                  <TagsFilter
                    selected={tags}
                    onSelect={setTags}
                    colorMode={colorMode}
                    onColorMoreSelect={setColorMode}
                  />
                  <TeamMembers
                    selected={users}
                    scrollTarget={target}
                    showSelection
                    onSelect={(user) =>
                      setUsers(
                        getSelectionOnSelect(
                          user,
                          users,
                          ({ id: id1 }, { id: id2 }) => id1 === id2,
                        ),
                      )
                    }
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
  Component: Planner,
  query: QUERY,
  requireFeatures: ['calendar'],
  requireLogin: true,
  authorize: ({ viewer }) => authHelper.isMember(viewer),
});
