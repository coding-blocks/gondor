import { Badge } from 'reactstrap';

const ZoomAccountLabel = ({ account, showAvailability }) => (
  <div className="div-inline-flex">
    <span>{account.email}</span>
    {showAvailability && typeof account.availability === 'boolean' && (
      <div className="float-right">
        <Badge
          className="ml-2"
          pill
          color={account.availability ? 'success' : 'secondary'}>
          {account.availability ? 'Available' : 'Busy'}
        </Badge>
      </div>
    )}
  </div>
);

export default ZoomAccountLabel;
