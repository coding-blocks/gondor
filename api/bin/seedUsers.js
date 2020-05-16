import Models from 'Models';

const names = [
  'Adams',
  'Baker',
  'Clark',
  'Davis',
  'Evans',
  'Frank',
  'Ghosh',
  'Hills',
  'Irwin',
  'Jones',
  'Klein',
  'Lopez',
  'Mason',
  'Nalty',
  'Ochoa',
  'Patel',
  'Quinn',
  'Reily',
  'Smith',
  'Trott',
  'Usman',
  'Valdo',
  'White',
  'Xiang',
  'Yakub',
  'Zafar',
];

Models.User.bulkCreate(
  names.map((name) => ({
    username: name.toLowerCase(),
    role: 'Member',
    firstname: name,
    lastname: names[Math.floor(Math.random() * names.length)],
  })),
);
