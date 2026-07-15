const express = require('express');
const app = express();
const port = 3000;

const sequelize = require('./src/models/index');
const User = require('./src/models/user'); 
const Task = require('./src/models/task');
const Tag = require('./src/models/tag');

app.use(express.json());

// User - Task
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Task - Tag
Task.hasMany(Tag, { foreignKey: 'task_id', as: 'tags' });
Tag.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

sequelize.sync({ alter: true }).then(() => {
    console.log('[Database] Models synchronized successfully.');
}).catch((error) => {
    console.error('[Database] Sync failed:', error.message);
});

app.get('/api/hello', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

//Tạo user mới
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Insufficient information' });
        }

        const user = await User.create({
            name: name,
            email: email,
            password: password
        });

        res.status(201).json({ 
            message: 'User created successfully', 
            data: user 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//In user theo trang
app.get('/api/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            message: 'Retrieve users successfully',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Cập nhật user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            name: name || user.name,
            email: email || user.email,
            password: password || user.password
        });

        res.status(200).json({
            message: 'User updated successfully',
            data: user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Xóa user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();

        res.status(200).json({
            message: 'User deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Tạo Task mới
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, status, priority, user_id } = req.body;

        if (!title || !user_id) {
            return res.status(400).json({ error: 'Title and user_id are required' });
        }

        const task = await Task.create({ title, description, status, priority, user_id });
        res.status(201).json({ message: 'Task created successfully', data: task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//In task theo trang
app.get('/api/tasks', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Task.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });

        res.status(200).json({
            message: 'Retrieve tasks successfully',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit: limit
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Cập nhật Task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;

        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await task.update({
            title: title || task.title,
            description: description !== undefined ? description : task.description,
            status: status || task.status,
            priority: priority || task.priority
        });

        res.status(200).json({ message: 'Task updated successfully', data: task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Xóa Task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Tạo Tag mới
app.post('/api/tags', async (req, res) => {
    try {
        const { name, task_id } = req.body;

        if (!name || !task_id) {
            return res.status(400).json({ error: 'Title and task_id are required' });
        }

        const tag = await Tag.create({ name, task_id });
        res.status(201).json({ message: 'Tag created successfully', data: tag });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//In tag theo trang
app.get('/api/tags', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Tag.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });

        res.status(200).json({
            message: 'Retrieve tags successfully',
            data: rows,
            pagination: { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: page, limit }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Cập nhật Tag
app.put('/api/tags/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const tag = await Tag.findByPk(id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });

        await tag.update({ name: name || tag.name });
        res.status(200).json({ message: 'Tag updated successfully', data: tag });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Xóa Tag
app.delete('/api/tags/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findByPk(id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });

        await tag.destroy();
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`[Server] Running on http://localhost:${port}`);
});