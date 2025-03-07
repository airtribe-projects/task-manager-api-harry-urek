const { readTasks, writeTasks, generateId } = require('../utils/tasksUtil');

const getAllTasks = (req, res) => {
    let tasks = readTasks();

    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        tasks = tasks.filter(task => task.completed === completed);
    }

    if (req.query.sort === 'createdAt') {
        tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

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
    const { title, description, completed, priority } = req.body;


    if (!title.trim() || !description.trim() || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input: title, description, and completed are required' });
    }


    const taskPriority = priority || 'low';

    const tasks = readTasks();
    const newTask = {
        id: generateId(tasks),
        title,
        description,
        completed,
        priority: taskPriority, //  default to 'low'
        createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
};


const updateTask = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, completed, priority } = req.body;


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
        priority: priority || tasks[taskIndex].priority,
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


const getTasksByPriority = (req, res) => {
    const { level } = req.params;
    const tasks = readTasks();

    if (!['low', 'medium', 'high'].includes(level)) {
        return res.status(400).json({ message: 'Invalid priority level. Must be one of: low, medium, high' });
    }

    const filteredTasks = tasks.filter(task => task.priority === level);
    res.status(200).json(filteredTasks);
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByPriority,
};
