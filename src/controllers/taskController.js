const Task = require('../models/task');
const Tag = require('../models/tag');

// POST /api/tasks - tạo task
exports.createTask = async (req, res) => {
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
};

// GET /api/tasks/:id - chi tiết task
exports.getTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByPk(id, {
            include: [
                {
                    model: Tag,
                    as: 'tags'
                }
            ]
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.status(200).json({
            message: 'Retrieve task details successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/tasks - danh sách task
exports.getTasks = async (req, res) => {
    try {
        const { status, priority } = req.query;

        const whereClause = {};
        if (status) whereClause.status = status;
        if (priority) whereClause.priority = priority;

        const tasks = await Task.findAll({
            where: whereClause,
            order: [['id', 'DESC']]
        });

        res.status(200).json({
            message: 'Retrieve tasks successfully',
            data: tasks
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/tasks/:id - cập nhật task
exports.updateTask = async (req, res) => {
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
};

// DELETE /api/tasks/:id - xóa task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
