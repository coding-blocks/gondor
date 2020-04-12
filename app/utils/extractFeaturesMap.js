const extractFeaturesMap = viewer =>
  viewer.features.reduce(
    (m, { name, enabled }) => ((m[name] = enabled) || true) && m,
    {},
  );

export default extractFeaturesMap;
