import React from 'react';
import './style.scss';

const calenderMap = {
  OfflineClass: 'Offline Class',
  OnlineClass: 'Online Class',
  CourseRecording: 'Course Recording',
  OffSiteWorkshop: 'Off-Site Workshop',
  Meeting: 'Meeting',
  OOO: 'OOO',
  Youtube: 'Youtube',
  Other: 'Other',
};

const ColorsList = React.memo(({ colors }) => (
  <div className="row">
    {colors.map(({ name, color }) => (
      <div key={name} className="col-6 col-sm-12 mb-2 d-flex">
        <div className="color-box mr-2" style={{ backgroundColor: color }} />
        <span>{calenderMap[name]}</span>
      </div>
    ))}
  </div>
));

export default ColorsList;
