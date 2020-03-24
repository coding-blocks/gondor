import React from 'react';
import Head from 'next/head';
import App from 'Pages/_app';
import { initApolloClient } from 'Apollo/client';

const defaultHandler = () => ({ props: {} });

export default Component => (
  getServerSideProps = defaultHandler,
) => async ctx => {
  const apolloClient = (ctx.apolloClient = initApolloClient({
    res: ctx.res,
    req: ctx.req,
  }));

  const { props: pageProps } = await getServerSideProps(ctx);

  if (typeof window === 'undefined') {
    if (ctx.res && ctx.res.finished) {
      return pageProps;
    }

    try {
      const { getDataFromTree } = await import('@apollo/react-ssr');

      await getDataFromTree(
        <App
          Component={Component}
          pageProps={{
            ...pageProps,
            apolloClient,
          }}
        />,
      );
    } catch (error) {
      console.error('Error while running `getDataFromTree`', error);
    }

    Head.rewind();
  }

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      ...pageProps,
      apolloState,
    },
  };
};
