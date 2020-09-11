import Planner from 'Containers/Planner';
import withApollo from 'Decorators/withApollo';

export default Planner;

export const getServerSideProps = withApollo(Planner)();
