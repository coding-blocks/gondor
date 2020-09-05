import moment from 'moment';

export const defaultTypeFilter = {
  label: 'Any',
  value: undefined,
};

export const getDefaultDateTimeRange = () => ({
  start_at: moment().startOf('month').startOf('week').format(),
  end_at: moment().endOf('month').endOf('week').format(),
});

export const getEventTypeOption = ({ name, title, color }) => ({
  label: (
    <div className="d-inline-flex">
      <div className="color-box mr-2" style={{ backgroundColor: color }} />
      <span>{title}</span>
    </div>
  ),
  value: name,
  title: title,
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
