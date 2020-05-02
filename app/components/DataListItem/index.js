import { Card, CardBody, Button } from 'reactstrap';

const DataListItem = ({ zoomAccount, children }) => (
  <Card className="d-flex flex-row mb-4">
    <div className="d-flex flex-grow-1 min-width-zero">
      <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
        {children}
      </CardBody>
    </div>
  </Card>
);

export default DataListItem;
