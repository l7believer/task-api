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

//Cập nhật thông tin user theo id
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

//Xóa user theo id
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

app.listen(port, () => {
    console.log(`[Server] Running on http://localhost:${port}`);
});