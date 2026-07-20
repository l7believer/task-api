const express = require('express');
const app = express();
const port = 3000;

const sequelize = require('./src/models/index');

require('./src/models/associations');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const tagRoutes = require('./src/routes/tagRoutes');

app.use(express.json());

sequelize.sync({ alter: true }).then(() => {
    console.log('[Database] Models synchronized successfully.');
}).catch((error) => {
    console.error('[Database] Sync failed:', error.message);
});

app.get('/api/hello', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tags', tagRoutes);

app.listen(port, () => {
    console.log(`[Server] Running on http://localhost:${port}`);
});
