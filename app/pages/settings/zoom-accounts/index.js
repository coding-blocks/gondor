import ZoomAccounts from 'Containers/Settings/ZoomAccounts';
import withApollo from 'Decorators/withApollo';

export default ZoomAccounts;

export const getServerSideProps = withApollo(ZoomAccounts)();
