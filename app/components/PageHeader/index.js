import React from 'react';
import classNames from 'classnames';
import { Collapse } from 'reactstrap';

import './style.scss';

const PageHeader = ({
  filters,
  heading,
  headingHidden,
  headingClassName,
  actionItems,
  style,
}) => (
  <>
    <div className="page-header" style={style}>
      <h1
        className={classNames(
          { 'not-visible': headingHidden },
          headingClassName,
        )}>
        {heading}
      </h1>
      {actionItems && <div className="action-items">{actionItems()}</div>}
    </div>
    {filters && (
      <div className="mb-2">
        <Collapse id="displayOptions" className="d-md-block">
          <div className="d-block d-md-inline-block">
            <div className="float-md-left">{filters()}</div>
          </div>
        </Collapse>
      </div>
    )}
    <div className="separator mb-5" />
  </>
);

export default PageHeader;
