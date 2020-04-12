import Head from 'next/head';
import createPage from 'Utils/createPage';
import QUERY from './query.graphql';

const HomePage = ({ viewer: { user } }) => (
  <>
    <Head>
      <title>Internal Tools | CodingBlocks</title>
    </Head>
    <h1>
      Welcome {user.firstname} {user.lastname}
    </h1>
  </>
);

export default createPage({
  Component: HomePage,
  query: QUERY,
});
