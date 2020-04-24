import { useQuery } from '@apollo/react-hooks';
import LoaderComponent from 'Components/Loader';
import Dashboard from 'Layouts/Dashboard';

const createPage = ({
  Component,
  Layout = Dashboard,
  query,
  variables,
  requireFeatures = [],
  requireLogin = true,
  //TODO(naman): add default loader
  Loader = LoaderComponent,
  //TODO(naman): add default error layout
  ErrorComponent = () => 'There was some error.',
}) => (props) => {
  const { loading, error, data, ...rest } = useQuery(query, { variables });

  let content;
  if (loading) {
    content = <Loader />;
  } else if (error) {
    content = <ErrorComponent error={error} />;
  } else if (requireLogin && !data.viewer.user) {
    //TODO(naman): add default access denied layout
    content = '';
  } else {
    content = <Component {...data} {...rest} {...props} />;
  }

  return (
    <Layout loading={loading} error={error} data={data}>
      {content}
    </Layout>
  );
};

export default createPage;
