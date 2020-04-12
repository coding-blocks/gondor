import React from 'react';
import Head from 'next/head';
import NextApp from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import { initApolloClient } from 'Apollo/client';
import gql from 'graphql-tag';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

import 'Styles/theme/styles.scss';
import 'Styles/theme/iconsmind/style.scss';
import 'Styles/theme/simple-line-icons/css/simple-line-icons.css';

typeof window === 'undefined' ? (global.gql = gql) : (window.gql = gql);

const PageLayout = ({ children }) => children;

class App extends NextApp {
  render() {
    const {
      Component: Page,
      pageProps: { apolloClient, apolloState, ...pageProps },
    } = this.props;

    return (
      <ApolloProvider
        client={apolloClient || initApolloClient(undefined, apolloState)}>
        <Head>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Page {...pageProps}></Page>
      </ApolloProvider>
    );
  }
}

export default App;
