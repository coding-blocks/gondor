import Head from "next/head";
import withAuth from "Utils/withAuth";
import Dashboard from "Layouts/Dashboard";

const Home = ({ hello }) => (
  <>
    <Head>
      <title>Planner | CodingBlocks</title>
      <link rel="icon" href="/favicon.png" />
    </Head>
    <h1>{hello}</h1>
  </>
);

Home.layout = Dashboard;
Home.getInitialProps = withAuth(async () => ({ hello: "world" }));

export default Home;
