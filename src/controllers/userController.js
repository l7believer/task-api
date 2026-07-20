const User = require('../models/user');

// POST /api/users - tạo user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Insufficient information' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users/:id - chi tiết user
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'Retrieve user details successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users - danh sách user
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
            order: [['id', 'DESC']]
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            message: 'Retrieve users successfully',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/:id - cập nhật user
exports.updateUser = async (req, res) => {
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
};

// DELETE /api/users/:id - xóa user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
