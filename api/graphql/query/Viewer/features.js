import AuthPolicy from 'Services/AuthorizationPolicy';

const features = async (parent) => {
  const policy = AuthPolicy.can(parent.user);

  return [
    {
      name: 'teamManagement',
      enabled: policy.perform('features:teamManagement').on(null),
    },
    {
      name: 'calendar',
      enabled: policy.perform('features:calendar').on(null),
    },
  ];
};

export default features;
