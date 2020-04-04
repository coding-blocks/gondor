import Policy from 'Services/AuthorizationPolicy';

const features = async parent => {
  const concerns = await Policy.for(parent.user).gather(undefined, 'features')
    .concerns;

  return Object.keys(concerns).map(name => ({
    name,
    enabled: !!concerns[name],
  }));
};

export default features;
