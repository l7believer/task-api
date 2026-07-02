const express = require('express');
const app = express();
const port = 3000;

// Import database and models
const sequelize = require('./src/models/index');
const User = require('./src/models/user'); 

// Middleware to parse JSON bodies
app.use(express.json());

// Sync database models
sequelize.sync().then(() => {
    console.log('[Database] Models synchronized successfully.');
}).catch((error) => {
    console.error('[Database] Sync failed:', error.message);
});

// Health check endpoint
app.get('/api/hello', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

// Create dummy user endpoint (testing purposes)
app.post('/api/users', async (req, res) => {
    try {
        const newUser = await User.create({
            name: 'Name',
            email: 'email@gmail.com',
            password: 'password'
        });
        
        res.status(201).json({ 
            message: 'User created successfully', 
            data: newUser 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`[Server] Running on http://localhost:${port}`);
});