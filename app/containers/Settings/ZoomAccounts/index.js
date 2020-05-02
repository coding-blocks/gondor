import Head from 'next/head';
import QUERY from './query.graphql';
import useModals from 'Hooks/useModals';
import createPage from 'Utils/createPage';
import PageHeader from 'Components/PageHeader';
import { useMutation } from '@apollo/react-hooks';
import DataListItem from 'Components/DataListItem';
import DELETE_ACCOUNT from 'Mutations/zoomAccountDelete.graphql';
import { Button } from 'reactstrap';

const ZoomAccounts = ({ zoomAccounts: accounts, refetch }) => {
  const Modals = useModals();
  const [deleteAccount] = useMutation(DELETE_ACCOUNT, {
    onCompleted: () => refetch(),
  });

  return (
    <>
      <PageHeader
        heading="Zoom Accounts"
        actions={() => (
          <Button
            color="primary"
            onClick={() =>
              Modals.AddZoomAccount.open({ onSuccess: () => refetch() })
            }>
            Add Account
          </Button>
        )}
      />
      <Head>
        <title>Zoom Accounts | CodingBlocks</title>
      </Head>
      <div className="row">
        {accounts.map((account) => (
          <div key={account.id} className="col-12">
            <DataListItem>
              <div className="list-item-heading mb-1 truncate">
                {account.email}
              </div>
              <Button
                color="primary"
                size="xs"
                onClick={() =>
                  deleteAccount({ variables: { id: account.id } })
                }>
                Delete
              </Button>
            </DataListItem>
          </div>
        ))}
      </div>
    </>
  );
};

export default createPage({
  Component: ZoomAccounts,
  query: QUERY,
  requireFeatures: ['settings'],
});
