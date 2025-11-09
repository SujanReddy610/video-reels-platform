import sequelize from './config/db.js';
import User from './models/User.js';
import Video from './models/Video.js';

const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected...');

    // Creates tables if they don’t exist
    await sequelize.sync({ alter: true }); 
    console.log('✅ Tables synced successfully');
  } catch (err) {
    console.error('❌ Error syncing database:', err);
  } finally {
    await sequelize.close();
  }
};

syncDb();
