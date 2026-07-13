const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'done'),
        defaultValue: 'todo'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    }
});

module.exports = Task;