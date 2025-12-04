const { sequelize } = require('../config/db');
const { User } = require('../models');

const deleteAllUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    // Sync to ensure associations are correct before deleting
    await sequelize.sync({ alter: true });

    const count = await User.count();
    console.log(`Found ${count} users. Deleting...`);

    await User.destroy({
      where: {},
      truncate: false, // Use destroy to trigger hooks/cascades if any, though truncate is faster
      cascade: true,
      force: true 
    });

    console.log('All users deleted successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting users:', error);
    process.exit(1);
  }
};

deleteAllUsers();
