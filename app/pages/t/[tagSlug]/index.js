import Calendar from 'Containers/TagCalendar';
import withApollo from 'Decorators/withApollo';

export default Calendar;

export const getServerSideProps = withApollo(Calendar)();
