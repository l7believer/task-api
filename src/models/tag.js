const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
});

module.exports = Tag;