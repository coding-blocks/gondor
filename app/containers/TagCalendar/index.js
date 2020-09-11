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
import TagsList from 'Containers/TagsList';
import authHelper from 'Utils/authHelper';
import TagCard from 'Components/TagCard';

const TagCalendar = ({ loading, viewer, tag, types, router, refetch }) => {
  useEffect(() => {
    if (loading) return;

    if (!tag || tag.slug === router.query.tagSlug) return;

    refetch({
      variables: {
        tagSlug: router.query.tagSlug,
      },
    });
  }, [router.asPath]);

  const calendar = (
    <Calendar
      filters={{ tags: tag ? [tag] : [] }}
      types={types}
      colorMode={COLOR_MODES.TYPE}
    />
  );

  return (
    <>
      <Head>
        <title>{tag?.title || '404'} Calendar | CodingBlocks</title>
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
                  {tag && (
                    <TagCard
                      className={classNames('mb-4 pointer', {
                        shadow: true,
                      })}
                      tag={tag}
                    />
                  )}
                  <TagsList
                    scrollTarget={target}
                    onSelect={({ slug }) =>
                      Router.push(...paths.tags.calendar({ slug }))
                    }
                    selected={tag ? [tag] : []}
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
  Component: TagCalendar,
  query: QUERY,
  variables: ({ router }) => ({
    tagSlug: router.query.tagSlug,
  }),
  isPublic: true,
  requireLogin: false,
});
