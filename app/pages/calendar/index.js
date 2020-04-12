import Calendar from 'Containers/Calendar';
import withApollo from 'Decorators/withApollo';

export default Calendar;

export const getServerSideProps = withApollo(Calendar)();
