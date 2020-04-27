import { useState } from 'react';
import useViewer from 'Hooks/useViewer';
import { useQuery } from '@apollo/react-hooks';
import Loader from 'Components/Loader';
import Dashboard from 'Layouts/Dashboard';

const inject = (obj, props) => (typeof obj === 'function' ? obj(props) : obj);

const createPage = ({
  Component,
  Layout = Dashboard,
  query,
  variables,
  requireFeatures = [],
  requireLogin = true,
  //TODO(naman): add default loader
  LoaderComponent = () => <Loader />,
  //TODO(naman): add default error layout
  ErrorComponent = () => 'There was some error.',
}) => (props) => {
  const [fetched, setFetched] = useState(false);
  const { loading, error, data, ...rest } = useQuery(inject(query, props), {
    variables: inject(variables, props),
    onCompleted: () => !fetched && setFetched(true),
  });

  const viewer = useViewer();

  let content;
  if (loading && !fetched) {
    content = <Loader {...props} />;
  } else if (error) {
    content = <ErrorComponent error={error} {...props} />;
  } else if (requireLogin && !viewer?.user) {
    //TODO(naman): add default access denied layout
    content = '';
  } else {
    content = <Component loading={loading} {...data} {...rest} {...props} />;
  }

  return (
    <Layout loading={loading} error={error} data={data}>
      {content}
    </Layout>
  );
};

export default createPage;
