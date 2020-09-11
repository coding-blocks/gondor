import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { getTagColor } from 'Components/TagSelect/utils';

const TagCard = React.memo(({ tag, className, onClick }) => (
  <Card className={className} onClick={onClick}>
    <CardBody>
      <div className="row">
        <div className="col-12 d-flex">
          <div
            className="color-box mr-2"
            style={{
              backgroundColor: getTagColor(tag),
              width: '40px',
              height: '40px',
            }}
          />
          <div>
            <h3 className="mb-0">{tag.code}</h3>
            <p className="mb-0">{tag.title}</p>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
));

export default TagCard;
