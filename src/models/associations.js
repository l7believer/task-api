const User = require('./user');
const Task = require('./task');
const Tag = require('./tag');

// User - Task: 1 user có nhiều task
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Task - Tag: 1 task có nhiều tag
Task.hasMany(Tag, { foreignKey: 'task_id', as: 'tags' });
Tag.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

module.exports = { User, Task, Tag };
