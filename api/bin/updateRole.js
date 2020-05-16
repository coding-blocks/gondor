import Models from 'Models';

const username = process.argv[2];
const role = process.argv[3];

if (!username || !role) process.exit();

Models.User.update({ role }, { where: { username } });
