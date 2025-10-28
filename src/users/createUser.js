const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

router.post('/users/create', (req, res) => {
    const usersDir = path.join(process.cwd(), 'prisma', 'users');
    fs.mkdirSync(usersDir, { recursive: true });
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const userFilePath = path.join(usersDir, `${username}.json`);
    if (fs.existsSync(userFilePath)) {
        return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const userData = {
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));
    res.status(201).json({ message: 'User created successfully' });
});

module.exports = router;