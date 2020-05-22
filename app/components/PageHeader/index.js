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
      <div>
        <div id="displayOptions" className="d-md-block">
          <div className="d-block d-md-inline-block">
            <div className="float-md-left d-flex header-filters-wrap">
              {filters()}
            </div>
          </div>
        </div>
      </div>
    )}
    <div className="separator mt-2 mb-5" />
  </>
);

export default PageHeader;
