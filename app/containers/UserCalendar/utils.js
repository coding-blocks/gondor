import moment from 'moment';

export const defaultTypeFilter = {
  label: 'Any',
  value: undefined,
};

export const getDefaultDateTimeRange = () => ({
  start_at: moment().startOf('month').startOf('week').format(),
  end_at: moment().endOf('month').endOf('week').format(),
});
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

export const getEventTypeOption = ({ name, color }) => ({
  label: (
    <div className="d-inline-flex">
      <div className="color-box mr-2" style={{ backgroundColor: color }} />
      <span>{calenderMap[name]}</span>
    </div>
  ),
  value: name,
  color,
});

export const getEventTypeLabel = ({ label, value, color }, text) => ({
  label: (
    <div className="d-inline-flex">
      {text && <span className="mr-1">{text}</span>}
      {color && (
        <div className="color-box mr-1" style={{ backgroundColor: color }} />
      )}
      <span>{label}</span>
    </div>
  ),
  value: value,
  color,
});
