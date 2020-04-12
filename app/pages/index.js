import HomePage from 'Containers/HomePage';
import withApollo from 'Decorators/withApollo';

export default HomePage;

export const getServerSideProps = withApollo(HomePage)();
