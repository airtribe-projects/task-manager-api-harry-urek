const { readTasks, writeTasks, generateId } = require('../utils/tasksUtil');

const getAllTasks = (req, res) => {
    const tasks = readTasks();
    res.status(200).json(tasks);
};


const getTaskById = (req, res) => {
    const tasks = readTasks();
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
};


const createTask = (req, res) => {
    const { title, description, completed } = req.body;

    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input: title, description, and completed are required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: generateId(),
        title,
        description,
        completed,
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
};


const updateTask = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, completed } = req.body;

    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input: title, description, and completed are required' });
    }

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        completed,
    };

    writeTasks(tasks);

    res.status(200).json(tasks[taskIndex]);
};


const deleteTask = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);

    res.status(200).json({ message: 'Task deleted successfully' });
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};