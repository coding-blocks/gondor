import Policy from 'Services/AuthorizationPolicy';

const features = obj => {
  const concerns = Policy.for(obj.user).gather(undefined, 'features').concerns;

  return Object.keys(concerns).map(name => ({
    name,
    enabled: !!concerns[name],
  }));
};

export default features;
