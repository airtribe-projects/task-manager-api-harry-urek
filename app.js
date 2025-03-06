const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to the task.json file
const tasksFilePath = path.join(__dirname, 'task.json');

// Helper function to read tasks from the JSON file
const readTasks = () => {
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data).tasks;
};

// Helper function to write tasks to the JSON file
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify({ tasks }, null, 2));
};

// GET /tasks: Retrieve all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.status(200).json(tasks);
});

// GET /tasks/:id: Retrieve a specific task by its ID
app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
});

// POST /tasks: Create a new task with the required fields (title, description, completed)
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;

    // Input validation
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input: title, description, and completed are required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1, // Auto-generate ID
        title,
        description,
        completed,
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
});

// PUT /tasks/:id: Update an existing task by its ID
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, completed } = req.body;

    // Input validation
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input: title, description, and completed are required' });
    }

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        completed,
    };

    writeTasks(tasks);

    res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id: Delete a task by its ID
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the task
    tasks.splice(taskIndex, 1);
    writeTasks(tasks);

    res.status(200).json({ message: 'Task deleted successfully' });
});

// Start the server
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;