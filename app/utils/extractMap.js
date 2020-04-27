const extractMap = (
  obj = [],
  { key = '', label = 'label', value = 'value' } = {
    key: '',
    label: 'label',
    value: 'value',
  },
) =>
  (!!key ? obj[key] : obj).reduce(
    (m, item) => ((m[item[label]] = item[value]) || true) && m,
    {},
  );

export default extractMap;
