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
    {
      name: 'settings',
      enabled: policy.perform('features:settings').on(null),
    },
  ];
};

export default features;
