const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
);

// Authenticate database connection
sequelize.authenticate()
    .then(() => {
        console.log('[PostgreSQL] Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('[PostgreSQL] Unable to connect to the database:', error.message);
    });

module.exports = sequelize;