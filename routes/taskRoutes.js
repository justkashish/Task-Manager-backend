const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// GET all tasks
router.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error fetching tasks');
        console.log(err);
    }
});

// POST a new task
router.post('/tasks', async(req, res) => {
    const { title, description } = req.body;
    const newTask = new Task({ title, description, status: 'pending' });

    try {
        await newTask.save();
        res.json(newTask);
    } catch (err) {
        res.status(500).send('Error adding task');
    }
});

// PATCH to update a task's status
router.put('/tasks/:id', async(req, res) => {
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
router.delete('/tasks/:id', async(req, res) => {
    const { id } = req.params;

    try {
        await Task.findByIdAndDelete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send('Error deleting task');
    }
});

module.exports = router;