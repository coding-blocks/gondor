import React from "react";
import NextApp from "next/app";

import "bootstrap/dist/css/bootstrap.min.css";

import "Styles/theme/styles.scss";

const PageLayout = ({ children }) => children;

class App extends NextApp {
  render() {
    const { Component: Page, pageProps } = this.props;
    const Layout = Page.layout || PageLayout;

    return (
      <Layout>
        <Page {...pageProps}></Page>
      </Layout>
    );
  }
}

export default App;
