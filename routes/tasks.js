const express = require('express');
const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { jwtAuthWithRefresh } = require('../middlewares/auth');

const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('status')
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be one of: pending, in-progress, completed'),
];

// CREATE a new task
router.post('/', [
    jwtAuthWithRefresh,
    taskValidationRules
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return the array of validation errors
            return res.status(400).json({ success: false, err: errors.array()[0].msg });
        }
        const { title, description, status } = req.body;
        const task = new Task({ user: req.user.userId, title, description, status });
        await task.save();
        res.status(201).json({
            success: true
        });
    } catch (err) {
        res.status(400).json({ success: false, err: 'Internal server error!' });
    }
});

// READ all tasks
router.get('/', [
    jwtAuthWithRefresh
], async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.userId
        });
        res.json({
            success: true,
            tasks
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: 'Internal server error!' });
    }
});

// READ a specific task by id
router.get('/:id', [
    jwtAuthWithRefresh
], async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({
            success: true,
            task
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: 'Internal server error!' });
    }
});

// UPDATE a task by id
router.put('/:id', [
    jwtAuthWithRefresh,
    taskValidationRules
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return the array of validation errors
            return res.status(400).json({ success: false, err: errors.array()[0].msg });
        }
        const { title, description, status } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status },
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({
            success: true,
            task
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: 'Internal server error!' });
    }
});

// DELETE a task by id
router.delete('/:id', [
    jwtAuthWithRefresh
], async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ success: false, err: 'Task not found' });
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: 'Internal server error!' });
    }
});

module.exports = router;
