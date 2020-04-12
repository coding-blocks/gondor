import Policy from 'Services/AuthorizationPolicy';

const features = async parent => {
  const policy = new Policy(parent.user);

  return [
    {
      name: 'teamManagement',
      enabled: policy.authorize(':teamManagement').on(null, 'features'),
    },
    {
      name: 'calendar',
      enabled: policy.authorize(':calendar').on(null, 'features'),
    },
  ];
};

export default features;
