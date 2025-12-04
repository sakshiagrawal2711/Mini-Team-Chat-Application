const { sequelize } = require('../config/db');
const { User } = require('../models');

const checkUsers = async () => {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log('Users in DB:', users.map(u => u.username));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
