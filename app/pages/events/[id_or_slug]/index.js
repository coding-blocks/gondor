import Event from 'Containers/Event';
import withApollo from 'Decorators/withApollo';

export default Event;

export const getServerSideProps = withApollo(Event)();
