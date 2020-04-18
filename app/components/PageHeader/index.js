import React from 'react';
import classNames from 'classnames';
import { Collapse } from 'reactstrap';

import './style.scss';

const PageHeader = ({
  filters,
  heading,
  headingHidden,
  headingClassName,
  actions,
  style,
}) => (
  <>
    <div className="page-header" style={style}>
      <h1
        className={classNames(
          'pb-0',
          { 'not-visible': headingHidden },
          headingClassName,
        )}>
        {heading}
      </h1>
      {actions && <div className="action-items">{actions()}</div>}
    </div>
    {filters && (
      <div className="mb-2">
        <Collapse id="displayOptions" className="d-md-block">
          <div className="d-block d-md-inline-block">
            <div className="float-md-left d-flex header-filters-wrap">
              {filters()}
            </div>
          </div>
        </Collapse>
      </div>
    )}
    <div className="separator mb-5" />
  </>
);

export default PageHeader;
