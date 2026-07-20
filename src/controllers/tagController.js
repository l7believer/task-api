const Tag = require('../models/tag');

// POST /api/tags - tạo tag
exports.createTag = async (req, res) => {
    try {
        const { name, task_id } = req.body;

        if (!name || !task_id) {
            return res.status(400).json({ error: 'Name and task_id are required' });
        }

        const tag = await Tag.create({ name, task_id });
        res.status(201).json({ message: 'Tag created successfully', data: tag });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/tags - danh sách tag
exports.getTags = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Tag.findAndCountAll({
            limit,
            offset,
            order: [['id', 'DESC']]
        });

        res.status(200).json({
            message: 'Retrieve tags successfully',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
