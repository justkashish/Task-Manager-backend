const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async(req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Login Route
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;