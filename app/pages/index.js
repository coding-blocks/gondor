import Head from 'next/head';
import connect from 'Utils/connect';
import withLayout from 'Decorators/withLayout';
import withApollo from 'Decorators/withApollo';
import Dashboard from 'Layouts/Dashboard';

const HomePage = withLayout(Dashboard)(({ hello }) => (
  <>
    <Head>
      <title>Internal Tools | CodingBlocks</title>
    </Head>
    <h1>{hello}</h1>
  </>
));

export const getServerSideProps = withApollo(HomePage)(() => ({
  props: { hello: 'Hello' },
}));

export default HomePage;
