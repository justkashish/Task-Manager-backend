const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const { authenticate } = require("../middleware/auth");



// GET all tasks

router.get('/', authenticate, async(req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error fetching tasks');
        console.log(err);
    }
});

// POST a new task
router.post('/', authenticate, async(req, res) => {
    try {
        const { title, description } = req.body;

        // Validate request data
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Create a new task
        const newTask = new Task({
            title,
            description,
            status: 'pending',
            userId: req.user.userId, // `req.user` is populated by the authentication middleware
        });

        // Save the task to the database
        const savedTask = await newTask.save();

        res.status(201).json({ message: 'Task created successfully', task: savedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH to update a task's status
router.put('/:id', authenticate, async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).send('Error updating task');
    }
});

// DELETE a task
router.delete('/:id', authenticate, async(req, res) => {
    const { id } = req.params;

    try {
        await Task.findByIdAndDelete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send('Error deleting task');
    }
});

module.exports = router;