import React from 'react';
import Head from 'next/head';
import NextApp from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import { initApolloClient } from 'Apollo/client';

import 'bootstrap/dist/css/bootstrap.min.css';

import 'Styles/theme/styles.scss';

const PageLayout = ({ children }) => children;

class App extends NextApp {
  render() {
    const {
      Component: Page,
      pageProps: { apolloClient, apolloState, ...pageProps },
    } = this.props;
    const Layout = Page.layout || PageLayout;
    Page.displayName = Page.displayName || Page.name || 'PageComponent';

    return (
      <ApolloProvider
        client={apolloClient || initApolloClient(undefined, apolloState)}>
        <Head>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Layout>
          <Page {...pageProps}></Page>
        </Layout>
      </ApolloProvider>
    );
  }
}

export default App;
