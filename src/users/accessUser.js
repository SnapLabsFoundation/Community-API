const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

router.post('/users/login', (req, res) => {
    const usersDir = path.join(process.cwd(), 'prisma', 'users');
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const userFilePath = path.join(usersDir, `${username}.json`);
    if (!fs.existsSync(userFilePath)) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (userData.password !== hashedPassword) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    res.status(200).json({ message: 'Login successful' });
});

module.exports = router;