import Calendar from 'Containers/UserCalendar';
import withApollo from 'Decorators/withApollo';

export default Calendar;

export const getServerSideProps = withApollo(Calendar)();
