const express = require('express');
const app = express();
const port = 3000;

// Import database and models
const sequelize = require('./src/models/index');
const User = require('./src/models/user'); 
const Task = require('./src/models/task');
const Tag = require('./src/models/tag');

// Middleware to parse JSON bodies
app.use(express.json());

// User - Task
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Task - Tag
Task.hasMany(Tag, { foreignKey: 'task_id', as: 'tags' });
Tag.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// Sync database models
sequelize.sync({ alter: true }).then(() => {
    console.log('[Database] Models synchronized successfully.');
}).catch((error) => {
    console.error('[Database] Sync failed:', error.message);
});

// Health check endpoint
app.get('/api/hello', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

app.post('/api/users', async (req, res) => {
    try {
        const user = await User.create({
            name: 'Name1',
            email: 'email1@gmail.com',
            password: 'password'
        });

        const task = await Task.create({
            title: 'Phase 2',
            description: 'No descrip',
            status: 'in_progress',
            priority: 'high',
            user_id: user.id
        });

        const tag = await Tag.create({
            name: `abcde`,
            task_id: task.id
        });
        
        res.status(201).json({ 
            message: 'Created successfully', 
            data: { user, task, tag }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`[Server] Running on http://localhost:${port}`);
});