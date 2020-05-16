import React from 'react';
import Head from 'next/head';
import NextApp from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import { initApolloClient } from 'Apollo/client';
import ModalsManager from 'Modals/Manager';
import ErrorHandle from 'Components/ErrorHandle';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'Styles/theme/styles.scss';
import 'Styles/theme/iconsmind/style.scss';
import 'Styles/theme/simple-line-icons/css/simple-line-icons.css';

const PageLayout = ({ children }) => children;

class App extends NextApp {
  state = {
    hasError: false,
  };

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    const {
      Component: Page,
      pageProps: { apolloClient, apolloState, ...pageProps },
    } = this.props;

    let { hasError } = this.state;
    hasError = true;

    return (
      <ApolloProvider
        client={apolloClient || initApolloClient(undefined, apolloState)}>
        <Head>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <ModalsManager>
          {hasError ? <ErrorHandle /> : <Page {...pageProps}></Page>}
        </ModalsManager>
      </ApolloProvider>
    );
  }
}

export default App;
